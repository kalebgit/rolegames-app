package kal.com.rolegames.mappers.effects;
import kal.com.rolegames.dto.effects.EffectDTO;
import kal.com.rolegames.models.effects.Effect;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EffectMapper {


    @Mapping(target="sourceId", source = "source.characterId")
    @Mapping(target="sourceName", source = "source.name")
    @Mapping(target="targetId", source = "target.characterId")
    @Mapping(target="targetName", source = "target.name")
    @Mapping(target="spellId", source = "spell.spellId")
    @Mapping(target="spellName", source = "spell.name")
    EffectDTO toDTO(Effect spell);

    Effect toEntity(EffectDTO dto);

    Set<EffectDTO> toSetDtoList(List<Effect> effects);

    @Mapping(target = "effectId", ignore = true)
    void updateEffectFromDto(EffectDTO source, @MappingTarget Effect target);

}
