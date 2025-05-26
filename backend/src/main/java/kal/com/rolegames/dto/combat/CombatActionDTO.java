package kal.com.rolegames.dto.combat;

import kal.com.rolegames.models.util.ActionType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CombatActionDTO {
    private Long actionId;
    private Long combatStateId;
    private Long characterId;
    private String characterName;
    private ActionType actionType;
    private Long targetId;
    private String targetName;
    private Long itemId;
    private String itemName;
    private Long spellId;
    private String spellName;
    private ActionResultDTO result;
    private LocalDateTime timestamp;
}