package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import kal.com.rolegames.models.effects.Effect;
import kal.com.rolegames.models.util.StateType;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "character_states")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CharacterState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_id")
    @EqualsAndHashCode.Include
    private Long stateId;

    @Basic(optional = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private StateType stateType;

    @Lob
    private String description;

    @OneToMany(mappedBy = "currentState")
    private Set<GameCharacter> characters = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "state_id")
    private Set<Effect> effects = new HashSet<>();

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public void addEffect(Effect effect) {
        effects.add(effect);
    }

    public void removeEffect(Effect effect) {
        effects.remove(effect);
    }

    public boolean isDisabled() {
        return stateType == StateType.UNCONSCIOUS ||
                stateType == StateType.PARALYZED ||
                stateType == StateType.PETRIFIED ||
                stateType == StateType.INCAPACITATED;
    }

    public boolean canTakeActions() {
        return !isDisabled(); // Default return for compilation
    }

    public boolean isNegativeState() {
        return stateType != StateType.NORMAL && stateType != StateType.INSPIRED; // Default return for compilation
    }
}