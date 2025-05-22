//package kal.com.rolegames.models.notcertain;
//
//import jakarta.persistence.*;
//import kal.com.rolegames.models.sessions.Campaign;
//import kal.com.rolegames.models.users.User;
//import kal.com.rolegames.models.util.RoleType;
//import lombok.*;
//import lombok.experimental.SuperBuilder;
//
//import java.util.Set;
//
//@Entity
//@Inheritance(strategy= InheritanceType.JOINED)
////lombok
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@SuperBuilder
//@ToString(includeFieldNames = true)
//@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//public abstract class Role {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @EqualsAndHashCode.Include
//    private Long roleId;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    @EqualsAndHashCode.Include
//    private User user;
//
//
//    @ManyToMany
//    @JoinTable(name="role_campaigns",
//        joinColumns = @JoinColumn(name = "role_id"),
//        inverseJoinColumns = @JoinColumn(name = "campaign_id"))
//    private Set<Campaign> campaigns;
//
//    @Enumerated(EnumType.STRING)
//    private RoleType roleType;
//
//    public void addCampaign(Campaign campaign) {
//        campaigns.add(campaign);
//        // If Campaign has a roles collection, update it too
//        // campaign.getRoles().add(this);
//    }
//
//    public void removeCampaign(Campaign campaign) {
//        campaigns.remove(campaign);
//        // If Campaign has a roles collection, update it too
//        // campaign.getRoles().remove(this);
//    }
//
//
//}
