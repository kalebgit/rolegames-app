package kal.com.rolegames.dto.characters;

import kal.com.rolegames.models.util.AbilityType;
import kal.com.rolegames.models.util.AlignmentType;
import kal.com.rolegames.models.util.RaceType;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
public class GameCharacterDTO {

    /**
     * colecciones faltantes
     * - abilities
     * - traits
     * - skills
     * - savingThrows
     * - encounters
     */

    @EqualsAndHashCode.Include
    private Long characterId;
    private String name;
    private RaceType race;
    private int level;
    private int experiencePoints;
    private int hitPoints;
    private int maxHitPoints;
    private int armorClass;
    private int proficiencyBonus;
    private int speed;
    private AlignmentType alignment;
    private String background;
    private Long currentState;
    private Long version;
    //colecciones
    private Map<AbilityType, Integer> abilities = new HashMap<>();
}
