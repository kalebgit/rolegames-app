package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.PlayerCharacter;
import lombok.*;

@Entity
@Table(name = "death_save_trackers")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class DeathSaveTracker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "death_save_id")
    @EqualsAndHashCode.Include
    private Long deathSaveId;

    @OneToOne(mappedBy = "deathSaves")
    private PlayerCharacter character;

    @Basic(optional = false)
    private Integer successes;

    @Basic(optional = false)
    private Integer failures;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    // Initialize with zero successes and failures
    @PrePersist
    protected void prePersist() {
        if (successes == null) {
            successes = 0;
        }
        if (failures == null) {
            failures = 0;
        }
    }


    public void reset() {
        successes = 0;
        failures = 0;
    }

    public boolean isStable() {
        return successes >= 3;
    }

    public boolean isDead() {
        return failures >=3;
    }

    // Method to check if the character is still in the process of making death saves
    // Should return true if the character is neither stable nor dead
    public boolean isUnstable() {
        return !isDead() && !isStable();
    }
}