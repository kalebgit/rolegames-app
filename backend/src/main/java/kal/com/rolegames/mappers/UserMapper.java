package kal.com.rolegames.mappers;

import kal.com.rolegames.dto.UserDTO;
import kal.com.rolegames.models.users.User;
import org.mapstruct.Mapper;

@Mapper
public interface UserMapper {

    UserDTO toDto(User source);

    User toEntity(UserDTO dto);

}
