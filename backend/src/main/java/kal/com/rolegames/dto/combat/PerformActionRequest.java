package kal.com.rolegames.dto.combat;

import kal.com.rolegames.models.util.ActionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerformActionRequest {
    private Long characterId;
    private ActionType actionType;
    private Long targetId;
    private Long itemId;
    private Long spellId;
    private Boolean diceResult; // true si el tiro fue exitoso
}
