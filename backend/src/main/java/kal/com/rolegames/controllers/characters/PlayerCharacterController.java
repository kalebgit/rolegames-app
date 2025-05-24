package kal.com.rolegames.controllers.characters;

import kal.com.rolegames.dto.characters.PlayerCharacterDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.services.characters.PlayerCharacterService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class PlayerCharacterController {

    private final PlayerCharacterService playerCharacterService;

    private static final Logger logger = LoggerFactory.getLogger(PlayerCharacterController.class);

    @GetMapping
    public ResponseEntity<List<PlayerCharacterDTO>> getAllCharacters() {
        return ResponseEntity.ok(playerCharacterService.getAllCharacters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerCharacterDTO> getCharacterById(@PathVariable Long id) {
        return ResponseEntity.ok(playerCharacterService.getCharacterById(id));
    }

    @GetMapping("/player")
    public ResponseEntity<List<PlayerCharacterDTO>> getMyCharacters(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(playerCharacterService.getCharactersByPlayer(user.getUserId()));
    }

    @GetMapping("/player/{playerId}")
    public ResponseEntity<List<PlayerCharacterDTO>> getCharactersByPlayer(@PathVariable Long playerId) {
        return ResponseEntity.ok(playerCharacterService.getCharactersByPlayer(playerId));
    }

    @PostMapping
    public ResponseEntity<PlayerCharacterDTO> createCharacter(
            @RequestBody PlayerCharacterDTO characterDTO,
            @AuthenticationPrincipal User user) {
        logger.info("[CONTROLLER] [character= {}] con [USER= {}] recibidos para crear personaje", characterDTO, user);
        return ResponseEntity.ok(playerCharacterService.createCharacter(characterDTO, user.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerCharacterDTO> updateCharacter(
            @PathVariable Long id,
            @RequestBody PlayerCharacterDTO characterDTO) {
        return ResponseEntity.ok(playerCharacterService.updateCharacter(id, characterDTO));
    }

}