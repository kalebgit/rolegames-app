package kal.com.rolegames.dto.sessions;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PlayerSessionStatsDTO {
    private Long playerId;
    private String playerName;
    private String characterName;
    private Long characterId;
    private Integer sessionsAttended;
    private Integer encountersParticipated;
    private Integer combatEncountersParticipated;
    private Integer experienceGained;
    private Integer goldGained;
    private Integer itemsReceived;
    private Double averageSessionDuration;
    private LocalDateTime lastSessionDate;
    private LocalDateTime firstSessionDate;
}