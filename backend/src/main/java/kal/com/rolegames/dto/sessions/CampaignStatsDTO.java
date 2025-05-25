package kal.com.rolegames.dto.sessions;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class CampaignStatsDTO {
    private Long campaignId;
    private String campaignName;
    private String dungeonMasterName;
    private LocalDate startDate;
    private Boolean isActive;
    private Integer totalSessions;
    private Integer totalEncounters;
    private Integer completedEncounters;
    private Integer pendingEncounters;
    private Integer totalPlayersParticipated;
    private Integer activePlayerCount;
    private Integer totalExperienceAwarded;
    private Integer totalGoldAwarded;
    private Double averageSessionDuration;
    private Integer totalCombatEncounters;
    private Integer totalSocialEncounters;
    private Integer totalPuzzleEncounters;
}