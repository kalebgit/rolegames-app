package kal.com.rolegames.models.items;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode
public class Range {

    private Integer normal;

    private Integer maximum;

    public String getDisplayRange() {
        if (normal != null && maximum != null) {
            return normal + "/" + maximum + " ft.";
        } else if (normal != null) {
            return normal + " ft.";
        } else {
            return "Melee";
        }
    }

    public boolean isRanged() {
        return normal != null && normal > 5;
    }

    public boolean isMelee() {
        return normal == null || normal <= 5;
    }
}