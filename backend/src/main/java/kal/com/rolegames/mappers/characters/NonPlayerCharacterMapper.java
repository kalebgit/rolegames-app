package kal.com.rolegames.mappers.characters;

import kal.com.rolegames.dto.characters.NonPlayerCharacterDTO;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.util.AbilityType;
import org.mapstruct.*;

import java.util.List;
import java.util.Map;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NonPlayerCharacterMapper {

    @Mapping(target = "abilities", ignore = true)
    @Mapping(target = "currentState", source = "currentState.stateId")
    @Mapping(target = "creatorId", source = "creator.dungeonMasterId")
    @Mapping(target = "creatorName", source = "creator.user.username")
    NonPlayerCharacterDTO toDTO(NonPlayerCharacter character);

    @Mapping(target = "abilities", ignore = true)
    @Mapping(target = "currentState", ignore = true)
    @Mapping(target = "traits", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "savingThrows", ignore = true)
    @Mapping(target = "encounters", ignore = true)
    @Mapping(target = "behavior", ignore = true)
    @Mapping(target = "associations", ignore = true)
    @Mapping(target = "inventory", ignore = true)
    @Mapping(target = "campaigns", ignore = true)
    NonPlayerCharacter toEntity(NonPlayerCharacterDTO dto);

    List<NonPlayerCharacterDTO> toNonPlayerCharacterListDto(List<NonPlayerCharacter> npcs);

    @Mapping(target = "abilities", ignore = true)
    @Mapping(target = "currentState", ignore = true)
    @Mapping(target = "traits", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "savingThrows", ignore = true)
    @Mapping(target = "encounters", ignore = true)
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "behavior", ignore = true)
    @Mapping(target = "associations", ignore = true)
    @Mapping(target = "inventory", ignore = true)
    @Mapping(target = "campaigns", ignore = true)    void updateNonPlayerCharacterFromDto(NonPlayerCharacterDTO dto, @MappingTarget NonPlayerCharacter character);


    @AfterMapping
    default void mapAbilities(NonPlayerCharacter source, @MappingTarget NonPlayerCharacterDTO target) {
        if (source.getAbilities() != null) {
            target.setAbilities(source.getAbilities());
        }
    }

    @AfterMapping
    default void mapAbilities(NonPlayerCharacterDTO source, @MappingTarget NonPlayerCharacter target) {
        if (source.getAbilities() != null) {
            target.setAbilities(source.getAbilities());
        }
    }


    @AfterMapping
    default void updateAbilities(NonPlayerCharacterDTO source, @MappingTarget NonPlayerCharacter target) {
        if (source.getAbilities() != null) {
            target.getAbilities().clear();
            target.getAbilities().putAll(source.getAbilities());
        }
    }
}