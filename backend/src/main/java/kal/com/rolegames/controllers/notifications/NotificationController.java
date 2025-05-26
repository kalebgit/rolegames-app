package kal.com.rolegames.controllers;

import kal.com.rolegames.dto.notifications.NotificationDTO;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.repositories.sessions.CampaignRepository;
import kal.com.rolegames.repositories.users.UserRepository;
import kal.com.rolegames.services.notifications.NotificationService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class NotificationController {

    private final NotificationService notificationService;
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    ///mala practica
    private UserRepository userRepository;
    private CampaignRepository campaignRepository;

    /**
     * Obtiene todas las notificaciones del usuario autenticado
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@AuthenticationPrincipal User user) {
        logger.info("Getting notifications for user: {}", user.getUserId());
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getUserId()));
    }

    /**
     * Obtiene solo las notificaciones no leídas
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(user.getUserId()));
    }

    /**
     * Obtiene el conteo de notificaciones no leídas
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@AuthenticationPrincipal User user) {
        long count = notificationService.getUnreadCount(user.getUserId());
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("hasUnread", count > 0);
        return ResponseEntity.ok(response);
    }

    /**
     * Marca una notificación como leída
     */
    @PostMapping("/{notificationId}/mark-read")
    public ResponseEntity<NotificationDTO> markAsRead(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal User user) {
        NotificationDTO notification = notificationService.markAsRead(notificationId, user.getUserId());
        return ResponseEntity.ok(notification);
    }

    /**
     * Marca todas las notificaciones como leídas
     */
    @PostMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getUserId());
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }

    /**
     * Elimina una notificación
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, Object>> deleteNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal User user) {
        notificationService.deleteNotification(notificationId, user.getUserId());
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Notification deleted");
        return ResponseEntity.ok(response);
    }

    /**
     * Envía una invitación a campaña
     */
    @PostMapping("/campaign-invitation")
    public ResponseEntity<NotificationDTO> sendCampaignInvitation(
            @RequestBody CampaignInvitationRequest request,
            @AuthenticationPrincipal User sender) {

        try {
            // Buscar el usuario destinatario por username
            User recipient = userRepository.findByUsername(request.getRecipientUsername())
                    .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + request.getRecipientUsername()));

            // Buscar la campaña
            Campaign campaign = campaignRepository.findById(request.getCampaignId())
                    .orElseThrow(() -> new NoSuchElementException("Campaña no encontrada"));

            // Verificar que el sender sea el DM de la campaña
            if (!campaign.getDungeonMaster().getUser().getUserId().equals(sender.getUserId())) {
                throw new IllegalArgumentException("Solo el DM puede enviar invitaciones a esta campaña");
            }

            // Verificar que el recipient no esté ya en la campaña
            if (campaign.getPlayers().stream().anyMatch(player ->
                    player.getUser().getUserId().equals(recipient.getUserId()))) {
                throw new IllegalArgumentException("El usuario ya es parte de esta campaña");
            }

            // Enviar la notificación
            NotificationDTO notification = notificationService.sendCampaignInvitation(sender, recipient, campaign);

            return ResponseEntity.ok(notification);

        } catch (NoSuchElementException e) {
            logger.error("Resource not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error sending campaign invitation: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    /**
     * Envía un recordatorio de sesión
     */
    @PostMapping("/session-reminder")
    public ResponseEntity<NotificationDTO> sendSessionReminder(
            @RequestBody SessionReminderRequest request,
            @AuthenticationPrincipal User sender) {

        try {
            // Implementar lógica para recordatorio de sesión
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Session reminder feature not fully implemented yet");
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            logger.error("Error sending session reminder: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Clases de request
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CampaignInvitationRequest {
        private String recipientUsername;
        private Long campaignId;
        private String personalMessage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SessionReminderRequest {
        private Long recipientId;
        private String sessionInfo;
        private String actionUrl;
    }
}