package kal.com.rolegames.dto;

import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private UserType userType;
    private LocalDateTime createdAt;
}