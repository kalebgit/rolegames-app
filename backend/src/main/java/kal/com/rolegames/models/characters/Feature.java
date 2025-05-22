package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import kal.com.rolegames.models.util.FeatureType;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "features")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Feature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feature_id")
    @EqualsAndHashCode.Include
    private Long featureId;

    @Basic(optional = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private FeatureType featureType;

    @Lob
    private String description;

    @Basic(optional = false)
    private Integer levelRequired;

    private Integer usesPerDay;

    private Integer currentUses;

    @ManyToMany(mappedBy = "features")
    private Set<PlayerCharacter> characters = new HashSet<>();

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public boolean isAvailable() {
        return usesPerDay == null || currentUses < usesPerDay; // Default return for compilation
    }

    public void useFeature() {
        if(usesPerDay != null && currentUses < usesPerDay){
            currentUses++;
        }
    }

    public void resetUses() {
        currentUses = 0;
    }

    public String getFullDescription() {
        StringBuilder sb = new StringBuilder();
        sb.append(name).append(" (").append(featureType).append(")");
        sb.append("\nLevel Required: ").append(levelRequired);

        if (usesPerDay != null) {
            sb.append("\nUses Per Day: ").append(usesPerDay);
        }

        sb.append("\n\n").append(description);

        return sb.toString();    }
}