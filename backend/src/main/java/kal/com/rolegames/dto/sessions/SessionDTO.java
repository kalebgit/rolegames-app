package kal.com.rolegames.dto.sessions;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class SessionDTO {
    private Long sessionId;
    private Long campaignId;
    private String campaignName;
    private Integer sessionNumber;
    private LocalDateTime date;
    private Integer duration; // in minutes
    private Set<Long> attendingPlayerIds = new HashSet<>();
    private Set<String> attendingPlayerNames = new HashSet<>();
    private Set<Long> attendingCharacterIds = new HashSet<>();
    private Set<String> attendingCharacterNames = new HashSet<>();
    private String summary;
    private String dmNotes;
    private Set<Long> encounterIds = new HashSet<>();
    private String nextSessionObjectives;
}