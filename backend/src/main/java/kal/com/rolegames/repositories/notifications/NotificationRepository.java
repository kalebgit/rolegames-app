package kal.com.rolegames.repositories.notifications;

import kal.com.rolegames.models.notifications.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long recipientId);

    List<Notification> findByRecipientUserIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);

    List<Notification> findByRecipientUserIdAndIsReadFalse(Long recipientId);

    long countByRecipientUserIdAndIsReadFalse(Long recipientId);

    List<Notification> findByIsReadTrueAndCreatedAtBefore(LocalDateTime cutoffDate);

    @Query("SELECT n FROM Notification n WHERE n.expiresAt IS NOT NULL AND n.expiresAt < CURRENT_TIMESTAMP")
    List<Notification> findExpiredNotifications();

    @Query("SELECT n FROM Notification n WHERE n.recipient.userId = :recipientId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByRecipientAndType(@Param("recipientId") Long recipientId,
                                              @Param("type") kal.com.rolegames.models.util.NotificationType type);
}