package kal.com.rolegames.dto.combat;

import kal.com.rolegames.dto.effects.EffectDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
public class CombatStateDTO {
    private Long combatStateId;
    private Long encounterId;
    private String encounterName;
    private Integer currentRound;
    private List<InitiativeDTO> initiativeOrder = new ArrayList<>();
    private Set<EffectDTO> activeEffects = new HashSet<>();
    private Boolean isActive;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}