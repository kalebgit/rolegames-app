package kal.com.rolegames.mappers.items;

import kal.com.rolegames.dto.items.ItemDTO;
import kal.com.rolegames.dto.items.ArmorDTO;
import kal.com.rolegames.mappers.effects.ItemEffectMapper;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.items.Armor;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {ItemMapper.class, ItemEffectMapper.class})
public interface ArmorMapper {

    @Mapping(target="ownerId", source ="owner.characterId")
    @Mapping(target="ownerName", source ="owner.name")
    //user
    @Mapping(target="creatorId", source ="creator.userId")
    @Mapping(target="creatorName", source ="creator.username")
    //tipo de arma
//    @Mapping(target = "itemType", defaultValue = "Armor")
    //propio de weapon
    ArmorDTO toDTO(Armor source);

    @Mapping(target = "itemId", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "creator", ignore = true)
//    @Mapping(target = "itemEffectId", ignore = true)
    void updateArmorFromDto(ArmorDTO source, @MappingTarget Armor target);

    Armor toEntity(ArmorDTO dto);

    List<ArmorDTO> toArmorListDto(List<Armor> initiatives);

}
