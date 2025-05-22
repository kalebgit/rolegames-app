package kal.com.rolegames.repositories.items;

import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.util.ItemRarity;
import kal.com.rolegames.models.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByOwner(GameCharacter owner);
    List<Item> findByCreator(User creator);
    List<Item> findByRarity(ItemRarity rarity);
    List<Item> findByNameContainingIgnoreCase(String name);
    List<Item> findByRequiresAttunement(Boolean requiresAttunement);
}