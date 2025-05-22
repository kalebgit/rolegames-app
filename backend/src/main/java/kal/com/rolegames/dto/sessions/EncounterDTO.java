package kal.com.rolegames.dto.sessions;

import kal.com.rolegames.dto.items.RewardDTO;
import kal.com.rolegames.models.util.DifficultyLevel;
import kal.com.rolegames.models.util.EncounterType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class EncounterDTO {
    private Long encounterId;
    private Long sessionId;
    private String name;
    private String description;
    private EncounterType encounterType;
    private DifficultyLevel difficulty;
    private Set<Long> participantIds = new HashSet<>();
    private Set<RewardDTO> rewards = new HashSet<>();
    private Boolean isCompleted;
    private String notes;
    private Boolean hasCombatState;
}