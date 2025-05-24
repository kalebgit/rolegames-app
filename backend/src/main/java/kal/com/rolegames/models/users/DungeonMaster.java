package kal.com.rolegames.models.users;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.sessions.Campaign;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@PrimaryKeyJoinColumn(name = "dm_id")
@Table(name="dungeon_masters")
//lombok annotations
@SuperBuilder
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@ToString(callSuper = true, exclude = {"campaigns", "createdNpcs", "createdItems"})
public class DungeonMaster extends User {

    @OneToMany(mappedBy = "dungeonMaster", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Campaign> campaigns = new HashSet<>();


    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<NonPlayerCharacter> createdNpcs = new HashSet<>();

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Item> createdItems = new HashSet<>();

    private String dmStyle;

    private Float rating;


    /**
     * Verifica que el usuario puede actuar como DM antes de hacer operaciones
     */
    private void validateDMRole() {
        if (!canActAsDungeonMaster()) {
            throw new IllegalStateException("User does not have DUNGEON_MASTER role");
        }
    }

    public void addCampaign(Campaign campaign) {
        campaigns.add(campaign);
        campaign.setDungeonMaster(this);
    }

    public void removeCampaign(Campaign campaign) {
        campaigns.remove(campaign);
        campaign.setDungeonMaster(null);
    }

    public void createNpc(NonPlayerCharacter npc) {
        createdNpcs.add(npc);
        npc.setCreator(this);
    }

    public void createItem(Item item) {
        createdItems.add(item);
        item.setCreator(this);
    }
}