package kal.com.rolegames.dto;

import kal.com.rolegames.models.util.UserType;
import lombok.Data;
import lombok.NoArgsConstructor;

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