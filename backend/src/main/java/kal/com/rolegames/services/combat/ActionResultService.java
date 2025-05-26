package kal.com.rolegames.services.combat;

import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.combat.ActionResult;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.items.Weapon;
import kal.com.rolegames.models.spells.Spell;
import kal.com.rolegames.models.util.ActionType;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class ActionResultService {

    private static final Logger logger = LoggerFactory.getLogger(ActionResultService.class);
    private final Random random = new Random();

    public ActionResult processAction(ActionType actionType, GameCharacter character,
                                      GameCharacter target, Item item, Spell spell,
                                      Boolean diceResult) {

        logger.info("[ACTION RESULT SERVICE] Processing action {} for character {}",
                actionType, character.getName());

        return switch (actionType) {
            case ATTACK -> processAttack(character, target, item, diceResult);
            case CAST_SPELL -> processCastSpell(character, target, spell, diceResult);
            case DASH -> processDash(character);
            case HELP -> processHelp(character, target);
            case HIDE -> processHide(character, diceResult);
            case READY -> processReady(character);
            case SEARCH -> processSearch(character, diceResult);
            case USE_ITEM -> processUseItem(character, target, item, diceResult);
            case BONUS_ACTION -> processBonusAction(character, item, spell, diceResult);
            case REACTION -> processReaction(character, target);
            default -> createFailureResult("Acción no implementada: " + actionType);
        };
    }

    private ActionResult processAttack(GameCharacter attacker, GameCharacter target,
                                       Item item, Boolean diceResult) {
        if (target == null) {
            return createFailureResult("No se especificó un objetivo para el ataque");
        }

        if (!diceResult) {
            return createFailureResult(
                    String.format("%s falló su ataque contra %s",
                            attacker.getName(), target.getName())
            );
        }

        int damage = 0;
        String damageRoll = null;
        Map<String, Integer> diceResults = new HashMap<>();
        StringBuilder description = new StringBuilder();
        description.append(String.format("%s ataca a %s", attacker.getName(), target.getName()));

        if (item instanceof Weapon weapon) {
            DamageRollResult damageResult = calculateWeaponDamage(weapon, attacker);
            damage = damageResult.totalDamage;
            damageRoll = damageResult.rollExpression;
            diceResults = damageResult.diceResults;
            description.append(String.format(" con %s", weapon.getName()));
        } else {
            // Ataque desarmado
            damage = 1 + attacker.getAbilityModifier(kal.com.rolegames.models.util.AbilityType.STRENGTH);
            damage = Math.max(1, damage); // Mínimo 1 de daño
            damageRoll = "1";
            diceResults.put("unarmed_1", 1);
            description.append(" con un ataque desarmado");
        }

        // Aplicar daño al objetivo
        target.setHitPoints(Math.max(0, target.getHitPoints() - damage));

        description.append(String.format(" causando %d puntos de daño", damage));

        //FALTA PONER WEBSOCKET PARA EL FRONT Y QUE LO MARQUE AL INSTANTE COMO INCONSCIENTE
        if (target.getHitPoints() <= 0) {
            description.append(String.format(". %s ha caído inconsciente!", target.getName()));
        }

        return ActionResult.builder()
                .success(true)
                .damageDealt(damage)
                .description(description.toString())
                .damageRoll(damageRoll)
                .diceResults(diceResults)
                .build();
    }

    private ActionResult processCastSpell(GameCharacter caster, GameCharacter target,
                                          Spell spell, Boolean diceResult) {
        if (spell == null) {
            return createFailureResult("No se especificó un hechizo para lanzar");
        }

        if (!diceResult) {
            return createFailureResult(
                    String.format("%s falló al lanzar %s", caster.getName(), spell.getName())
            );
        }

        int damage = 0;
        String damageRoll = null;
        Map<String, Integer> diceResults = new HashMap<>();
        StringBuilder description = new StringBuilder();
        description.append(String.format("%s lanza %s", caster.getName(), spell.getName()));

        if (target != null) {
            description.append(String.format(" sobre %s", target.getName()));
        }

        // Calcular daño del hechizo si tiene
        if (spell.getDamageDice() != null && !spell.getDamageDice().isEmpty()) {
            DamageRollResult damageResult = calculateSpellDamage(spell, caster);
            damage = damageResult.totalDamage;
            damageRoll = damageResult.rollExpression;
            diceResults = damageResult.diceResults;

            if (target != null && damage > 0) {
                target.setHitPoints(Math.max(0, target.getHitPoints() - damage));
                description.append(String.format(" causando %d puntos de daño", damage));

                if (target.getHitPoints() <= 0) {
                    description.append(String.format(". %s ha caído inconsciente!", target.getName()));
                }
            }
        } else {
            description.append(". El hechizo se ejecuta correctamente");
        }

        return ActionResult.builder()
                .success(true)
                .damageDealt(damage)
                .description(description.toString())
                .damageRoll(damageRoll)
                .diceResults(diceResults)
                .build();
    }

    private ActionResult processDash(GameCharacter character) {
        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(String.format("%s usa Dash, duplicando su velocidad de movimiento",
                        character.getName()))
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult processHelp(GameCharacter helper, GameCharacter target) {
        if (target == null) {
            return createFailureResult("No se especificó a quién ayudar");
        }

        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(String.format("%s ayuda a %s, otorgándole ventaja en su próxima tirada",
                        helper.getName(), target.getName()))
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult processHide(GameCharacter character, Boolean diceResult) {
        if (!diceResult) {
            return createFailureResult(
                    String.format("%s falló al intentar esconderse", character.getName())
            );
        }

        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(String.format("%s se esconde exitosamente", character.getName()))
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult processReady(GameCharacter character) {
        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(String.format("%s prepara una acción para ejecutar cuando se cumpla su condición",
                        character.getName()))
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult processSearch(GameCharacter character, Boolean diceResult) {
        if (!diceResult) {
            return createFailureResult(
                    String.format("%s busca pero no encuentra nada relevante", character.getName())
            );
        }

        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(String.format("%s busca y encuentra algo útil o detecta algo oculto",
                        character.getName()))
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult processUseItem(GameCharacter character, GameCharacter target,
                                        Item item, Boolean diceResult) {
        if (item == null) {
            return createFailureResult("No se especificó qué objeto usar");
        }

        if (!diceResult) {
            return createFailureResult(
                    String.format("%s falló al usar %s", character.getName(), item.getName())
            );
        }

        StringBuilder description = new StringBuilder();
        description.append(String.format("%s usa %s", character.getName(), item.getName()));

        if (target != null) {
            description.append(String.format(" en %s", target.getName()));
        }

        description.append(" con éxito");

        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(description.toString())
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult processBonusAction(GameCharacter character, Item item,
                                            Spell spell, Boolean diceResult) {
        StringBuilder description = new StringBuilder();
        description.append(String.format("%s realiza una acción adicional", character.getName()));

        if (item != null) {
            description.append(String.format(" usando %s", item.getName()));
        } else if (spell != null) {
            description.append(String.format(" lanzando %s", spell.getName()));
        }

        if (!diceResult) {
            description.append(" pero falla en el intento");
            return createFailureResult(description.toString());
        }

        description.append(" con éxito");

        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(description.toString())
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult processReaction(GameCharacter character, GameCharacter target) {
        StringBuilder description = new StringBuilder();
        description.append(String.format("%s usa su reacción", character.getName()));

        if (target != null) {
            description.append(String.format(" en respuesta a las acciones de %s", target.getName()));
        }

        return ActionResult.builder()
                .success(true)
                .damageDealt(0)
                .description(description.toString())
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    private ActionResult createFailureResult(String description) {
        return ActionResult.builder()
                .success(false)
                .damageDealt(0)
                .description(description)
                .damageRoll(null)
                .diceResults(new HashMap<>())
                .build();
    }

    // Clase interna para resultado de tiradas de daño
    private static class DamageRollResult {
        int totalDamage;
        String rollExpression;
        Map<String, Integer> diceResults;

        DamageRollResult(int totalDamage, String rollExpression, Map<String, Integer> diceResults) {
            this.totalDamage = totalDamage;
            this.rollExpression = rollExpression;
            this.diceResults = diceResults;
        }
    }

    // Clase interna para resultado de tiradas de dados detalladas
    private static class DiceRollResult {
        int total;
        Map<String, Integer> individualResults;

        DiceRollResult(int total, Map<String, Integer> individualResults) {
            this.total = total;
            this.individualResults = individualResults;
        }
    }

    private DamageRollResult calculateWeaponDamage(Weapon weapon, GameCharacter wielder) {
        String damageDice = weapon.getDamageDice();
        DiceRollResult diceRoll = rollDiceDetailed(damageDice);

        // Agregar modificador de habilidad
        int abilityModifier;
        if (weapon.getProperties().contains(kal.com.rolegames.models.util.WeaponProperty.FINESSE)) {
            int strMod = wielder.getAbilityModifier(kal.com.rolegames.models.util.AbilityType.STRENGTH);
            int dexMod = wielder.getAbilityModifier(kal.com.rolegames.models.util.AbilityType.DEXTERITY);
            abilityModifier = Math.max(strMod, dexMod);
        } else if (weapon.getRange() != null && weapon.getRange().isRanged()) {
            abilityModifier = wielder.getAbilityModifier(kal.com.rolegames.models.util.AbilityType.DEXTERITY);
        } else {
            abilityModifier = wielder.getAbilityModifier(kal.com.rolegames.models.util.AbilityType.STRENGTH);
        }

        int totalDamage = diceRoll.total + abilityModifier;

        if (weapon.getDamageBonus() != null) {
            totalDamage += weapon.getDamageBonus();
        }

        totalDamage = Math.max(1, totalDamage);

        // Construir expresión de daño
        StringBuilder rollExpression = new StringBuilder(damageDice);
        if (abilityModifier != 0) {
            rollExpression.append(abilityModifier >= 0 ? "+" : "").append(abilityModifier);
        }
        if (weapon.getDamageBonus() != null && weapon.getDamageBonus() != 0) {
            rollExpression.append(weapon.getDamageBonus() >= 0 ? "+" : "").append(weapon.getDamageBonus());
        }

        return new DamageRollResult(totalDamage, rollExpression.toString(), diceRoll.individualResults);
    }

    private DamageRollResult calculateSpellDamage(Spell spell, GameCharacter caster) {
        if (spell.getDamageDice() == null || spell.getDamageDice().isEmpty()) {
            return new DamageRollResult(0, null, new HashMap<>());
        }

        DiceRollResult diceRoll = rollDiceDetailed(spell.getDamageDice());

        // Agregar modificador de habilidad de lanzamiento de hechizos (simplificado)
        int spellcastingModifier = caster.getAbilityModifier(kal.com.rolegames.models.util.AbilityType.INTELLIGENCE);

        int totalDamage = Math.max(1, diceRoll.total + spellcastingModifier);

        // Construir expresión de daño
        StringBuilder rollExpression = new StringBuilder(spell.getDamageDice());
        if (spellcastingModifier != 0) {
            rollExpression.append(spellcastingModifier >= 0 ? "+" : "").append(spellcastingModifier);
        }

        return new DamageRollResult(totalDamage, rollExpression.toString(), diceRoll.individualResults);
    }

    private DiceRollResult rollDiceDetailed(String diceExpression) {
        Map<String, Integer> results = new HashMap<>();
        int total = 0;

        try {
            if (diceExpression.contains("d")) {
                String[] parts = diceExpression.split("d");
                int numberOfDice = Integer.parseInt(parts[0]);
                int sidesOfDie = Integer.parseInt(parts[1]);

                for (int i = 1; i <= numberOfDice; i++) {
                    int roll = random.nextInt(sidesOfDie) + 1;
                    results.put("d" + sidesOfDie + "_" + i, roll);
                    total += roll;
                }
            } else {
                int fixedValue = Integer.parseInt(diceExpression);
                results.put("fixed_1", fixedValue);
                total = fixedValue;
            }
        } catch (Exception e) {
            logger.warn("Error parsing dice expression: {}", diceExpression);
            results.put("error_1", 1);
            total = 1;
        }

        return new DiceRollResult(total, results);
    }

    private int rollDice(String diceExpression) {
        return rollDiceDetailed(diceExpression).total;
    }
}