package kal.com.rolegames.dto.users;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class DungeonMasterDTO {
    private Long dungeonMasterId;
    private Long userId;
    private String username;
    private String email;
    private String dmStyle;
    private Float rating;
    private Integer campaignCount;
    private Integer activeCampaignCount;
    private Integer npcCount;
    private Integer itemCount;
    private Set<Long> campaignIds = new HashSet<>();
    private Set<Long> npcIds = new HashSet<>();
    private Set<Long> itemIds = new HashSet<>();
    private LocalDateTime createdAt;
}