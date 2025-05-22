package kal.com.rolegames.models.items;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.ArmorType;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@PrimaryKeyJoinColumn(name = "armor_id")
//lombok annotations
@SuperBuilder
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@ToString(callSuper = true)
public class Armor extends Item {

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private ArmorType armorType;

    @Basic(optional = false)
    private Integer baseArmorClass;

    private Integer strengthRequirement;

    private Boolean stealthDisadvantage;

    private Integer magicalBonus;

    public Integer calculateArmorClass(GameCharacter wearer) {
        int ac = baseArmorClass;

        switch (armorType) {
            case LIGHT:
                ac += wearer.getAbilityModifier(AbilityType.DEXTERITY);
                break;
            case MEDIUM:
                ac += Math.min(2, wearer.getAbilityModifier(AbilityType.DEXTERITY));
                break;
            case HEAVY:
                break;
            case SHIELD:
                break;
        }

        // Add magical bonus if any
        if (magicalBonus != null) {
            ac += magicalBonus;
        }

        return ac;
    }

    public boolean canBeWornBy(GameCharacter character) {
        if (strengthRequirement != null && strengthRequirement > 0) {
            Integer strScore = character.getAbilities().get(AbilityType.STRENGTH);
            if (strScore == null || strScore < strengthRequirement) {
                return false;
            }
        }

        return true;
    }}