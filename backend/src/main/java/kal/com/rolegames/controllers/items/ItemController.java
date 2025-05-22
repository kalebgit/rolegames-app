package kal.com.rolegames.controllers.items;

import kal.com.rolegames.dto.items.ItemDTO;
import kal.com.rolegames.services.items.ItemService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<ItemDTO>> getItemsByOwner(@PathVariable Long ownerId) {
        return ResponseEntity.ok(itemService.getItemsByOwner(ownerId));
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<ItemDTO>> getItemsByCreator(@PathVariable Long creatorId) {
        return ResponseEntity.ok(itemService.getItemsByCreator(creatorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}