package kal.com.rolegames.mappers.sessions;

import kal.com.rolegames.dto.sessions.EncounterDTO;
import kal.com.rolegames.mappers.items.RewardMapper;
import kal.com.rolegames.models.sessions.Encounter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
uses = {RewardMapper.class})
public interface EncounterMapper {

    @Mapping(target = "participantIds", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    @Mapping(target = "hasCombatState", expression = "java(encounter.getCombatState() != null)")
    EncounterDTO toDTO(Encounter encounter);

    @Mapping(target = "session", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    @Mapping(target = "combatState", ignore = true)
    Encounter toEntity(EncounterDTO dto);

    List<EncounterDTO> toEncounterListDto(List<Encounter> encounters);

    @Mapping(target = "session", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "rewards", ignore = true)
    @Mapping(target = "combatState", ignore = true)
    void updateEncounterFromDto(EncounterDTO source, @MappingTarget Encounter target);
}