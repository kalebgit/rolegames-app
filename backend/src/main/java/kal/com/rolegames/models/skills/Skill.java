package kal.com.rolegames.models.skills;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.ProficiencyLevel;
import kal.com.rolegames.models.util.SkillType;
import lombok.*;

@Entity
@Table(name = "skills")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    @EqualsAndHashCode.Include
    private Long skillId;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private SkillType skillType;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private ProficiencyLevel proficiencyLevel;

    private Integer bonusModifier;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public AbilityType getAssociatedAbility() {
        return skillType.getAssociatedAbility();
    }

    public int getSkillModifier() {
        // TODO: Start with ability modifier from character
        // TODO: Add proficiency bonus based on proficiency level (none, proficient, expertise)
        // TODO: Add any additional modifiers
        // TODO: Return the total
        int total = 0;
        total += character.getAbilityModifier(getAssociatedAbility());
        switch(proficiencyLevel){
            case PROFICIENT:
                total +=character.getProficiencyBonus();
                break;
            case EXPERTISE:
                total += character.getProficiencyBonus() * 2;
                break;
            default:
                break;
        }
        if(bonusModifier != null){
            total+=bonusModifier;
        }
        return total;
    }

    public int getPassiveScore() {
        return 10 + getSkillModifier();
    }

    public boolean hasProficiency() {
        return proficiencyLevel != ProficiencyLevel.NONE;
    }

    public boolean hasExpertise() {
        return proficiencyLevel == ProficiencyLevel.EXPERTISE;
    }
}