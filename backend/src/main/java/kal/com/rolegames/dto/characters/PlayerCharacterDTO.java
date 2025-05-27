package kal.com.rolegames.dto.characters;

import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.AlignmentType;
import kal.com.rolegames.models.util.CharacterClassType;
import kal.com.rolegames.models.util.RaceType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class PlayerCharacterDTO extends GameCharacterDTO {
    private CharacterClassType characterClass;
    private String subclass;
    private String backstory;
    private Long playerId;
    private String playerName;
    private Long campaignId;
    private String campaignName;
}