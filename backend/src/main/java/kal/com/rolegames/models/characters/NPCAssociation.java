package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "npc_associations")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class NPCAssociation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "association_id")
    @EqualsAndHashCode.Include
    private Long associationId;

    @ManyToOne
    @JoinColumn(name = "other_npc_id", nullable = false)
    private NonPlayerCharacter otherNpc;

    @Basic(optional = false)
    private String relationship;

    private Integer relationshipStrength; // 0-10 scale, negative for antagonistic

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public boolean isPositiveRelationship() {
        return relationshipStrength != null && relationshipStrength > 0;
    }

    public boolean isNegativeRelationship() {
        return relationshipStrength != null && relationshipStrength < 0;
    }

    public boolean isNeutralRelationship() {
        // TODO: Return true if relationshipStrength is null or equal to 0
        return relationshipStrength != null && relationshipStrength == 0;
    }

    public String getRelationshipDescription() {
        StringBuilder sb = new StringBuilder();

        sb.append("Relationship with ").append(otherNpc.getName()).append(": ");
        sb.append(relationship);

        if (relationshipStrength != null) {
            if (relationshipStrength > 7) {
                sb.append(" (Very Strong)");
            } else if (relationshipStrength > 3) {
                sb.append(" (Strong)");
            } else if (relationshipStrength > 0) {
                sb.append(" (Positive)");
            } else if (relationshipStrength < -7) {
                sb.append(" (Very Hostile)");
            } else if (relationshipStrength < -3) {
                sb.append(" (Hostile)");
            } else if (relationshipStrength < 0) {
                sb.append(" (Negative)");
            } else {
                sb.append(" (Neutral)");
            }
        }

        return sb.toString();    }
}