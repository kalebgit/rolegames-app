package kal.com.rolegames.websockets;

import kal.com.rolegames.dto.notifications.NotificationDTO;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class NotificationWebSocketService {

    private final NotificationWebSocketHandler webSocketHandler;

    public void sendNotificationToUser(Long userId, NotificationDTO notification) {
        webSocketHandler.sendNotificationToUser(userId, notification);
    }

    public void sendUnreadCountUpdate(Long userId, long unreadCount) {
        webSocketHandler.sendUnreadCountUpdate(userId, unreadCount);
    }

    public void broadcastSystemNotification(String title, String message) {
        Map<String, Object> systemMessage = Map.of(
                "type", "SYSTEM_NOTIFICATION",
                "title", title,
                "message", message,
                "timestamp", System.currentTimeMillis()
        );

        webSocketHandler.broadcastToAllUsers(systemMessage);
    }

    public boolean isUserConnected(Long userId) {
        return webSocketHandler.isUserConnected(userId);
    }
}