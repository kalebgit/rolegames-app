// ========================================
// EncounterWebSocketHandler.java - Correcciones
// ========================================

package kal.com.rolegames.websockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import kal.com.rolegames.dto.sessions.EncounterDTO;
import kal.com.rolegames.services.sessions.EncounterService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class EncounterWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(EncounterWebSocketHandler.class);

    private final ObjectMapper objectMapper;

    // Mapa de encounterId -> Set de sesiones conectadas
    private final Map<Long, Set<WebSocketSession>> encounterSessions = new ConcurrentHashMap<>();
    // Mapa de sessionId -> encounterId para tracking
    private final Map<String, Long> sessionToEncounter = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long encounterId = getEncounterIdFromSession(session);

        if (encounterId == null) {
            logger.error("No se pudo extraer encounterId de la sesión: {}", session.getUri());
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        encounterSessions.computeIfAbsent(encounterId, k -> ConcurrentHashMap.newKeySet())
                .add(session);
        sessionToEncounter.put(session.getId(), encounterId);

        logger.info("Cliente conectado al encounter {}: {} (Total: {} clientes)",
                encounterId, session.getId(), encounterSessions.get(encounterId).size());

        // Enviar estado inicial del encounter
        sendConnectionSuccessMessage(session, encounterId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long encounterId = sessionToEncounter.remove(session.getId());

        if (encounterId != null) {
            Set<WebSocketSession> sessions = encounterSessions.get(encounterId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    encounterSessions.remove(encounterId);
                    logger.info("Último cliente desconectado del encounter {}", encounterId);
                }
            }
        }

        logger.info("Cliente desconectado del encounter {}: {} (Código: {})",
                encounterId, session.getId(), status.getCode());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String payload = message.getPayload();
            logger.debug("Mensaje recibido de {}: {}", session.getId(), payload);

            // Aquí puedes procesar mensajes entrantes del cliente
            Map<String, Object> messageData = objectMapper.readValue(payload, Map.class);
            handleClientMessage(session, messageData);

        } catch (Exception e) {
            logger.error("Error procesando mensaje de {}: {}", session.getId(), e.getMessage());
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        logger.error("Error de transporte en sesión {}: {}", session.getId(), exception.getMessage());
        session.close(CloseStatus.SERVER_ERROR);
    }

    // ========================================
    // MÉTODOS PÚBLICOS PARA BROADCASTING
    // ========================================

    public void broadcastToEncounter(Long encounterId, Object message) {
        Set<WebSocketSession> sessions = encounterSessions.get(encounterId);
        if (sessions != null && !sessions.isEmpty()) {
            String json = convertToJson(message);
            logger.debug("Broadcasting a {} clientes del encounter {}: {}",
                    sessions.size(), encounterId, json);

            // Crear copia para evitar ConcurrentModificationException
            Set<WebSocketSession> sessionsCopy = Set.copyOf(sessions);
            sessionsCopy.forEach(session -> sendMessageToSession(session, json));
        } else {
            logger.debug("No hay clientes conectados al encounter {} para broadcast", encounterId);
        }
    }

    public void sendToSession(WebSocketSession session, Object message) {
        String json = convertToJson(message);
        sendMessageToSession(session, json);
    }

    // ========================================
    // MÉTODOS PRIVADOS
    // ========================================

    private void handleClientMessage(WebSocketSession session, Map<String, Object> messageData) {
        try {
            String type = (String) messageData.get("type");
            Long encounterId = sessionToEncounter.get(session.getId());

            if (encounterId == null) {
                logger.warn("Sesión {} no tiene encounter asociado", session.getId());
                return;
            }

            logger.info("Procesando mensaje tipo '{}' de sesión {} para encounter {}",
                    type, session.getId(), encounterId);

            switch (type) {
                case "USER_JOINED":
                    handleUserJoined(session, messageData, encounterId);
                    break;
                case "PERFORM_ACTION":
                    handleActionRequest(session, messageData, encounterId);
                    break;
                case "DICE_ROLL":
                    handleDiceRoll(session, messageData, encounterId);
                    break;
                case "CHAT_MESSAGE":
                    handleChatMessage(session, messageData, encounterId);
                    break;
                default:
                    logger.warn("Tipo de mensaje no reconocido: {}", type);
            }

        } catch (Exception e) {
            logger.error("Error manejando mensaje del cliente: {}", e.getMessage());
        }
    }

    private void handleUserJoined(WebSocketSession session, Map<String, Object> messageData, Long encounterId) {
        // Notificar a otros usuarios que alguien se unió
        Map<String, Object> userJoinedMessage = Map.of(
                "type", "USER_JOINED",
                "data", messageData.get("data"),
                "timestamp", System.currentTimeMillis()
        );

        // Broadcast a todos EXCEPTO al que se conectó
        broadcastToOthers(encounterId, session, userJoinedMessage);
    }

    private void handleActionRequest(WebSocketSession session, Map<String, Object> messageData, Long encounterId) {
        // Este mensaje debería ser manejado por el controller REST,
        // aquí solo lo notificamos para logging
        logger.info("Acción solicitada via WebSocket para encounter {}: {}",
                encounterId, messageData.get("data"));
    }

    private void handleDiceRoll(WebSocketSession session, Map<String, Object> messageData, Long encounterId) {
        // Broadcast la tirada de dados a todos los usuarios
        Map<String, Object> diceMessage = Map.of(
                "type", "DICE_ROLLED",
                "data", messageData.get("data"),
                "sessionId", session.getId(),
                "timestamp", System.currentTimeMillis()
        );

        broadcastToEncounter(encounterId, diceMessage);
    }

    private void handleChatMessage(WebSocketSession session, Map<String, Object> messageData, Long encounterId) {
        // Broadcast mensaje de chat a todos
        Map<String, Object> chatMessage = Map.of(
                "type", "CHAT_MESSAGE",
                "data", messageData.get("data"),
                "sessionId", session.getId(),
                "timestamp", System.currentTimeMillis()
        );

        broadcastToEncounter(encounterId, chatMessage);
    }

    private void sendConnectionSuccessMessage(WebSocketSession session, Long encounterId) {
        try {
            Map<String, Object> connectionMessage = Map.of(
                    "type", "CONNECTION_ESTABLISHED",
                    "encounterId", encounterId,
                    "sessionId", session.getId(),
                    "timestamp", System.currentTimeMillis()
            );

            sendToSession(session, connectionMessage);

            logger.debug("Mensaje de conexión enviado a sesión {} para encounter {}",
                    session.getId(), encounterId);

        } catch (Exception e) {
            logger.error("Error enviando mensaje de conexión a sesión {}: {}", session.getId(), e.getMessage());
        }
    }

    private void sendMessageToSession(WebSocketSession session, String json) {
        try {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(json));
            } else {
                logger.warn("Intentando enviar mensaje a sesión cerrada: {}", session.getId());
            }
        } catch (IOException e) {
            logger.error("Error enviando mensaje a sesión {}: {}", session.getId(), e.getMessage());
            // Remover sesión problemática
            removeSessionFromMaps(session);
        }
    }

    private void broadcastToOthers(Long encounterId, WebSocketSession excludeSession, Object message) {
        Set<WebSocketSession> sessions = encounterSessions.get(encounterId);
        if (sessions != null) {
            String json = convertToJson(message);
            sessions.stream()
                    .filter(s -> !s.equals(excludeSession))
                    .forEach(s -> sendMessageToSession(s, json));
        }
    }

    private void removeSessionFromMaps(WebSocketSession session) {
        Long encounterId = sessionToEncounter.remove(session.getId());
        if (encounterId != null) {
            Set<WebSocketSession> sessions = encounterSessions.get(encounterId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    encounterSessions.remove(encounterId);
                }
            }
        }
    }

    private Long getEncounterIdFromSession(WebSocketSession session) {
        try {
            String path = session.getUri().getPath();
            // Extraer ID de /ws/encounters/{encounterId}
            String[] pathParts = path.split("/");
            if (pathParts.length >= 3) {
                return Long.parseLong(pathParts[pathParts.length - 1]);
            }
        } catch (NumberFormatException e) {
            logger.error("Error parseando encounterId de la URI: {}", session.getUri());
        }
        return null;
    }

    private String convertToJson(Object message) {
        try {
            return objectMapper.writeValueAsString(message);
        } catch (Exception e) {
            logger.error("Error convirtiendo mensaje a JSON: {}", e.getMessage());
            return "{\"error\":\"Failed to serialize message\"}";
        }
    }

    // ========================================
    // MÉTODOS PARA ESTADÍSTICAS
    // ========================================

    public int getConnectedClientsCount(Long encounterId) {
        Set<WebSocketSession> sessions = encounterSessions.get(encounterId);
        return sessions != null ? sessions.size() : 0;
    }

    public int getTotalConnectedClients() {
        return encounterSessions.values().stream()
                .mapToInt(Set::size)
                .sum();
    }

    public Set<Long> getActiveEncounters() {
        return encounterSessions.keySet();
    }
}