package kal.com.rolegames.dto.sessions;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class CampaignDTO {
    private Long campaignId;
    private String name;
    private String description;
    private Long dungeonMasterId;
    private String dungeonMasterName;
    private Set<Long> playerIds = new HashSet<>();
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private String globalNotes;
    private Set<Long> importantNPCIds = new HashSet<>();
    private Integer sessionCount;
}