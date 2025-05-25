package kal.com.rolegames.mappers.users;

import kal.com.rolegames.dto.users.UserDTO;
import kal.com.rolegames.models.users.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    @Mapping(target = "activeRoles", source = "activeRoles")
    @Mapping(target = "canActAsPlayer", expression = "java(user.canActAsPlayer())")
    @Mapping(target = "canActAsDungeonMaster", expression = "java(user.canActAsDungeonMaster())")
    UserDTO toDto(User user);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    User toEntity(UserDTO dto);

    List<UserDTO> toUserDtoList(List<User> users);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateUserFromDto(UserDTO source, @MappingTarget User target);
}