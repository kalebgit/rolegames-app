package kal.com.rolegames.mappers.sessions;

import kal.com.rolegames.dto.sessions.SessionDTO;
import kal.com.rolegames.models.sessions.Session;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SessionMapper {

    @Mapping(target = "campaignId", source = "campaign.campaignId")
    @Mapping(target = "campaignName", source = "campaign.name")
    @Mapping(target = "attendingPlayerIds", ignore = true)
    @Mapping(target = "attendingPlayerNames", ignore = true)
    @Mapping(target = "attendingCharacterIds", ignore = true)
    @Mapping(target = "attendingCharacterNames", ignore = true)
    @Mapping(target = "encounterIds", ignore = true)
    SessionDTO toDTO(Session session);

    @Mapping(target = "campaign", ignore = true)
    @Mapping(target = "attendingPlayers", ignore = true)
    @Mapping(target = "attendingCharacters", ignore = true)
    @Mapping(target = "encountersCompleted", ignore = true)
    @Mapping(target = "version", ignore = true)
    Session toEntity(SessionDTO dto);

    List<SessionDTO> toSessionListDto(List<Session> sessions);

    @Mapping(target = "campaign", ignore = true)
    @Mapping(target = "attendingPlayers", ignore = true)
    @Mapping(target = "attendingCharacters", ignore = true)
    @Mapping(target = "encountersCompleted", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateSessionFromDto(SessionDTO source, @MappingTarget Session target);

    @AfterMapping
    default void mapCollections(Session source, @MappingTarget SessionDTO target) {
        if (source.getAttendingPlayers() != null) {
            source.getAttendingPlayers().forEach(player -> {
                target.getAttendingPlayerIds().add(player.getPlayerId());
                target.getAttendingPlayerNames().add(player.getUsername());
            });
        }

        if (source.getAttendingCharacters() != null) {
            source.getAttendingCharacters().forEach(character -> {
                target.getAttendingCharacterIds().add(character.getCharacterId());
                target.getAttendingCharacterNames().add(character.getName());
            });
        }

        if (source.getEncountersCompleted() != null) {
            source.getEncountersCompleted().forEach(encounter ->
                    target.getEncounterIds().add(encounter.getEncounterId())
            );
        }
    }
}