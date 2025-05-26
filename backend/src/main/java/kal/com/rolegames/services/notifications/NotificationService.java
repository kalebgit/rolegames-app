package kal.com.rolegames.services.notifications;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.notifications.NotificationDTO;
import kal.com.rolegames.mappers.notifications.NotificationMapper;
import kal.com.rolegames.models.notifications.Notification;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.NotificationType;
import kal.com.rolegames.repositories.notifications.NotificationRepository;
import kal.com.rolegames.websockets.NotificationWebSocketService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final NotificationWebSocketService webSocketService;
    private final ObjectMapper objectMapper;

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    // ========================================
    // CRUD BÁSICO
    // ========================================

    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationMapper.toNotificationListDto(
                notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId)
        );
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationMapper.toNotificationListDto(
                notificationRepository.findByRecipientUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
        );
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationDTO markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));

        if (!notification.getRecipient().getUserId().equals(userId)) {
            throw new IllegalArgumentException("User cannot access this notification");
        }

        notification.markAsRead();
        Notification updated = notificationRepository.save(notification);

        return notificationMapper.toDTO(updated);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository
                .findByRecipientUserIdAndIsReadFalse(userId);

        unreadNotifications.forEach(Notification::markAsRead);
        notificationRepository.saveAll(unreadNotifications);

        logger.info("Marked {} notifications as read for user {}", unreadNotifications.size(), userId);
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));

        if (!notification.getRecipient().getUserId().equals(userId)) {
            throw new IllegalArgumentException("User cannot delete this notification");
        }

        notificationRepository.delete(notification);
    }

    // ========================================
    // CREACIÓN DE NOTIFICACIONES ESPECÍFICAS
    // ========================================

    @Transactional
    public NotificationDTO sendCampaignInvitation(User sender, User recipient, Campaign campaign) {
        try {
            Map<String, Object> actionData = Map.of(
                    "campaignId", campaign.getCampaignId(),
                    "campaignName", campaign.getName(),
                    "senderId", sender.getUserId(),
                    "senderName", sender.getUsername()
            );

            Notification notification = Notification.builder()
                    .recipient(recipient)
                    .sender(sender)
                    .type(NotificationType.CAMPAIGN_INVITATION)
                    .title("Invitación a Campaña")
                    .message(String.format("%s te ha invitado a unirte a la campaña '%s'",
                            sender.getUsername(), campaign.getName()))
                    .actionUrl("/campaigns/" + campaign.getCampaignId())
                    .actionData(objectMapper.writeValueAsString(actionData))
                    .expiresAt(LocalDateTime.now().plusDays(7)) // Expira en 7 días
                    .build();

            Notification saved = notificationRepository.save(notification);
            NotificationDTO dto = notificationMapper.toDTO(saved);

            // Enviar por WebSocket
            webSocketService.sendNotificationToUser(recipient.getUserId(), dto);

            logger.info("Campaign invitation sent from {} to {} for campaign {}",
                    sender.getUsername(), recipient.getUsername(), campaign.getName());

            return dto;
        } catch (Exception e) {
            logger.error("Error sending campaign invitation: {}", e.getMessage());
            throw new RuntimeException("Failed to send campaign invitation", e);
        }
    }

    @Transactional
    public NotificationDTO sendSessionReminder(User recipient, String sessionInfo, String actionUrl) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(NotificationType.SESSION_REMINDER)
                .title("Recordatorio de Sesión")
                .message(sessionInfo)
                .actionUrl(actionUrl)
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDTO dto = notificationMapper.toDTO(saved);

        webSocketService.sendNotificationToUser(recipient.getUserId(), dto);
        return dto;
    }

    @Transactional
    public NotificationDTO sendCharacterLevelUp(User recipient, String characterName, int newLevel) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(NotificationType.CHARACTER_LEVEL_UP)
                .title("¡Personaje Subió de Nivel!")
                .message(String.format("Tu personaje '%s' ha alcanzado el nivel %d",
                        characterName, newLevel))
                .actionUrl("/characters")
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDTO dto = notificationMapper.toDTO(saved);

        webSocketService.sendNotificationToUser(recipient.getUserId(), dto);
        return dto;
    }

    @Transactional
    public NotificationDTO sendCombatTurnNotification(User recipient, String encounterName) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(NotificationType.COMBAT_TURN)
                .title("¡Es tu turno!")
                .message(String.format("Es tu turno en el combate: %s", encounterName))
                .actionUrl("/combat")
                .expiresAt(LocalDateTime.now().plusMinutes(30)) // Expira en 30 minutos
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDTO dto = notificationMapper.toDTO(saved);

        webSocketService.sendNotificationToUser(recipient.getUserId(), dto);
        return dto;
    }

    @Transactional
    public void sendBulkNotification(List<User> recipients, NotificationType type,
                                     String title, String message, String actionUrl) {
        List<Notification> notifications = recipients.stream()
                .map(user -> Notification.builder()
                        .recipient(user)
                        .type(type)
                        .title(title)
                        .message(message)
                        .actionUrl(actionUrl)
                        .build())
                .toList();

        List<Notification> saved = notificationRepository.saveAll(notifications);

        // Enviar por WebSocket a cada usuario
        saved.forEach(notification -> {
            NotificationDTO dto = notificationMapper.toDTO(notification);
            webSocketService.sendNotificationToUser(
                    notification.getRecipient().getUserId(), dto);
        });

        logger.info("Bulk notification sent to {} users: {}", recipients.size(), title);
    }

    // ========================================
    // LIMPIEZA AUTOMÁTICA
    // ========================================

    @Transactional
    public void cleanupExpiredNotifications() {
        List<Notification> expired = notificationRepository.findExpiredNotifications();
        notificationRepository.deleteAll(expired);

        logger.info("Cleaned up {} expired notifications", expired.size());
    }

    @Transactional
    public void cleanupOldReadNotifications(int daysOld) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(daysOld);
        List<Notification> oldRead = notificationRepository
                .findByIsReadTrueAndCreatedAtBefore(cutoff);

        notificationRepository.deleteAll(oldRead);

        logger.info("Cleaned up {} old read notifications", oldRead.size());
    }
}