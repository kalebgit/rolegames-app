package kal.com.rolegames.dto.characters;

import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.AlignmentType;
import kal.com.rolegames.models.util.NPCType;
import kal.com.rolegames.models.util.RaceType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class NonPlayerCharacterDTO extends GameCharacterDTO{
    private NPCType npcType;
    private Float challengeRating;
    private String motivation;
    private Boolean isHostile;
    private Long creatorId;
    private String creatorName;
}