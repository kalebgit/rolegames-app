package kal.com.rolegames.mappers.users;

import kal.com.rolegames.dto.users.PlayerDTO;
import kal.com.rolegames.models.users.Player;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PlayerMapper {

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "createdAt", source = "user.createdAt")
    @Mapping(target = "level", expression = "java(player.getLevel())")
    @Mapping(target = "characterCount", expression = "java(player.getCharacters().size())")
    @Mapping(target = "characterIds", ignore = true)
    PlayerDTO toDto(Player player);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "characters", ignore = true)
    Player toEntity(PlayerDTO dto);

    List<PlayerDTO> toPlayerDtoList(List<Player> players);

    @Mapping(target = "playerId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "characters", ignore = true)
    void updatePlayerFromDto(PlayerDTO source, @MappingTarget Player target);

    @AfterMapping
    default void mapCharacterIds(Player source, @MappingTarget PlayerDTO target) {
        if (source.getCharacters() != null) {
            target.setCharacterIds(source.getCharacters().stream()
                    .map(character -> character.getCharacterId())
                    .collect(Collectors.toSet()));
        }
    }
}