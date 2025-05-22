package kal.com.rolegames.mappers.items;

import kal.com.rolegames.dto.items.ItemDTO;
import kal.com.rolegames.mappers.effects.ItemEffectMapper;
import kal.com.rolegames.models.items.Item;
import org.mapstruct.*;

import java.util.List;

/// relaciones con otras entidades porque
///     private Long ownerId;
///     private String ownerName;
///     private Long creatorId;
///     private String creatorName;
///     private Set<ItemEffectDTO> effects = new HashSet<>();
/// son atirbutos de Item
///
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
uses = {ItemEffectMapper.class})
public interface ItemMapper {


    @Mapping(target="ownerId", source ="owner.characterId")
    @Mapping(target="ownerName", source ="owner.name")
    //user
    @Mapping(target="creatorId", source ="creator.userId")
    @Mapping(target="creatorName", source ="creator.username")
    //tipo de arma
//    @Mapping(target = "itemType", expression = "java(item instanceof Weapon ? \"Weapon\" : (item instanceof Armor ? \"Armor\" : \"General\"))")
    ItemDTO toDTO(Item spell);

    List<ItemDTO> toItemListDto(List<Item> initiatives);

    void updateItemFromDto(ItemDTO source, @MappingTarget Item target);

}
