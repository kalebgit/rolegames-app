package kal.com.rolegames.mappers.users;

import kal.com.rolegames.dto.users.DungeonMasterDTO;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.DungeonMaster;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DungeonMasterMapper {

    @Mapping(target = "userId", source = "user.userId")
    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "createdAt", source = "user.createdAt")
    @Mapping(target = "campaignCount", expression = "java(dm.getCampaigns().size())")
    @Mapping(target = "activeCampaignCount", expression = "java((int) dm.getCampaigns().stream().filter(c -> c.getIsActive() != null && c.getIsActive()).count())")
    @Mapping(target = "npcCount", expression = "java(dm.getCreatedNpcs().size())")
    @Mapping(target = "itemCount", expression = "java(dm.getCreatedItems().size())")
    @Mapping(target = "campaignIds", ignore = true)
    @Mapping(target = "npcIds", ignore = true)
    @Mapping(target = "itemIds", ignore = true)
    DungeonMasterDTO toDto(DungeonMaster dm);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "campaigns", ignore = true)
    @Mapping(target = "createdNpcs", ignore = true)
    @Mapping(target = "createdItems", ignore = true)
    DungeonMaster toEntity(DungeonMasterDTO dto);

    List<DungeonMasterDTO> toDungeonMasterDtoList(List<DungeonMaster> dms);

    @Mapping(target = "dungeonMasterId", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "campaigns", ignore = true)
    @Mapping(target = "createdNpcs", ignore = true)
    @Mapping(target = "createdItems", ignore = true)
    void updateDungeonMasterFromDto(DungeonMasterDTO source, @MappingTarget DungeonMaster target);

    @AfterMapping
    default void mapIds(DungeonMaster source, @MappingTarget DungeonMasterDTO target) {
        if (source.getCampaigns() != null) {
            target.setCampaignIds(source.getCampaigns().stream()
                    .map(Campaign::getCampaignId)
                    .collect(Collectors.toSet()));
        }
        if (source.getCreatedNpcs() != null) {
            target.setNpcIds(source.getCreatedNpcs().stream()
                    .map(npc -> npc.getCharacterId())
                    .collect(Collectors.toSet()));
        }
        if (source.getCreatedItems() != null) {
            target.setItemIds(source.getCreatedItems().stream()
                    .map(item -> item.getItemId())
                    .collect(Collectors.toSet()));
        }
    }
}