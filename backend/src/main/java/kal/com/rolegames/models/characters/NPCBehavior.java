package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import kal.com.rolegames.models.util.BehaviorTrait;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "npc_behaviors")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class NPCBehavior {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "behavior_id")
    @EqualsAndHashCode.Include
    private Long behaviorId;

    @Lob
    private String personalityDescription;

    @ElementCollection
    @CollectionTable(name = "npc_behavior_traits",
            joinColumns = @JoinColumn(name = "behavior_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "trait")
    private Set<BehaviorTrait> traits = new HashSet<>();

    private Integer aggressiveness; // 0-10 scale

    private Integer friendliness; // 0-10 scale

    private Integer honesty; // 0-10 scale

    @OneToOne(mappedBy = "behavior")
    private NonPlayerCharacter npc;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public void addTrait(BehaviorTrait trait) {
        traits.add(trait);
    }

    public void removeTrait(BehaviorTrait trait) {
        traits.remove(trait);
    }

    public boolean hasTrait(BehaviorTrait trait) {
        return traits.contains(trait);
    }

    public boolean isLikelyToAttack() {
        return aggressiveness != null && aggressiveness > 7;
    }

    public boolean isLikelyToHelp() {
        return friendliness != null && friendliness > 7;
    }

    public boolean isLikelyToLie() {
        return honesty != null && honesty < 3;
    }
}