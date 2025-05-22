package kal.com.rolegames.mappers.characters;

import kal.com.rolegames.dto.characters.PlayerCharacterDTO;
import kal.com.rolegames.models.characters.PlayerCharacter;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PlayerCharacterMapper {

    PlayerCharacter toEntity(PlayerCharacterDTO dto);

    PlayerCharacterDTO toDto(PlayerCharacter source);

    List<PlayerCharacterDTO> toPlayerCharacterDtoList(List<PlayerCharacter> characters);

    void updatePlayerCharacterFromDto(PlayerCharacterDTO source, @MappingTarget PlayerCharacter target);


}
