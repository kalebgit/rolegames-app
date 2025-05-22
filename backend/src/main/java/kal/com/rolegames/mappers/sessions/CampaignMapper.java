package kal.com.rolegames.mappers.sessions;

import kal.com.rolegames.dto.sessions.CampaignDTO;
import kal.com.rolegames.models.sessions.Campaign;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CampaignMapper {

    @Mapping(target = "dungeonMasterId", source = "dungeonMaster.userId")
    @Mapping(target = "dungeonMasterName", source = "dungeonMaster.username")
    @Mapping(target = "playerIds", ignore = true)
    @Mapping(target = "importantNPCIds", ignore = true)
    @Mapping(target = "sessionCount", expression = "java(campaign.getSessions().size())")
    CampaignDTO toDTO(Campaign campaign);

    @Mapping(target = "dungeonMaster", ignore = true)
    @Mapping(target = "players", ignore = true)
    @Mapping(target = "sessions", ignore = true)
    @Mapping(target = "importantNPCs", ignore = true)
    @Mapping(target = "activeCharacters", ignore = true)
    @Mapping(target = "version", ignore = true)
    Campaign toEntity(CampaignDTO dto);

    @Mapping(target = "dungeonMaster", ignore = true)
    @Mapping(target = "players", ignore = true)
    @Mapping(target = "sessions", ignore = true)
    @Mapping(target = "importantNPCs", ignore = true)
    @Mapping(target = "activeCharacters", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateCampaignFromDto(CampaignDTO source, @MappingTarget Campaign target);

}