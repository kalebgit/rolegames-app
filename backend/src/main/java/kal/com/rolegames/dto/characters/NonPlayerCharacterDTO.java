package kal.com.rolegames.dto.characters;

import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.AlignmentType;
import kal.com.rolegames.models.util.NPCType;
import kal.com.rolegames.models.util.RaceType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
public class NonPlayerCharacterDTO {
    private Long characterId;
    private String name;
    private RaceType race;
    private Integer level;
    private NPCType npcType;
    private Float challengeRating;
    private Integer hitPoints;
    private Integer maxHitPoints;
    private Integer armorClass;
    private Integer speed;
    private AlignmentType alignment;
    private String motivation;
    private Boolean isHostile;
    private Map<AbilityType, Integer> abilities = new HashMap<>();
    private Long creatorId;
    private String creatorName;
}