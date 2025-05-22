package kal.com.rolegames.models.effects;

import jakarta.persistence.*;
import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.EffectType;
import lombok.*;

@Entity
@Table(name = "item_effects")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ItemEffect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_effect_id")
    @EqualsAndHashCode.Include
    private Long itemEffectId;

    @Basic(optional = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private EffectType effectType;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    private AbilityType affectedAbility;

    private Integer bonusValue;

    private String damageDice;

    private Integer chargesPerDay;

    private Integer currentCharges;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public boolean isActive() {
        return chargesPerDay == null || currentCharges < chargesPerDay;
    }

    public void useCharge() {
        if (chargesPerDay != null && currentCharges < chargesPerDay) {
            currentCharges++;
        }
    }

    public void resetCharges() {
        currentCharges = 0;
    }

    public String getEffectDescription() {
        StringBuilder sb = new StringBuilder();

        sb.append(name);

        if (bonusValue != null) {
            sb.append(": ");
            if (affectedAbility != null) {
                sb.append(affectedAbility.toString()).append(" ");
            }

            if (bonusValue > 0) {
                sb.append("+");
            }
            sb.append(bonusValue);
        }

        if (damageDice != null) {
            sb.append(": Additional ").append(damageDice).append(" damage");
        }

        if (chargesPerDay != null) {
            sb.append(" (").append(chargesPerDay - (currentCharges != null ? currentCharges : 0));
            sb.append("/").append(chargesPerDay).append(" charges remaining)");
        }

        return sb.toString();
    }
}