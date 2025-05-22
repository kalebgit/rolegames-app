package kal.com.rolegames.controllers.items;

import kal.com.rolegames.dto.items.ArmorDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.services.items.ArmorService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/armor")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class ArmorController {

    private final ArmorService armorService;

    @GetMapping
    public ResponseEntity<List<ArmorDTO>> getAllArmor() {
        return ResponseEntity.ok(armorService.getAllArmor());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArmorDTO> getArmorById(@PathVariable Long id) {
        return ResponseEntity.ok(armorService.getArmorById(id));
    }

    @PostMapping
    public ResponseEntity<ArmorDTO> createArmor(
            @RequestBody ArmorDTO armorDTO,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(armorService.createArmor(armorDTO, user.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArmorDTO> updateArmor(
            @PathVariable Long id,
            @RequestBody ArmorDTO armorDTO) {
        return ResponseEntity.ok(armorService.updateArmor(id, armorDTO));
    }
}