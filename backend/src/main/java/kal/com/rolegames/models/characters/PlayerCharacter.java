package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.sessions.Session;
import kal.com.rolegames.models.spells.Spell;
import kal.com.rolegames.models.spells.SpellSlot;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.util.CharacterClassType;
import kal.com.rolegames.models.util.EquipSlot;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@PrimaryKeyJoinColumn(name = "player_character_id")
//lombok annotations
@SuperBuilder
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@ToString(callSuper = true)
public class PlayerCharacter extends GameCharacter {

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private CharacterClassType characterClass;

    private String subclass;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Item> inventory = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name = "character_equipped_items",
            joinColumns = @JoinColumn(name = "character_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    @MapKeyEnumerated(EnumType.STRING)
    @MapKeyColumn(name = "equip_slot")
    private Map<EquipSlot, Item> equippedItems = new HashMap<>();

    @ManyToMany
    @JoinTable(
            name = "character_spells",
            joinColumns = @JoinColumn(name = "character_id"),
            inverseJoinColumns = @JoinColumn(name = "spell_id")
    )
    private Set<Spell> spells = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "character_features",
            joinColumns = @JoinColumn(name = "character_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    private Set<Feature> features = new HashSet<>();

    private String backstory;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign currentCampaign;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "death_save_id")
    private DeathSaveTracker deathSaves;

    @ManyToMany(mappedBy = "attendingCharacters")
    private Set<Session> sessions = new HashSet<>();

    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SpellSlot> spellSlots = new HashSet<>();

    public void addItemToInventory(Item item) {
        // TODO: Set item's owner to this character
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

    public void equipItem(Item item, EquipSlot slot) {
        // desequipar el item de ese slot
        if(equippedItems.get(slot) != null){
           equippedItems.remove(slot);
        }

        // equipar item
        if(!inventory.contains(item)) {
            addItemToInventory(item);
        }
        equippedItems.put(slot, item);
    }

    public void unequipItem(EquipSlot slot) {
        equippedItems.remove(slot);
    }

}