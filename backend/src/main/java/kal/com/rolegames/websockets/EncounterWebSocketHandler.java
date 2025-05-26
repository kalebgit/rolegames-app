package kal.com.rolegames.websockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import kal.com.rolegames.dto.sessions.EncounterDTO;
import kal.com.rolegames.services.sessions.EncounterService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class EncounterWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(EncounterWebSocketHandler.class);

    private EncounterService encounterService;

    private ObjectMapper objectMapper;
    // Mapa de encounterId -> Set de sesiones conectadas
    private final Map<Long, Set<WebSocketSession>> encounterSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long encounterId = getEncounterIdFromSession(session);

        encounterSessions.computeIfAbsent(encounterId, k -> ConcurrentHashMap.newKeySet())
                .add(session);

        logger.info("Cliente conectado al encounter {}: {}", encounterId, session.getId());

        // Enviar estado inicial del encounter
        sendInitialState(session, encounterId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long encounterId = getEncounterIdFromSession(session);

        Set<WebSocketSession> sessions = encounterSessions.get(encounterId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                encounterSessions.remove(encounterId);
            }
        }

        logger.info("Cliente desconectado del encounter {}: {}", encounterId, session.getId());
    }

    public void broadcastToEncounter(Long encounterId, Object message) {
        Set<WebSocketSession> sessions = encounterSessions.get(encounterId);
        if (sessions != null) {
            String json = convertToJson(message);
            sessions.forEach(session -> {
                try {
                    if (session.isOpen()) {
                        session.sendMessage(new TextMessage(json));
                    }
                } catch (Exception e) {
                    logger.error("Error enviando mensaje a sesión {}: {}", session.getId(), e.getMessage());
                }
            });
        }
    }

    private Long getEncounterIdFromSession(WebSocketSession session) {
        String path = session.getUri().getPath();
        return Long.parseLong(path.substring(path.lastIndexOf('/') + 1));
    }

    private void sendInitialState(WebSocketSession session, Long encounterId) {
        try {
            EncounterDTO encounter = encounterService.getEncounterById(encounterId);

            Map<String, Object> initialState = Map.of(
                    "type", "INITIAL_STATE",
                    "encounterId", encounterId,
                    "encounter", encounter
            );

            String json = convertToJson(initialState);
            session.sendMessage(new TextMessage(json));

        } catch (Exception e) {
            logger.error("Error enviando estado inicial a sesión {}: {}", session.getId(), e.getMessage());
        }
    }

    private String convertToJson(Object message) {
        try {
            return objectMapper.writeValueAsString(message);
        } catch (Exception e) {
            logger.error("Error convirtiendo mensaje a JSON: {}", e.getMessage());
            return "{}";
        }
    }
}