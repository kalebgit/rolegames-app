package kal.com.rolegames.models.combat;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.effects.Effect;
import kal.com.rolegames.models.sessions.Encounter;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "combat_states")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CombatState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "combat_state_id")
    @EqualsAndHashCode.Include
    private Long combatStateId;

    @OneToOne(mappedBy = "combatState")
    private Encounter encounter;

    @Basic(optional = false)
    private Integer currentRound;

    @OneToMany(mappedBy = "combatState", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("initiativeRoll DESC")
    private List<Initiative> initiativeOrder = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "combat_state_id")
    private Set<Effect> activeEffects = new HashSet<>();

    @Basic(optional = false)
    private Boolean isActive;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime startTime;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "combat", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("timestamp ASC")
    private List<CombatAction> actionHistory = new ArrayList<>();

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public void addParticipant(GameCharacter character, int initiativeRoll) {
        initiativeOrder.add(Initiative.builder().combatState(this).character(character).initiativeRoll(initiativeRoll)
                .currentTurn(false).hasActed(false).bonusActionsUsed(0).reactionsUsed(0).reactionsUsed(0)
                .movementUsed(0).build());
        initiativeOrder.sort((a, b)-> b.getInitiativeRoll() - a.getInitiativeRoll());
    }

    public void startCombat() {
        isActive = true;
        startTime = LocalDateTime.now();
        currentRound = 1;
        if(!initiativeOrder.isEmpty()){
            initiativeOrder.get(0).setCurrentTurn(true);
        }
    }

    public void endCombat() {
        isActive = false;
        endTime = LocalDateTime.now();
        for(Initiative ini : initiativeOrder){
            ini.setCurrentTurn(false);
        }
    }

    public void nextTurn() {
        // el indice actual
        int index = -1;
        for(int i=0; i < initiativeOrder.size();i++){
            if(initiativeOrder.get(i).getCurrentTurn()){
                index = i;
                break;
            }
        }
        if(index >=0){
            Initiative current = initiativeOrder.get(index);
            current.setCurrentTurn(false);
            current.setHasActed(true);

        }

        //al final es como un arreglo circular
        int nextIndex = (index + 1) % initiativeOrder.size();
        //cuando volvemos a empezar una nueva ronda
        if(nextIndex == 0){
            currentRound++;
            for(Initiative initiative : initiativeOrder){
                initiative.setHasActed(false);
                initiative.setBonusActionsUsed(0);
                initiative.setReactionsUsed(0);
                initiative.setMovementUsed(0);
            }
        }

        Initiative next = initiativeOrder.get(nextIndex);
        next.setCurrentTurn(true);
    }

    public Initiative getCurrentTurnParticipant() {
        return initiativeOrder.stream().filter(initiative -> initiative.getCurrentTurn()).findFirst().orElseThrow(NoSuchElementException::new); // Default return for compilation
    }

    public void addAction(CombatAction action) {
        actionHistory.add(action);
        action.setCombat(this);
    }
}