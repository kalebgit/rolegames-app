package kal.com.rolegames.dto.users;

import kal.com.rolegames.models.util.UserType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private UserType userType;
    private Set<UserType> activeRoles;
    private LocalDateTime createdAt;
    private Boolean canActAsPlayer;
    private Boolean canActAsDungeonMaster;
}