package kal.com.rolegames.services.items;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.items.ItemDTO;
import kal.com.rolegames.mappers.items.ItemMapper;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import kal.com.rolegames.repositories.items.ItemRepository;
import kal.com.rolegames.repositories.users.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class ItemService {

    private final ItemRepository itemRepository;
    private final GameCharacterRepository characterRepository;
    private final UserRepository userRepository;

    private final ItemMapper itemMapper;

    public List<ItemDTO> getAllItems() {
        return itemMapper.toItemListDto(new ArrayList<>(itemRepository.findAll()));
    }

    public List<ItemDTO> getItemsByOwner(Long ownerId) {
        GameCharacter owner = characterRepository.findById(ownerId)
                .orElseThrow(() -> new NoSuchElementException("Character not found"));

        return itemMapper.toItemListDto(itemRepository.findByOwner(owner).stream()
                .collect(Collectors.toList()));
    }

    public List<ItemDTO> getItemsByCreator(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        return itemMapper.toItemListDto( itemRepository.findByCreator(creator).stream()
                .collect(Collectors.toList()));
    }

    public ItemDTO getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Item not found"));
        return itemMapper.toDTO(item);
    }

    @Transactional
    public void deleteItem(Long itemId) {
        if (!itemRepository.existsById(itemId)) {
            throw new NoSuchElementException("Item not found");
        }
        itemRepository.deleteById(itemId);
    }

}