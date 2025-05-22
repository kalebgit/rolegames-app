package kal.com.rolegames.mappers.effects;

import kal.com.rolegames.dto.effects.ItemEffectDTO;
import kal.com.rolegames.models.effects.ItemEffect;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ItemEffectMapper {
    ItemEffectDTO toDTO(ItemEffect spell);

    ItemEffect toEntity(ItemEffectDTO dto);

    List<ItemEffectDTO> toItemEffectListDto(List<ItemEffect> initiatives);

    @Mapping(target = "itemEffectId", ignore = true)
    void updateItemEffectFromDto(ItemEffectDTO source, @MappingTarget ItemEffect target);

}
