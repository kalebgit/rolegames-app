package kal.com.rolegames.controllers.combat;

import kal.com.rolegames.dto.combat.CombatStateDTO;
import kal.com.rolegames.services.combat.CombatService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/combat")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class CombatController {

    private final CombatService combatService;

    @GetMapping("/current")
    public ResponseEntity<CombatStateDTO> getCurrentCombat() {
        return ResponseEntity.ok(combatService.getCurrentCombat());
    }

    @PostMapping("/start")
    public ResponseEntity<CombatStateDTO> startCombat(@RequestBody StartCombatRequest request) {
        return ResponseEntity.ok(combatService.startCombatForEncounter(request.getEncounterId()));
    }

    @PostMapping("/next-turn")
    public ResponseEntity<CombatStateDTO> nextTurn() {
        return ResponseEntity.ok(combatService.nextTurn());
    }

    @PostMapping("/end")
    public ResponseEntity<Void> endCombat() {
        combatService.endCombat();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add-participant")
    public ResponseEntity<CombatStateDTO> addParticipant(@RequestBody AddParticipantRequest request) {
        return ResponseEntity.ok(combatService.addParticipant(
                request.getCharacterId(),
                request.getInitiative()));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StartCombatRequest {
        private Long encounterId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddParticipantRequest {
        private Long characterId;
        private Integer initiative;
    }
}