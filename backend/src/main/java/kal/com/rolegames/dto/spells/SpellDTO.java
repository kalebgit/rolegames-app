package kal.com.rolegames.dto.spells;

import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.SpellComponent;
import kal.com.rolegames.models.util.SpellSchool;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class SpellDTO {
    private Long spellId;
    private String name;
    private Integer level;
    private SpellSchool school;
    private String castingTime;
    private String range;
    private Set<SpellComponent> components = new HashSet<>();
    private String duration;
    private String description;
    private String higherLevelEffects;
    private String damageType;
    private String damageDice;
    private AbilityType savingThrow;
    private Boolean ritual;
    private Boolean concentration;
    private String materialComponents;
}