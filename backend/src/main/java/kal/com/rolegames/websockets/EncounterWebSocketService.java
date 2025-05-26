package kal.com.rolegames.websockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import kal.com.rolegames.dto.combat.CombatActionDTO;
import kal.com.rolegames.dto.combat.CombatStateDTO;
import kal.com.rolegames.dto.combat.InitiativeDTO;
import kal.com.rolegames.services.sessions.EncounterService;
import kal.com.rolegames.websockets.EncounterWebSocketHandler;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class EncounterWebSocketService {

    private final EncounterWebSocketHandler webSocketHandler;

    public void notifyEncounterUpdate(Long encounterId, String eventType, Object data) {
        WebSocketMessage message = WebSocketMessage.builder()
                .type(eventType)
                .encounterId(encounterId)
                .timestamp(LocalDateTime.now())
                .data(data)
                .build();

        webSocketHandler.broadcastToEncounter(encounterId, message);
    }

    public void notifyActionPerformed(Long encounterId, CombatActionDTO action) {
        notifyEncounterUpdate(encounterId, "ACTION_PERFORMED", action);
    }

    public void notifyTurnChanged(Long encounterId, InitiativeDTO newTurn) {
        notifyEncounterUpdate(encounterId, "TURN_CHANGED", newTurn);
    }

    public void notifyCombatStarted(Long encounterId, CombatStateDTO combatState) {
        notifyEncounterUpdate(encounterId, "COMBAT_STARTED", combatState);
    }

    public void notifyCombatEnded(Long encounterId) {
        notifyEncounterUpdate(encounterId, "COMBAT_ENDED", null);
    }

    public void notifyParticipantAdded(Long encounterId, Long characterId) {
        notifyEncounterUpdate(encounterId, "PARTICIPANT_ADDED",
                Map.of("characterId", characterId));
    }

    public void notifyHealthUpdate(Long encounterId, Long characterId, int newHealth) {
        notifyEncounterUpdate(encounterId, "HEALTH_UPDATE",
                Map.of("characterId", characterId, "health", newHealth));
    }

    @Data
    @Builder
    public static class WebSocketMessage {
        private String type;
        private Long encounterId;
        private LocalDateTime timestamp;
        private Object data;
    }
}