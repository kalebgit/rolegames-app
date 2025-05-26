package kal.com.rolegames.services.combat;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.combat.CombatActionDTO;
import kal.com.rolegames.dto.combat.PerformActionRequest;
import kal.com.rolegames.mappers.combat.CombatActionMapper;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.combat.ActionResult;
import kal.com.rolegames.models.combat.CombatAction;
import kal.com.rolegames.models.combat.CombatState;
import kal.com.rolegames.models.combat.Initiative;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.spells.Spell;
import kal.com.rolegames.models.util.ActionType;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import kal.com.rolegames.repositories.combat.CombatStateRepository;
import kal.com.rolegames.repositories.items.ItemRepository;
import kal.com.rolegames.repositories.spells.SpellRepository;
import kal.com.rolegames.websockets.EncounterWebSocketService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class CombatActionService {

    private final CombatStateRepository combatStateRepository;
    private final GameCharacterRepository characterRepository;

    //faltan los repositories de las acciones

    private final ItemRepository itemRepository;
    private final SpellRepository spellRepository;

    private final ActionResultService actionResultService;
    private final EncounterWebSocketService webSocketService;

    private final CombatActionMapper combatActionMapper;

    private static final Logger logger = LoggerFactory.getLogger(CombatActionService.class);

    @Transactional
    public CombatActionDTO performAction(PerformActionRequest request) {
        logger.info("[COMBAT ACTION SERVICE] Processing action {} for character {}",
                request.getActionType(), request.getCharacterId());

        // Obtener el combate activo
        CombatState activeCombat = combatStateRepository.findByIsActiveTrue()
                .orElseThrow(() -> new IllegalStateException("No hay combate activo"));

        // Obtener el personaje que realiza la acción
        GameCharacter character = characterRepository.findById(request.getCharacterId())
                .orElseThrow(() -> new NoSuchElementException("Personaje no encontrado"));

        // Verificar que el personaje puede realizar la acción
        validateCanPerformAction(activeCombat, character, request.getActionType());

        // Obtener entidades relacionadas
        GameCharacter target = null;
        if (request.getTargetId() != null) {
            target = characterRepository.findById(request.getTargetId())
                    .orElseThrow(() -> new NoSuchElementException("Objetivo no encontrado"));
        }

        Item item = null;
        if (request.getItemId() != null) {
            item = itemRepository.findById(request.getItemId())
                    .orElseThrow(() -> new NoSuchElementException("Objeto no encontrado"));
        }

        Spell spell = null;
        if (request.getSpellId() != null) {
            spell = spellRepository.findById(request.getSpellId())
                    .orElseThrow(() -> new NoSuchElementException("Hechizo no encontrado"));
        }

        // Procesar el resultado de la acción
        ActionResult result = actionResultService.processAction(
                request.getActionType(), character, target, item, spell, request.getDiceResult()
        );

        // Crear la acción de combate
        CombatAction combatAction = CombatAction.builder()
                .combat(activeCombat)
                .character(character)
                .actionType(request.getActionType())
                .target(target)
                .item(item)
                .spell(spell)
                .result(result)
                .build();

        // Agregar la acción al combate
        activeCombat.addAction(combatAction);

        // Actualizar el estado de la iniciativa
        updateInitiativeState(activeCombat, character, request.getActionType());

        // Guardar el combate actualizado
        CombatState updatedCombat = combatStateRepository.save(activeCombat);

        // Buscar la acción guardada en el historial
        CombatAction savedAction = updatedCombat.getActionHistory()
                .get(updatedCombat.getActionHistory().size() - 1);

        logger.info("[COMBAT ACTION SERVICE] Action {} completed successfully",
                request.getActionType());

        CombatActionDTO resultAction = combatActionMapper.toDTO(savedAction);

        // Obtener encounterId del combate activo
        Long encounterId = activeCombat.getEncounter().getEncounterId();

        // Notificar acción realizada
        webSocketService.notifyActionPerformed(encounterId, resultAction);

        // Si hubo daño, notificar actualización de salud
        if (resultAction.getResult().getDamageDealt() > 0 && request.getTargetId() != null) {
            GameCharacter targetDamaged = characterRepository.findById(request.getTargetId()).orElse(null);
            if (targetDamaged != null) {
                webSocketService.notifyHealthUpdate(encounterId,
                        targetDamaged.getCharacterId(), targetDamaged.getHitPoints());
            }
        }

        return resultAction;
    }

    private void validateCanPerformAction(CombatState combat, GameCharacter character,
                                          ActionType actionType) {
        // Buscar la iniciativa del personaje
        Initiative initiative = combat.getInitiativeOrder().stream()
                .filter(init -> init.getCharacter().equals(character))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "El personaje no participa en este combate"));

        // Verificar que es su turno
        if (!initiative.getCurrentTurn()) {
            throw new IllegalStateException("No es el turno de este personaje");
        }

        // Verificar restricciones según el tipo de acción
        switch (actionType) {
            case ATTACK, CAST_SPELL, DASH, HELP, HIDE, READY, SEARCH, USE_ITEM -> {
                if (!initiative.canTakeAction()) {
                    throw new IllegalStateException("El personaje ya ha usado su acción principal");
                }
            }
            case BONUS_ACTION -> {
                if (!initiative.canTakeBonusAction()) {
                    throw new IllegalStateException("El personaje ya ha usado su acción adicional");
                }
            }
            case REACTION -> {
                if (!initiative.canTakeReaction()) {
                    throw new IllegalStateException("El personaje ya ha usado su reacción");
                }
            }
        }
    }

    private void updateInitiativeState(CombatState combat, GameCharacter character,
                                       ActionType actionType) {
        Initiative initiative = combat.getInitiativeOrder().stream()
                .filter(init -> init.getCharacter().equals(character))
                .findFirst()
                .orElseThrow();

        // Marcar la acción como usada según su tipo
        switch (actionType) {
            case ATTACK, CAST_SPELL, DASH, HELP, HIDE, READY, SEARCH, USE_ITEM ->
                    initiative.useAction();
            case BONUS_ACTION ->
                    initiative.useBonusAction();
            case REACTION ->
                    initiative.useReaction();
        }
    }
}