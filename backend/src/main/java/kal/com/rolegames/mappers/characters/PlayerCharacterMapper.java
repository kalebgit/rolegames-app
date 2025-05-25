package kal.com.rolegames.mappers.characters;

import kal.com.rolegames.dto.characters.NonPlayerCharacterDTO;
import kal.com.rolegames.dto.characters.PlayerCharacterDTO;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.characters.PlayerCharacter;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PlayerCharacterMapper {

    @Mapping(target = "abilities", ignore = true)
    @Mapping(target = "currentState", ignore = true)
    @Mapping(target = "traits", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "savingThrows", ignore = true)
    @Mapping(target = "encounters", ignore = true)
    @Mapping(target = "inventory", ignore = true)
    @Mapping(target = "equippedItems", ignore = true)
    @Mapping(target = "spells", ignore = true)
    @Mapping(target = "features", ignore = true)
    @Mapping(target = "deathSaves", ignore = true)
    @Mapping(target = "sessions", ignore = true)
    @Mapping(target = "spellSlots", ignore = true)
    PlayerCharacter toEntity(PlayerCharacterDTO dto);

    @Mapping(target = "abilities", ignore = true)
    @Mapping(target = "currentState", source = "currentState.stateId")
    @Mapping(target = "playerId", source = "player.playerId")
    @Mapping(target = "playerName", source = "player.user.username")
    @Mapping(target = "campaignId", source = "currentCampaign.campaignId")
    @Mapping(target = "campaignName", source = "currentCampaign.name")
    PlayerCharacterDTO toDto(PlayerCharacter source);

    List<PlayerCharacterDTO> toPlayerCharacterDtoList(List<PlayerCharacter> characters);

    @Mapping(target = "abilities", ignore = true)
    @Mapping(target = "currentState", ignore = true)
    @Mapping(target = "traits", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "savingThrows", ignore = true)
    @Mapping(target = "encounters", ignore = true)
    @Mapping(target = "player", ignore = true)
    @Mapping(target = "inventory", ignore = true)
    @Mapping(target = "equippedItems", ignore = true)
    @Mapping(target = "spells", ignore = true)
    @Mapping(target = "features", ignore = true)
    @Mapping(target = "currentCampaign", ignore = true)
    @Mapping(target = "deathSaves", ignore = true)
    @Mapping(target = "sessions", ignore = true)
    @Mapping(target = "spellSlots", ignore = true)
    void updatePlayerCharacterFromDto(PlayerCharacterDTO dto, @MappingTarget PlayerCharacter character);


    @AfterMapping
    default void mapAbilities(PlayerCharacter source, @MappingTarget PlayerCharacterDTO target) {
        if (source.getAbilities() != null) {
            target.setAbilities(source.getAbilities());
        }
    }

    @AfterMapping
    default void mapAbilities(PlayerCharacterDTO source, @MappingTarget PlayerCharacter target) {
        if (source.getAbilities() != null) {
            target.setAbilities(source.getAbilities());
        }
    }


    @AfterMapping
    default void updateAbilities(PlayerCharacterDTO source, @MappingTarget PlayerCharacter target) {
        if (source.getAbilities() != null) {
            target.getAbilities().clear();
            target.getAbilities().putAll(source.getAbilities());
        }
    }



}
