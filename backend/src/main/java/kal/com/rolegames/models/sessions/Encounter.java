package kal.com.rolegames.models.sessions;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.combat.CombatState;
import kal.com.rolegames.models.items.Reward;
import kal.com.rolegames.models.util.DifficultyLevel;
import kal.com.rolegames.models.util.EncounterType;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "encounters")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Encounter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "encounter_id")
    @EqualsAndHashCode.Include
    private Long encounterId;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;

    @Basic(optional = false)
    private String name;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private EncounterType encounterType;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private DifficultyLevel difficulty;

    @ManyToMany
    @JoinTable(
            name = "encounter_participants",
            joinColumns = @JoinColumn(name = "encounter_id"),
            inverseJoinColumns = @JoinColumn(name = "character_id")
    )
    private Set<GameCharacter> participants = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "encounter_id")
    private Set<Reward> rewards = new HashSet<>();

    @Basic(optional = false)
    private Boolean isCompleted;

    @Lob
    private String notes;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "combat_state_id")
    private CombatState combatState;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public void addParticipant(GameCharacter character) {
        participants.add(character);
    }

    public void removeParticipant(GameCharacter character) {
        participants.remove(character);
    }

    public void addReward(Reward reward) {
        rewards.add(reward);
    }

    public void removeReward(Reward reward) {
        rewards.remove(reward);
    }

    public void startCombat() {
        if(encounterType.equals(EncounterType.COMBAT) && combatState == null){
            CombatState newCombat = CombatState.builder().encounter(this).currentRound(1).isActive(true).build();
            setCombatState(newCombat);
        }
    }

    public void endCombat() {
        // TODO: Check if combatState is not null
        // TODO: If so, set its isActive to false
        if (combatState != null) {
            combatState.setIsActive(false);
        }
    }
}