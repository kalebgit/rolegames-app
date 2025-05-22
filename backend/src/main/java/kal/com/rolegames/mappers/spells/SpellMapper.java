package kal.com.rolegames.mappers.spells;

import kal.com.rolegames.dto.spells.SpellDTO;
import kal.com.rolegames.models.spells.Spell;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface SpellMapper {

    SpellDTO toDTO(Spell spell);

    Spell toEntity(SpellDTO dto);

    List<SpellDTO> toSpellListDto(List<Spell> spells);

    void updateSpellFromDto(SpellDTO source, @MappingTarget Spell target);
}