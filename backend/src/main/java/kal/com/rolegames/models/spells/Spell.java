package kal.com.rolegames.models.spells;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.DamageType;
import kal.com.rolegames.models.util.SpellComponent;
import kal.com.rolegames.models.util.SpellSchool;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "spells")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Spell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spell_id")
    @EqualsAndHashCode.Include
    private Long spellId;

    @Basic(optional = false)
    private String name;

    @Basic(optional = false)
    private Integer level;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private SpellSchool school;

    @Basic(optional = false)
    private String castingTime;

    @Basic(optional = false)
    private String range;

    @ElementCollection
    @CollectionTable(name = "spell_components",
            joinColumns = @JoinColumn(name = "spell_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "component")
    private Set<SpellComponent> components = new HashSet<>();

    @Basic(optional = false)
    private String duration;

    @Lob
    @Basic(optional = false)
    private String description;

    @Lob
    private String higherLevelEffects;

    @Enumerated(EnumType.STRING)
    private DamageType damageType;

    private String damageDice;

    @Enumerated(EnumType.STRING)
    private AbilityType savingThrow;

    @Basic(optional = false)
    private Boolean ritual;

    @Basic(optional = false)
    private Boolean concentration;

    private String materialComponents;

    @ManyToMany(mappedBy = "spells")
    private Set<PlayerCharacter> characters = new HashSet<>();

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public boolean isCantrip() {
        return level == 0;
    }

    public boolean requiresConcentration() {
        return concentration;
    }

    public boolean canCastAsRitual() {
        return ritual;
    }

    public boolean requiresSavingThrow() {
        return savingThrow != null;
    }

    public String getFullDescription() {
        StringBuilder sb = new StringBuilder();

        sb.append(name).append(" (Level ").append(level).append(" ").append(school).append(")");
        sb.append("\nCasting Time: ").append(castingTime);
        sb.append("\nRange: ").append(range);
        sb.append("\nComponents: ");

        for (SpellComponent component : components) {
            sb.append(component.name().charAt(0));
            if (component == SpellComponent.MATERIAL && materialComponents != null) {
                sb.append(" (").append(materialComponents).append(")");
            }
        }

        sb.append("\nDuration: ").append(duration);
        if (concentration) {
            sb.append(" (Concentration)");
        }

        sb.append("\n\n").append(description);

        if (higherLevelEffects != null && !higherLevelEffects.isEmpty()) {
            sb.append("\n\nAt Higher Levels: ").append(higherLevelEffects);
        }

        return sb.toString();
    }
}