package kal.com.rolegames.models.users;

import jakarta.persistence.*;
import kal.com.rolegames.models.util.UserType;
import lombok.*;

@Entity
@Table(name = "user_roles")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true, exclude ={"user"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    @EqualsAndHashCode.Include
    private Long roleId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private UserType roleType;

    @Basic(optional = false)
    private Boolean isActive = true;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;
}
