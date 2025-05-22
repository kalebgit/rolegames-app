package kal.com.rolegames.models.items;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.DamageType;
import kal.com.rolegames.models.util.WeaponProperty;
import kal.com.rolegames.models.util.WeaponType;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@PrimaryKeyJoinColumn(name = "weapon_id")
//lombok annotations
@SuperBuilder
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@ToString(callSuper = true)
public class Weapon extends Item {

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private WeaponType weaponType;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private DamageType damageType;

    @Basic(optional = false)
    private String damageDice;

    private Integer damageBonus;

    @ElementCollection
    @CollectionTable(name = "weapon_properties",
            joinColumns = @JoinColumn(name = "weapon_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "property")
    private Set<WeaponProperty> properties = new HashSet<>();

    @Embedded
    private Range range;

    private Boolean isMagical;

    private Integer attackBonus;

    public void addProperty(WeaponProperty property) {
        properties.add(property);
    }

    public void removeProperty(WeaponProperty property) {
        properties.remove(property);
    }

    // Method to calculate the total attack bonus for a character using this weapon
    // Should consider weapon's attack bonus, ability modifiers based on weapon type, and proficiency if applicable
    public Integer getTotalAttackBonus(GameCharacter wielder, Boolean isProficient) {
        // TODO: Calculate base total from attackBonus (if not null)
        // TODO: Add ability modifier (STR or DEX based on weapon type and properties)
        // TODO: Add proficiency bonus if character is proficient
        // TODO: Return the total bonus
        int total = 0;

        if(attackBonus != null){
            total +=attackBonus;
        }

        // ver cualidades del personaje
        if (hasProperty(WeaponProperty.FINESSE)) {
            // usa lo que tenga mejor de modficador de fuerza o destreza
            int strMod = wielder.getAbilityModifier(AbilityType.STRENGTH);
            int dexMod = wielder.getAbilityModifier(AbilityType.DEXTERITY);
            total += Math.max(strMod, dexMod);
        } else if (isRanged()) {
            total += wielder.getAbilityModifier(AbilityType.DEXTERITY);
        } else {
            total += wielder.getAbilityModifier(AbilityType.STRENGTH);
        }

        if (isProficient) {
            total += wielder.getProficiencyBonus();
        }

        return total;
    }

    // Regresa un string en formato "XdY+Z" done X es el numero de dados Y es el tipo de dado (num caras), y Z el bonus
    public String getTotalDamage(GameCharacter wielder) {
        // TODO: Determine the appropriate ability modifier to use (STR or DEX)
        // TODO: Calculate the total bonus from damageBonus and ability modifier
        // TODO: Return the damage formula as a string (e.g., "1d8+3")

        // modificador de habilidad para agregarselo al danio
        int abilityMod = 0;
        if (hasProperty(WeaponProperty.FINESSE)) {
            int strMod = wielder.getAbilityModifier(AbilityType.STRENGTH);
            int dexMod = wielder.getAbilityModifier(AbilityType.DEXTERITY);
            abilityMod = Math.max(strMod, dexMod);
        } else if (isRanged()) {
            abilityMod = wielder.getAbilityModifier(AbilityType.DEXTERITY);
        } else {
            abilityMod = wielder.getAbilityModifier(AbilityType.STRENGTH);
        }

        int totalBonus = (damageBonus != null ? damageBonus : 0) + abilityMod;

        return damageDice + (totalBonus >= 0 ? "+" + totalBonus : totalBonus);
    }

    private boolean hasProperty(WeaponProperty property) {
        return properties.contains(property);
    }

    private boolean isRanged() {
        return range != null && range.getNormal() > 5;
    }
}