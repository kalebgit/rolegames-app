package kal.com.rolegames.dto.notifications;

import kal.com.rolegames.models.util.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private Long notificationId;
    private Long recipientId;
    private String recipientUsername;
    private Long senderId;
    private String senderUsername;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private String actionUrl;
    private String actionData;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Boolean isExpired;

    // estos los pusimos para el front
    private String timeAgo; // "Hace 5 minutos"
    private String priority; // "high", "medium", "low"
    private String icon; // Emoji o clase de icono
}