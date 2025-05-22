package kal.com.rolegames.dto.items;

import kal.com.rolegames.dto.effects.ItemEffectDTO;
import kal.com.rolegames.models.util.ItemRarity;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class ItemDTO {
    private Long itemId;
    private String name;
    private String description;
    private Float weight;
    private Integer value;
    private ItemRarity rarity;
    private Boolean requiresAttunement;
    private Boolean isAttuned;
    private Long ownerId;
    private String ownerName;
    private Long creatorId;
    private String creatorName;
    private Set<ItemEffectDTO> effects = new HashSet<>();
    private Set<String> tags = new HashSet<>();
    private String itemType;
}