package kal.com.rolegames.dto.items;

import kal.com.rolegames.dto.items.ItemDTO;
import kal.com.rolegames.models.util.ArmorType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ArmorDTO extends ItemDTO {
    private ArmorType armorType;
    private Integer baseArmorClass;
    private Integer strengthRequirement;
    private Boolean stealthDisadvantage;
    private Integer magicalBonus;
}