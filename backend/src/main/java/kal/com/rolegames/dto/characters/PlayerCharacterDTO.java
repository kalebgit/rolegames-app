package kal.com.rolegames.dto.characters;

import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.AlignmentType;
import kal.com.rolegames.models.util.CharacterClassType;
import kal.com.rolegames.models.util.RaceType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
public class PlayerCharacterDTO {
    private Long characterId;
    private String name;
    private RaceType race;
    private Integer level;
    private CharacterClassType characterClass;
    private String subclass;
    private Integer experiencePoints;
    private Integer hitPoints;
    private Integer maxHitPoints;
    private Integer armorClass;
    private Integer proficiencyBonus;
    private Integer speed;
    private AlignmentType alignment;
    private String background;
    private String backstory;
    private Map<AbilityType, Integer> abilities = new HashMap<>();
    private Long playerId;
    private String playerName;
    private Long campaignId;
    private String campaignName;
}