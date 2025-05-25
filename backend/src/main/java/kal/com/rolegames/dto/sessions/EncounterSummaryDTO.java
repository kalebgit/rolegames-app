package kal.com.rolegames.dto.sessions;

import kal.com.rolegames.models.util.DifficultyLevel;
import kal.com.rolegames.models.util.EncounterType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EncounterSummaryDTO {
    private Long encounterId;
    private String name;
    private EncounterType encounterType;
    private DifficultyLevel difficulty;
    private Boolean isCompleted;
    private Boolean hasCombatState;
    private Boolean isCombatActive;
    private Integer participantCount;
    private Integer rewardCount;
    private Integer totalExperienceReward;
    private Integer totalGoldReward;
    private String sessionName;
    private Integer sessionNumber;
}