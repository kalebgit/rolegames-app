package kal.com.rolegames.dto.items;

import kal.com.rolegames.models.util.DamageType;
import kal.com.rolegames.models.util.WeaponProperty;
import kal.com.rolegames.models.util.WeaponType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
public class WeaponDTO extends ItemDTO {
    private WeaponType weaponType;
    private DamageType damageType;
    private String damageDice;
    private Integer damageBonus;
    private Set<WeaponProperty> properties = new HashSet<>();
    private Integer normalRange;
    private Integer maximumRange;
    private Boolean isMagical;
    private Integer attackBonus;
}