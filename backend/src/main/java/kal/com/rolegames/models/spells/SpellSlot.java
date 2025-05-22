package kal.com.rolegames.models.spells;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import lombok.*;

@Entity
@Table(name = "spell_slots")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SpellSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "spell_slot_id")
    @EqualsAndHashCode.Include
    private Long spellSlotId;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Basic(optional = false)
    private Integer level;

    @Basic(optional = false)
    private Integer totalSlots;

    @Basic(optional = false)
    private Integer usedSlots;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public int getAvailableSlots() {
        return totalSlots - usedSlots;
    }

    public boolean hasAvailableSlot() {
        return getAvailableSlots() > 0;
    }

    public void useSlot() {
        if (hasAvailableSlot()) {
            usedSlots++;
        }
    }

    public void restoreSlot() {
        if (usedSlots > 0) {
            usedSlots--;
        }
    }

    public void restoreAllSlots() {
        usedSlots = 0;
    }
}