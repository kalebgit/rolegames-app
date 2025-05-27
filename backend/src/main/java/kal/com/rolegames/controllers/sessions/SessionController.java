package kal.com.rolegames.controllers.sessions;

import kal.com.rolegames.dto.sessions.SessionDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.services.sessions.SessionService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class SessionController {

    private final SessionService sessionService;

    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    @GetMapping
    public ResponseEntity<List<SessionDTO>> getAllSessions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sessionService.getAllSessions(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionDTO> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<SessionDTO>> getSessionsByCampaign(@PathVariable Long campaignId) {
        return ResponseEntity.ok(sessionService.getSessionsByCampaign(campaignId));
    }

    @PostMapping("/campaign/{campaignId}")
    public ResponseEntity<SessionDTO> createSession(
            @PathVariable Long campaignId,
            @RequestBody SessionDTO sessionDTO) {
        logger.info("[SESSION CONTROLLER] Creating session for campaign: {}", campaignId);
        return ResponseEntity.ok(sessionService.createSession(sessionDTO, campaignId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionDTO> updateSession(
            @PathVariable Long id,
            @RequestBody SessionDTO sessionDTO) {
        return ResponseEntity.ok(sessionService.updateSession(id, sessionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/players/{playerId}")
    public ResponseEntity<SessionDTO> addPlayerToSession(
            @PathVariable Long id,
            @PathVariable Long playerId) {
        return ResponseEntity.ok(sessionService.addPlayerToSession(id, playerId));
    }

    @DeleteMapping("/{id}/players/{playerId}")
    public ResponseEntity<SessionDTO> removePlayerFromSession(
            @PathVariable Long id,
            @PathVariable Long playerId) {
        return ResponseEntity.ok(sessionService.removePlayerFromSession(id, playerId));
    }

    @PostMapping("/{id}/characters/{characterId}")
    public ResponseEntity<SessionDTO> addCharacterToSession(
            @PathVariable Long id,
            @PathVariable Long characterId) {
        return ResponseEntity.ok(sessionService.addCharacterToSession(id, characterId));
    }

    @DeleteMapping("/{id}/characters/{characterId}")
    public ResponseEntity<SessionDTO> removeCharacterFromSession(
            @PathVariable Long id,
            @PathVariable Long characterId) {
        return ResponseEntity.ok(sessionService.removeCharacterFromSession(id, characterId));
    }

    @PutMapping("/{id}/characters/swap")
    public ResponseEntity<SessionDTO> swapCharacterInSession(
            @PathVariable Long id,
            @RequestBody SwapCharacterRequest request) {
        return ResponseEntity.ok(sessionService.swapCharacterInSession(id, request.getNewCharacterId()));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SwapCharacterRequest {
        private Long newCharacterId;
    }
}