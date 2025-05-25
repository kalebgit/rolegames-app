package kal.com.rolegames.dto.users;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
public class PlayerDTO {
    private Long playerId;
    private Long userId;
    private String username;
    private String email;
    private Integer experience;
    private Integer level;
    private Integer characterCount;
    private Set<Long> characterIds = new HashSet<>();
    private LocalDateTime createdAt;
}