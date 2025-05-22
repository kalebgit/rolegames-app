package kal.com.rolegames.dto.effects;

import kal.com.rolegames.models.util.EffectType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class EffectDTO {
    private Long effectId;
    private String name;
    private EffectType effectType;
    private String description;
    private Long sourceId;
    private String sourceName;
    private Long targetId;
    private String targetName;
    private Long spellId;
    private String spellName;
    private Integer duration;
    private Boolean isActive;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}