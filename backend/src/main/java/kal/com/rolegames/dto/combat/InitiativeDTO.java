package kal.com.rolegames.dto.combat;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class InitiativeDTO {
    private Long initiativeId;
    private Long characterId;
    private String characterName;
    private Integer initiativeRoll;
    private Boolean currentTurn;
    private Boolean hasActed;
    private Integer bonusActionsUsed;
    private Integer reactionsUsed;
    private Integer movementUsed;
    private Integer maxMovement;
    private Integer hitPoints;
    private Integer maxHitPoints;
    private Integer armorClass;
}