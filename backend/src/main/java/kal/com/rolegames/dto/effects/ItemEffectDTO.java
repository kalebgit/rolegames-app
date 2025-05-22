package kal.com.rolegames.dto.effects;

import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.EffectType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ItemEffectDTO {
    private Long itemEffectId;
    private String name;
    private EffectType effectType;
    private String description;
    private AbilityType affectedAbility;
    private Integer bonusValue;
    private String damageDice;
    private Integer chargesPerDay;
    private Integer currentCharges;
}