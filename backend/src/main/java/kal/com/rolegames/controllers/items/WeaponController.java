package kal.com.rolegames.controllers.items;

import kal.com.rolegames.dto.items.WeaponDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.services.items.WeaponService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weapons")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class WeaponController {

    private final WeaponService weaponService;

    @GetMapping
    public ResponseEntity<List<WeaponDTO>> getAllWeapons() {
        return ResponseEntity.ok(weaponService.getAllWeapons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeaponDTO> getWeaponById(@PathVariable Long id) {
        return ResponseEntity.ok(weaponService.getWeaponById(id));
    }

    @PostMapping
    public ResponseEntity<WeaponDTO> createWeapon(
            @RequestBody WeaponDTO weaponDTO,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(weaponService.createWeapon(weaponDTO, user.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeaponDTO> updateWeapon(
            @PathVariable Long id,
            @RequestBody WeaponDTO weaponDTO) {
        return ResponseEntity.ok(weaponService.updateWeapon(id, weaponDTO));
    }
}