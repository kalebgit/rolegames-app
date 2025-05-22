package kal.com.rolegames.controllers.characters;

import kal.com.rolegames.dto.characters.NonPlayerCharacterDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.NPCType;
import kal.com.rolegames.services.characters.NonPlayerCharacterService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/npcs")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class NonPlayerCharacterController {

    private final NonPlayerCharacterService npcService;

    @GetMapping
    public ResponseEntity<List<NonPlayerCharacterDTO>> getAllNPCs() {
        return ResponseEntity.ok(npcService.getAllNPCs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NonPlayerCharacterDTO> getNPCById(@PathVariable Long id) {
        return ResponseEntity.ok(npcService.getNPCById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<NonPlayerCharacterDTO>> getNPCsByType(@PathVariable NPCType type) {
        return ResponseEntity.ok(npcService.getNPCsByType(type));
    }

    @GetMapping("/creator")
    public ResponseEntity<List<NonPlayerCharacterDTO>> getCreatorNPCs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(npcService.getNPCsByCreator(user.getUserId()));
    }

    @PostMapping
    public ResponseEntity<NonPlayerCharacterDTO> createNPC(
            @RequestBody NonPlayerCharacterDTO npcDTO,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(npcService.createNPC(npcDTO, user.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NonPlayerCharacterDTO> updateNPC(
            @PathVariable Long id,
            @RequestBody NonPlayerCharacterDTO npcDTO) {
        return ResponseEntity.ok(npcService.updateNPC(id, npcDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNPC(@PathVariable Long id) {
        npcService.deleteNPC(id);
        return ResponseEntity.noContent().build();
    }
}