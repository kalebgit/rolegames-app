package kal.com.rolegames.models.combat;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.spells.Spell;
import kal.com.rolegames.models.util.ActionType;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "combat_actions")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CombatAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "action_id")
    @EqualsAndHashCode.Include
    private Long actionId;

    @ManyToOne
    @JoinColumn(name = "combat_state_id")
    private CombatState combat;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private ActionType actionType;

    @ManyToOne
    @JoinColumn(name = "target_id")
    private GameCharacter target;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JoinColumn(name = "spell_id")
    private Spell spell;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "result_id")
    private ActionResult result;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime timestamp;

    @PrePersist
    protected void prePersist() {
        this.timestamp = LocalDateTime.now();
    }

    public void setResult(boolean success, int damageDealt, String description) {
        result = ActionResult.builder().success(success).damageDealt(damageDealt).description(description).build();
    }

    public String getActionDescription() {
        StringBuilder sb = new StringBuilder();
        sb.append(character.getName()).append(" uses ").append(actionType.toString().toLowerCase());

        if (target != null) {
            sb.append(" targeting ").append(target.getName());
        }

        if (item != null) {
            sb.append(" with ").append(item.getName());
        }

        if (spell != null) {
            sb.append(" casting ").append(spell.getName());
        }

        if (result != null) {
            sb.append(": ").append(result.getDescription());
        }

        return sb.toString();
    }
}