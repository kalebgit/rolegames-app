package kal.com.rolegames.models.combat;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import lombok.*;

@Entity
@Table(name = "initiatives")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Initiative {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "initiative_id")
    @EqualsAndHashCode.Include
    private Long initiativeId;

    @ManyToOne
    @JoinColumn(name = "combat_state_id", nullable = false)
    private CombatState combatState;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Basic(optional = false)
    private Integer initiativeRoll;

    @Basic(optional = false)
    private Boolean currentTurn;

    // soloi hay una accion por ronda
    @Basic(optional = false)
    private Boolean hasActed;

    // una accion adicional por ronda
    @Basic(optional = false)
    private Integer bonusActionsUsed;

    // una reaccion igual por ronda
    @Basic(optional = false)
    private Integer reactionsUsed;

    // cantidad limitada de movimiento dependiendo del personaje
    @Basic(optional = false)
    private Integer movementUsed;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    /**
     * Verifica si el personaje puede realizar una acción.
     * @return true si el personaje no ha actuado todavía
     */
    public boolean canTakeAction() {
        return !hasActed;
    }

    /**
     * Verifica si el personaje puede realizar una acción adicional.
     * @return true si el personaje no ha utilizado todas sus acciones adicionales
     */
    public boolean canTakeBonusAction() {
        return bonusActionsUsed < 1;
    }

    /**
     * Verifica si el personaje puede realizar una reacción.
     * @return true si el personaje no ha utilizado todas sus reacciones
     */
    public boolean canTakeReaction() {
        return reactionsUsed < 1;
    }

    /**
     * Marca que el personaje ha utilizado su acción.
     */
    public void useAction() {
        this.hasActed = true;
    }

    /**
     * Marca que el personaje ha utilizado una acción adicional.
     */
    public void useBonusAction() {
        this.bonusActionsUsed++;
    }

    /**
     * Marca que el personaje ha utilizado una reacción.
     */
    public void useReaction() {
        this.reactionsUsed++;
    }

    /**
     * Registra el movimiento utilizado por el personaje.
     * @param distance la distancia recorrida
     */
    public void useMovement(int distance) {
        this.movementUsed += distance;
    }
}