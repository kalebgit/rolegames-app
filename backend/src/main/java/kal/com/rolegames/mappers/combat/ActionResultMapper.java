package kal.com.rolegames.mappers.combat;

import kal.com.rolegames.dto.combat.ActionResultDTO;
import kal.com.rolegames.models.combat.ActionResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ActionResultMapper {

    ActionResultDTO toDTO(ActionResult actionResult);

    @Mapping(target = "action", ignore = true)
    @Mapping(target = "version", ignore = true)
    ActionResult toEntity(ActionResultDTO dto);

    List<ActionResultDTO> toActionResultListDto(List<ActionResult> results);

    @Mapping(target = "resultId", ignore = true)
    @Mapping(target = "action", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateActionResultFromDto(ActionResultDTO source, @MappingTarget ActionResult target);
}