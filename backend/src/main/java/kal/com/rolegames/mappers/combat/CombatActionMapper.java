package kal.com.rolegames.mappers.combat;

import kal.com.rolegames.dto.combat.CombatActionDTO;
import kal.com.rolegames.models.combat.CombatAction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {ActionResultMapper.class})
public interface CombatActionMapper {

    @Mapping(target = "combatStateId", source = "combat.combatStateId")
    @Mapping(target = "characterId", source = "character.characterId")
    @Mapping(target = "characterName", source = "character.name")
    @Mapping(target = "targetId", source = "target.characterId")
    @Mapping(target = "targetName", source = "target.name")
    @Mapping(target = "itemId", source = "item.itemId")
    @Mapping(target = "itemName", source = "item.name")
    @Mapping(target = "spellId", source = "spell.spellId")
    @Mapping(target = "spellName", source = "spell.name")
    CombatActionDTO toDTO(CombatAction combatAction);

    @Mapping(target = "combat", ignore = true)
    @Mapping(target = "character", ignore = true)
    @Mapping(target = "target", ignore = true)
    @Mapping(target = "item", ignore = true)
    @Mapping(target = "spell", ignore = true)
    @Mapping(target = "timestamp", ignore = true)
    CombatAction toEntity(CombatActionDTO dto);

    List<CombatActionDTO> toCombatActionListDto(List<CombatAction> actions);
}