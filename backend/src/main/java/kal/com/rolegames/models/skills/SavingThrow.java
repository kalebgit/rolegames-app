package kal.com.rolegames.models.skills;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.util.AbilityType;
import lombok.*;

@Entity
@Table(name = "saving_throws")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SavingThrow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "saving_throw_id")
    @EqualsAndHashCode.Include
    private Long savingThrowId;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private AbilityType abilityType;

    @Basic(optional = false)
    private Boolean isProficient;

    private Boolean advantage;

    private Boolean disadvantage;

    private Integer bonusModifier;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public int getSavingThrowModifier() {
        int total = 0;

        total += character.getAbilityModifier(abilityType);

        if (isProficient) {
            total += character.getProficiencyBonus();
        }

        if (bonusModifier != null) {
            total += bonusModifier;
        }

        return total;
    }

    public boolean hasAdvantage() {
        return advantage != null && advantage;
    }

    public boolean hasDisadvantage() {
        return disadvantage != null && disadvantage;
    }
}