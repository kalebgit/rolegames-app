package kal.com.rolegames.mappers.items;

import kal.com.rolegames.dto.items.RewardDTO;
import kal.com.rolegames.models.items.Reward;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RewardMapper {

    RewardDTO toDTO(Reward source);

    Reward toEntity(RewardDTO dto);

    List<RewardDTO> toRewardListDto(List<Reward> initiatives);

    void updateRewardFromDto(RewardDTO source, @MappingTarget Reward target);
}
