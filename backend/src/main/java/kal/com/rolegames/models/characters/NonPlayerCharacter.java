package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.NPCType;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@PrimaryKeyJoinColumn(name = "npc_id")
//lombok annotations
@SuperBuilder
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@ToString(callSuper = true)
public class NonPlayerCharacter extends GameCharacter {

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private NPCType npcType;

    private Float challengeRating;

//    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
//    @JoinColumn(name = "npc_id")
//    private Set<DialogueOption> dialogue = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "behavior_id")
    private NPCBehavior behavior;

    private String motivation;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "npc_id")
    private Set<NPCAssociation> associations = new HashSet<>();

    private Boolean isHostile;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Item> inventory = new HashSet<>();

    @ManyToMany(mappedBy = "importantNPCs")
    private Set<Campaign> campaigns = new HashSet<>();

//    // Method to add a dialogue option to this NPC
//    // Should add the DialogueOption to the dialogue set
//    public void addDialogueOption(DialogueOption option) {
//        // TODO: Add option to dialogue set
//    }

    public void addAssociation(NonPlayerCharacter otherNpc, String relationship) {
        associations.add(NPCAssociation.builder().otherNpc(otherNpc).relationship(relationship).build());
    }

    public void addItemToInventory(Item item) {
        item.setOwner(this);
        // TODO: Add item to inventory set
        inventory.add(item);
    }

    public void removeItemFromInventory(Item item) {
        if(inventory.contains(item)){
            item.setOwner(null);
            inventory.remove(item);
        }
    }
}