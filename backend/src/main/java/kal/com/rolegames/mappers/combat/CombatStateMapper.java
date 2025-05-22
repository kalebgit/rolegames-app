package kal.com.rolegames.mappers.combat;

import kal.com.rolegames.dto.combat.CombatStateDTO;
import kal.com.rolegames.mappers.effects.EffectMapper;
import kal.com.rolegames.models.combat.CombatState;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {EffectMapper.class, InitiativeMapper.class})
public interface CombatStateMapper {

    @Mapping(target = "encounterId", source = "encounter.encounterId")
    @Mapping(target = "encounterName", source = "encounter.name")
        // No ignoramos las colecciones, MapStruct usará los mappers especificados en 'uses'
    CombatStateDTO toDTO(CombatState combatState);

    @Mapping(target = "encounter", ignore = true)
    CombatState toEntity(CombatStateDTO dto);

    @Mapping(target = "combatStateId", ignore = true)
    @Mapping(target = "encounter", ignore = true)
    void updateFromDto(CombatStateDTO source, @MappingTarget CombatState target);

    @AfterMapping
    default void additionalProcessing(CombatState source, @MappingTarget CombatStateDTO target) {
        //ordenamos la lista
        if (target.getInitiativeOrder() != null) {
            target.getInitiativeOrder().sort((a, b) -> b.getInitiativeRoll().compareTo(a.getInitiativeRoll()));
        }
    }

}
