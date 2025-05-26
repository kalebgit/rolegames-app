package kal.com.rolegames.mappers.notifications;

import kal.com.rolegames.dto.notifications.NotificationDTO;
import kal.com.rolegames.models.notifications.Notification;
import kal.com.rolegames.models.util.NotificationType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Mapper(componentModel = "spring")
@Component
public interface NotificationMapper {

    @Mapping(target = "recipientId", source = "recipient.userId")
    @Mapping(target = "recipientUsername", source = "recipient.username")
    @Mapping(target = "senderId", source = "sender.userId")
    @Mapping(target = "senderUsername", source = "sender.username")
    @Mapping(target = "isExpired", source = ".", qualifiedByName = "calculateIsExpired")
    @Mapping(target = "timeAgo", source = "createdAt", qualifiedByName = "calculateTimeAgo")
    @Mapping(target = "priority", source = "type", qualifiedByName = "calculatePriority")
    @Mapping(target = "icon", source = "type", qualifiedByName = "getIconForType")
    NotificationDTO toDTO(Notification notification);

    List<NotificationDTO> toNotificationListDto(List<Notification> notifications);

    @Named("calculateIsExpired")
    default Boolean calculateIsExpired(Notification notification) {
        return notification.isExpired();
    }

    @Named("calculateTimeAgo")
    default String calculateTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) return "";

        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(createdAt, now);
        long hours = ChronoUnit.HOURS.between(createdAt, now);
        long days = ChronoUnit.DAYS.between(createdAt, now);

        if (minutes < 1) {
            return "Ahora mismo";
        } else if (minutes < 60) {
            return "Hace " + minutes + " minuto" + (minutes == 1 ? "" : "s");
        } else if (hours < 24) {
            return "Hace " + hours + " hora" + (hours == 1 ? "" : "s");
        } else {
            return "Hace " + days + " día" + (days == 1 ? "" : "s");
        }
    }

    @Named("calculatePriority")
    default String calculatePriority(NotificationType type) {
        return switch (type) {
            case COMBAT_TURN, COMBAT_STARTED -> "high";
            case CAMPAIGN_INVITATION, SESSION_REMINDER -> "medium";
            case CHARACTER_LEVEL_UP, ITEM_OBTAINED -> "low";
            default -> "medium";
        };
    }

    @Named("getIconForType")
    default String getIconForType(NotificationType type) {
        return switch (type) {
            case CAMPAIGN_INVITATION -> "✉️";
            case SESSION_REMINDER -> "📅";
            case CHARACTER_LEVEL_UP -> "⬆️";
            case COMBAT_TURN -> "⚔️";
            case COMBAT_STARTED -> "🔥";
            case COMBAT_ENDED -> "🏁";
            case ITEM_OBTAINED -> "🎒";
            case GENERAL_ANNOUNCEMENT -> "📢";
            case ENCOUNTER_CREATED -> "🎭";
            case PLAYER_JOINED_CAMPAIGN -> "👥";
            case SESSION_SCHEDULED -> "🗓️";
            default -> "🔔";
        };
    }
}