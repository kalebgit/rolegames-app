package kal.com.rolegames.controllers.sessions;

import kal.com.rolegames.dto.combat.CombatActionDTO;
import kal.com.rolegames.dto.combat.PerformActionRequest;
import kal.com.rolegames.dto.items.RewardDTO;
import kal.com.rolegames.dto.sessions.EncounterDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.services.combat.CombatActionService;
import kal.com.rolegames.services.sessions.EncounterService;
import kal.com.rolegames.websockets.EncounterWebSocketHandler;
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
import java.util.Map;

@RestController
@RequestMapping("/api/encounters")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class EncounterController {

    private final EncounterService encounterService;
    private final CombatActionService combatActionService;

    private final EncounterWebSocketHandler webSocketHandler; // NUEVO

    private static final Logger logger = LoggerFactory.getLogger(EncounterController.class);

    // ========================================
    // CRUD BÁSICO DE ENCOUNTERS
    // ========================================

    @GetMapping
    public ResponseEntity<List<EncounterDTO>> getAllEncounters(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(encounterService.getAllEncounters(user));
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
        EncounterDTO result = encounterService.completeEncounter(id);

        // Notificar encuentro completado via WebSocket
        try {
            Map<String, Object> encounterCompletedMessage = Map.of(
                    "type", "ENCOUNTER_COMPLETED",
                    "encounterId", id,
                    "encounter", result,
                    "timestamp", System.currentTimeMillis()
            );
            webSocketHandler.broadcastToEncounter(id, encounterCompletedMessage);
        } catch (Exception e) {
            logger.warn("Error notificando encuentro completado via WebSocket: {}", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }


    // ========================================
    // GESTIÓN DE COMBATE
    // ========================================

    @PostMapping("/{id}/start-combat")
    public ResponseEntity<EncounterDTO> startCombat(
            @PathVariable Long id,
            @RequestBody Map<Long, Integer> diceThrows) {
        logger.info("[ENCOUNTER CONTROLLER] Starting combat for encounter: {}", id);

        EncounterDTO result = encounterService.startCombat(id, diceThrows);

        // Notificar via WebSocket que el combate ha iniciado
        try {
            Map<String, Object> combatStartedMessage = Map.of(
                    "type", "COMBAT_STARTED",
                    "encounterId", id,
                    "encounter", result,
                    "timestamp", System.currentTimeMillis()
            );
            webSocketHandler.broadcastToEncounter(id, combatStartedMessage);
        } catch (Exception e) {
            logger.warn("Error notificando inicio de combate via WebSocket: {}", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }


    @PostMapping("/{id}/end-combat")
    public ResponseEntity<EncounterDTO> endCombat(@PathVariable Long id) {
        logger.info("[ENCOUNTER CONTROLLER] Ending combat for encounter: {}", id);

        EncounterDTO result = encounterService.completeEncounterAndEndCombat(id);

        // Notificar fin de combate via WebSocket
        try {
            Map<String, Object> combatEndedMessage = Map.of(
                    "type", "COMBAT_ENDED",
                    "encounterId", id,
                    "encounter", result,
                    "timestamp", System.currentTimeMillis()
            );
            webSocketHandler.broadcastToEncounter(id, combatEndedMessage);
        } catch (Exception e) {
            logger.warn("Error notificando fin de combate via WebSocket: {}", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/next-turn")
    public ResponseEntity<EncounterDTO> nextTurn(@PathVariable Long id) {
        logger.info("[ENCOUNTER CONTROLLER] Advancing to next turn for encounter: {}", id);

        EncounterDTO result = encounterService.nextTurn(id);

        // Notificar cambio de turno via WebSocket
        try {
            Map<String, Object> turnChangedMessage = Map.of(
                    "type", "TURN_CHANGED",
                    "encounterId", id,
                    "encounter", result,
                    "timestamp", System.currentTimeMillis()
            );
            webSocketHandler.broadcastToEncounter(id, turnChangedMessage);
        } catch (Exception e) {
            logger.warn("Error notificando cambio de turno via WebSocket: {}", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }


    // ========================================
    // SISTEMA DE ACCIONES DE COMBATE
    // ========================================

    @PostMapping("/{id}/perform-action")
    public ResponseEntity<CombatActionDTO> performAction(
            @PathVariable Long id,
            @RequestBody PerformActionRequest request) {
        logger.info("[ENCOUNTER CONTROLLER] Performing action {} for encounter: {} by character: {}",
                request.getActionType(), id, request.getCharacterId());

        CombatActionDTO result = combatActionService.performAction(request);

        logger.info("[ENCOUNTER CONTROLLER] Action completed: {} with result: {}",
                request.getActionType(), result.getResult().getSuccess());

        return ResponseEntity.ok(result);
    }

    // ========================================
    // GESTIÓN DE PARTICIPANTES
    // ========================================

    @PostMapping("/{id}/participants/{characterId}")
    public ResponseEntity<EncounterDTO> addParticipant(
            @PathVariable Long id,
            @PathVariable Long characterId,
            @RequestParam(required = false) Integer initiativeRoll) {
        logger.info("[ENCOUNTER CONTROLLER] Adding participant {} to encounter: {}", characterId, id);

        EncounterDTO result = encounterService.addParticipant(id, characterId);

        // Notificar nuevo participante via WebSocket
        try {
            Map<String, Object> participantAddedMessage = Map.of(
                    "type", "PARTICIPANT_ADDED",
                    "encounterId", id,
                    "characterId", characterId,
                    "encounter", result,
                    "timestamp", System.currentTimeMillis()
            );
            webSocketHandler.broadcastToEncounter(id, participantAddedMessage);
        } catch (Exception e) {
            logger.warn("Error notificando nuevo participante via WebSocket: {}", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}/participants/{characterId}")
    public ResponseEntity<EncounterDTO> removeParticipant(
            @PathVariable Long id,
            @PathVariable Long characterId) {
        logger.info("[ENCOUNTER CONTROLLER] Removing participant {} from encounter: {}", characterId, id);

        EncounterDTO result = encounterService.removeParticipant(id, characterId);

        // Notificar participante removido via WebSocket
        try {
            Map<String, Object> participantRemovedMessage = Map.of(
                    "type", "PARTICIPANT_REMOVED",
                    "encounterId", id,
                    "characterId", characterId,
                    "encounter", result,
                    "timestamp", System.currentTimeMillis()
            );
            webSocketHandler.broadcastToEncounter(id, participantRemovedMessage);
        } catch (Exception e) {
            logger.warn("Error notificando participante removido via WebSocket: {}", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }

    // ========================================
    // GESTIÓN DE RECOMPENSAS
    // ========================================

    @PostMapping("/{id}/rewards")
    public ResponseEntity<EncounterDTO> addReward(
            @PathVariable Long id,
            @RequestBody RewardDTO rewardDTO) {
        logger.info("[ENCOUNTER CONTROLLER] Adding reward to encounter: {}", id);
        return ResponseEntity.ok(encounterService.addReward(id, rewardDTO));
    }

    @DeleteMapping("/{id}/rewards/{rewardId}")
    public ResponseEntity<EncounterDTO> removeReward(
            @PathVariable Long id,
            @PathVariable Long rewardId) {
        logger.info("[ENCOUNTER CONTROLLER] Removing reward {} from encounter: {}", rewardId, id);
        return ResponseEntity.ok(encounterService.removeReward(id, rewardId));
    }

    // ========================================
    // CLASES DE REQUEST
    // ========================================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateEncounterRequest {
        private EncounterDTO encounterDTO;
        private Long sessionId;
    }
}