package kal.com.rolegames.websockets;

import com.fasterxml.jackson.databind.ObjectMapper;
import kal.com.rolegames.dto.notifications.NotificationDTO;
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
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(NotificationWebSocketHandler.class);

    private final ObjectMapper objectMapper;

    // userId -> Set de sesiones WebSocket
    private final Map<Long, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();
    // sessionId -> userId para tracking
    private final Map<String, Long> sessionToUser = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long userId = getUserIdFromSession(session);

        if (userId == null) {
            logger.error("No se pudo extraer userId de la sesión: {}", session.getUri());
            session.close(CloseStatus.BAD_DATA);
            return;
        }

        userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet())
                .add(session);
        sessionToUser.put(session.getId(), userId);

        logger.info("Cliente conectado para notificaciones - Usuario {}: {} (Total sesiones: {})",
                userId, session.getId(), userSessions.get(userId).size());

        // Enviar confirmación de conexión
        sendConnectionSuccessMessage(session, userId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long userId = sessionToUser.remove(session.getId());

        if (userId != null) {
            Set<WebSocketSession> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                    logger.info("Todas las sesiones desconectadas para usuario {}", userId);
                }
            }
        }

        logger.info("Cliente desconectado de notificaciones - Usuario {}: {} (Código: {})",
                userId, session.getId(), status.getCode());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String payload = message.getPayload();
            logger.debug("Mensaje recibido de {}: {}", session.getId(), payload);

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
    // MÉTODOS PÚBLICOS
    // ========================================

    public void sendNotificationToUser(Long userId, NotificationDTO notification) {
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (sessions != null && !sessions.isEmpty()) {
            Map<String, Object> message = Map.of(
                    "type", "NEW_NOTIFICATION",
                    "notification", notification,
                    "timestamp", System.currentTimeMillis()
            );

            String json = convertToJson(message);
            logger.debug("Enviando notificación a usuario {} en {} sesiones: {}",
                    userId, sessions.size(), notification.getTitle());

            // Crear copia para evitar ConcurrentModificationException
            Set<WebSocketSession> sessionsCopy = Set.copyOf(sessions);
            sessionsCopy.forEach(session -> sendMessageToSession(session, json));
        } else {
            logger.debug("Usuario {} no está conectado para recibir notificación: {}",
                    userId, notification.getTitle());
        }
    }

    public void sendUnreadCountUpdate(Long userId, long unreadCount) {
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (sessions != null && !sessions.isEmpty()) {
            Map<String, Object> message = Map.of(
                    "type", "UNREAD_COUNT_UPDATE",
                    "unreadCount", unreadCount,
                    "timestamp", System.currentTimeMillis()
            );

            String json = convertToJson(message);
            Set<WebSocketSession> sessionsCopy = Set.copyOf(sessions);
            sessionsCopy.forEach(session -> sendMessageToSession(session, json));
        }
    }

    public void broadcastToAllUsers(Map<String, Object> message) {
        String json = convertToJson(message);
        userSessions.values().forEach(sessions ->
                sessions.forEach(session -> sendMessageToSession(session, json))
        );
    }

    // ========================================
    // MÉTODOS PRIVADOS
    // ========================================

    private void handleClientMessage(WebSocketSession session, Map<String, Object> messageData) {
        try {
            String type = (String) messageData.get("type");
            Long userId = sessionToUser.get(session.getId());

            if (userId == null) {
                logger.warn("Sesión {} no tiene usuario asociado", session.getId());
                return;
            }

            logger.debug("Procesando mensaje tipo '{}' de usuario {} (sesión {})",
                    type, userId, session.getId());

            switch (type) {
                case "MARK_AS_READ":
                    handleMarkAsRead(session, messageData, userId);
                    break;
                case "MARK_ALL_READ":
                    handleMarkAllAsRead(session, messageData, userId);
                    break;
                case "DELETE_NOTIFICATION":
                    handleDeleteNotification(session, messageData, userId);
                    break;
                case "PING":
                    handlePing(session, userId);
                    break;
                default:
                    logger.warn("Tipo de mensaje no reconocido: {}", type);
            }

        } catch (Exception e) {
            logger.error("Error manejando mensaje del cliente: {}", e.getMessage());
        }
    }

    private void handleMarkAsRead(WebSocketSession session, Map<String, Object> messageData, Long userId) {
        try {
            Number notificationIdNum = (Number) messageData.get("notificationId");
            if (notificationIdNum != null) {
                Long notificationId = notificationIdNum.longValue();

                // Aquí normalmente llamarías al servicio para marcar como leída
                // notificationService.markAsRead(notificationId, userId);

                Map<String, Object> response = Map.of(
                        "type", "NOTIFICATION_MARKED_READ",
                        "notificationId", notificationId,
                        "timestamp", System.currentTimeMillis()
                );
                sendMessageToSession(session, convertToJson(response));
            }
        } catch (Exception e) {
            logger.error("Error marcando notificación como leída: {}", e.getMessage());
        }
    }

    private void handleMarkAllAsRead(WebSocketSession session, Map<String, Object> messageData, Long userId) {
        try {
            // notificationService.markAllAsRead(userId);

            Map<String, Object> response = Map.of(
                    "type", "ALL_NOTIFICATIONS_MARKED_READ",
                    "timestamp", System.currentTimeMillis()
            );
            sendMessageToSession(session, convertToJson(response));
        } catch (Exception e) {
            logger.error("Error marcando todas las notificaciones como leídas: {}", e.getMessage());
        }
    }

    private void handleDeleteNotification(WebSocketSession session, Map<String, Object> messageData, Long userId) {
        try {
            Number notificationIdNum = (Number) messageData.get("notificationId");
            if (notificationIdNum != null) {
                Long notificationId = notificationIdNum.longValue();

                // notificationService.deleteNotification(notificationId, userId);

                Map<String, Object> response = Map.of(
                        "type", "NOTIFICATION_DELETED",
                        "notificationId", notificationId,
                        "timestamp", System.currentTimeMillis()
                );
                sendMessageToSession(session, convertToJson(response));
            }
        } catch (Exception e) {
            logger.error("Error eliminando notificación: {}", e.getMessage());
        }
    }

    private void handlePing(WebSocketSession session, Long userId) {
        Map<String, Object> pong = Map.of(
                "type", "PONG",
                "userId", userId,
                "timestamp", System.currentTimeMillis()
        );
        sendMessageToSession(session, convertToJson(pong));
    }

    private void sendConnectionSuccessMessage(WebSocketSession session, Long userId) {
        try {
            Map<String, Object> connectionMessage = Map.of(
                    "type", "NOTIFICATIONS_CONNECTED",
                    "userId", userId,
                    "sessionId", session.getId(),
                    "timestamp", System.currentTimeMillis()
            );

            sendMessageToSession(session, convertToJson(connectionMessage));

            logger.debug("Mensaje de conexión de notificaciones enviado a usuario {} (sesión {})",
                    userId, session.getId());

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
                removeSessionFromMaps(session);
            }
        } catch (IOException e) {
            logger.error("Error enviando mensaje a sesión {}: {}", session.getId(), e.getMessage());
            removeSessionFromMaps(session);
        }
    }

    private void removeSessionFromMaps(WebSocketSession session) {
        Long userId = sessionToUser.remove(session.getId());
        if (userId != null) {
            Set<WebSocketSession> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                }
            }
        }
    }

    private Long getUserIdFromSession(WebSocketSession session) {
        try {
            String path = session.getUri().getPath();
            // Extraer ID de /ws/notifications/{userId}
            String[] pathParts = path.split("/");
            if (pathParts.length >= 3) {
                return Long.parseLong(pathParts[pathParts.length - 1]);
            }
        } catch (NumberFormatException e) {
            logger.error("Error parseando userId de la URI: {}", session.getUri());
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
    // ESTADÍSTICAS
    // ========================================

    public int getConnectedUsersCount() {
        return userSessions.size();
    }

    public int getTotalActiveSessions() {
        return userSessions.values().stream()
                .mapToInt(Set::size)
                .sum();
    }

    public boolean isUserConnected(Long userId) {
        Set<WebSocketSession> sessions = userSessions.get(userId);
        return sessions != null && !sessions.isEmpty();
    }
}
