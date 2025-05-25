package kal.com.rolegames.controllers.sessions;

import kal.com.rolegames.dto.items.RewardDTO;
import kal.com.rolegames.dto.sessions.EncounterDTO;
import kal.com.rolegames.services.sessions.EncounterService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encounters")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class EncounterController {

    private final EncounterService encounterService;

    private static final Logger logger = LoggerFactory.getLogger(EncounterController.class);

    @GetMapping
    public ResponseEntity<List<EncounterDTO>> getAllEncounters() {
        return ResponseEntity.ok(encounterService.getAllEncounters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EncounterDTO> getEncounterById(@PathVariable Long id) {
        return ResponseEntity.ok(encounterService.getEncounterById(id));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<EncounterDTO>> getEncountersBySession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(encounterService.getEncountersBySession(sessionId));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<EncounterDTO>> getCompletedEncounters() {
        return ResponseEntity.ok(encounterService.getCompletedEncounters());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<EncounterDTO>> getPendingEncounters() {
        return ResponseEntity.ok(encounterService.getPendingEncounters());
    }

    @PostMapping
    public ResponseEntity<EncounterDTO> createEncounter(@RequestBody CreateEncounterRequest request) {
        logger.info("[ENCOUNTER CONTROLLER] Creating encounter for session: {}", request.getSessionId());
        return ResponseEntity.ok(encounterService.createEncounter(request.getEncounterDTO(), request.getSessionId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EncounterDTO> updateEncounter(
            @PathVariable Long id,
            @RequestBody EncounterDTO encounterDTO) {
        return ResponseEntity.ok(encounterService.updateEncounter(id, encounterDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEncounter(@PathVariable Long id) {
        encounterService.deleteEncounter(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<EncounterDTO> completeEncounter(@PathVariable Long id) {
        return ResponseEntity.ok(encounterService.completeEncounter(id));
    }

    @PostMapping("/{id}/start-combat")
    public ResponseEntity<EncounterDTO> startCombat(@PathVariable Long id) {
        return ResponseEntity.ok(encounterService.startCombat(id));
    }

    @PostMapping("/{id}/participants/{characterId}")
    public ResponseEntity<EncounterDTO> addParticipant(
            @PathVariable Long id,
            @PathVariable Long characterId) {
        return ResponseEntity.ok(encounterService.addParticipant(id, characterId));
    }

    @DeleteMapping("/{id}/participants/{characterId}")
    public ResponseEntity<EncounterDTO> removeParticipant(
            @PathVariable Long id,
            @PathVariable Long characterId) {
        return ResponseEntity.ok(encounterService.removeParticipant(id, characterId));
    }

    @PostMapping("/{id}/rewards")
    public ResponseEntity<EncounterDTO> addReward(
            @PathVariable Long id,
            @RequestBody RewardDTO rewardDTO) {
        return ResponseEntity.ok(encounterService.addReward(id, rewardDTO));
    }

    @DeleteMapping("/{id}/rewards/{rewardId}")
    public ResponseEntity<EncounterDTO> removeReward(
            @PathVariable Long id,
            @PathVariable Long rewardId) {
        return ResponseEntity.ok(encounterService.removeReward(id, rewardId));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateEncounterRequest {
        private EncounterDTO encounterDTO;
        private Long sessionId;
    }
}