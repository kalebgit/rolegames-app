package kal.com.rolegames.dto.items;

import kal.com.rolegames.models.util.RewardType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RewardDTO {
    private Long rewardId;
    private String name;
    private RewardType rewardType;
    private Integer experienceAmount;
    private Integer goldAmount;
    private Long itemId;
    private String itemName;
    private Boolean claimed;
}