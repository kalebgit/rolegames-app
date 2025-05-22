package kal.com.rolegames.mappers.items;

import kal.com.rolegames.dto.items.ItemDTO;
import kal.com.rolegames.dto.items.WeaponDTO;
import kal.com.rolegames.mappers.effects.ItemEffectMapper;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.items.Weapon;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
uses = {ItemMapper.class, ItemEffectMapper.class})
public interface WeaponMapper {

    @Mapping(target="ownerId", source ="owner.characterId")
    @Mapping(target="ownerName", source ="owner.name")
    //user
    @Mapping(target="creatorId", source ="creator.userId")
    @Mapping(target="creatorName", source ="creator.username")
    //tipo de arma
//    @Mapping(target = "itemType", defaultValue = "Weapon")
    //propio de weapon
    @Mapping(target = "normalRange", source = "range.normal")
    @Mapping(target = "maximumRange", source = "range.maximum")
    WeaponDTO toDTO(Weapon source);

    @Mapping(target = "itemId", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "creator", ignore = true)
//    @Mapping(target = "itemEffectId", ignore = true)
    void updateWeaponFromDto(WeaponDTO source, @MappingTarget Weapon target);

    Weapon toEntity(WeaponDTO dto);

    List<WeaponDTO> toItemListDto(List<Weapon> initiatives);

}
