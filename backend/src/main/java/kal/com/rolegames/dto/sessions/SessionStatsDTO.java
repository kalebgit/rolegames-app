package kal.com.rolegames.dto.sessions;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SessionStatsDTO {
    private Long sessionId;
    private Integer sessionNumber;
    private String campaignName;
    private LocalDateTime date;
    private Integer duration;
    private Integer attendingPlayerCount;
    private Integer attendingCharacterCount;
    private Integer totalEncounters;
    private Integer completedEncounters;
    private Integer combatEncounters;
    private Integer socialEncounters;
    private Integer puzzleEncounters;
    private Integer totalExperienceAwarded;
    private Integer totalGoldAwarded;
    private Integer totalItemsAwarded;
    private Double averageEncounterDifficulty;
}
