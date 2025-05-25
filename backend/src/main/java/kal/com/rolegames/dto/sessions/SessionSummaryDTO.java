package kal.com.rolegames.dto.sessions;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SessionSummaryDTO {
    private Long sessionId;
    private String campaignName;
    private Integer sessionNumber;
    private LocalDateTime date;
    private Integer duration;
    private Integer playerCount;
    private Integer characterCount;
    private Integer encounterCount;
    private Boolean hasEncounters;
    private String status; // "COMPLETED", "IN_PROGRESS", "PLANNED"
}
