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

    @Mapping(target = "abilities", ignore = true) // Ignoramos el mapeo automático de abilities
    NonPlayerCharacterDTO toDTO(NonPlayerCharacter character);

    @Mapping(target = "abilities", ignore = true) // Ignoramos el mapeo automático de abilities
    NonPlayerCharacter toEntity(NonPlayerCharacterDTO dto);

    List<NonPlayerCharacterDTO> toNonPlayerCharacterListDto(List<NonPlayerCharacter> npcs);

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

    @Mapping(target = "abilities", ignore = true)
    void updateNonPlayerCharacterFromDto(NonPlayerCharacterDTO dto, @MappingTarget NonPlayerCharacter character);

    @AfterMapping
    default void updateAbilities(NonPlayerCharacterDTO source, @MappingTarget NonPlayerCharacter target) {
        if (source.getAbilities() != null) {
            target.getAbilities().clear();
            target.getAbilities().putAll(source.getAbilities());
        }
    }
}