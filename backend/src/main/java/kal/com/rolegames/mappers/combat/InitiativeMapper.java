package kal.com.rolegames.mappers.combat;

import kal.com.rolegames.dto.combat.InitiativeDTO;
import kal.com.rolegames.dto.spells.SpellDTO;
import kal.com.rolegames.models.combat.Initiative;
import kal.com.rolegames.models.spells.Spell;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InitiativeMapper {

    InitiativeDTO toDTO(Initiative spell);

    Initiative toEntity(InitiativeDTO dto);

    List<InitiativeDTO> toInitiativeListDto(List<Initiative> initiatives);

    void updateInitiativeFromDto(InitiativeDTO source, @MappingTarget Initiative target);
}
