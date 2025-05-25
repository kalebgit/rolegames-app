package kal.com.rolegames.repositories.sessions;

import kal.com.rolegames.models.sessions.Session;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByCampaign(Campaign campaign);
    List<Session> findByCampaignCampaignId(Long campaignId);

    List<Session> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT s FROM Session s JOIN s.attendingPlayers p WHERE p.playerId = :playerId")
    List<Session> findByAttendingPlayer(@Param("playerId") Long playerId);

    List<Session> findTop10ByCampaignOrderByDateDesc(Campaign campaign);

    List<Session> findByCampaignAndSessionNumberBetween(Campaign campaign, Integer startNumber, Integer endNumber);

    List<Session> findByDurationGreaterThan(Integer minutes);

    @Query("SELECT DISTINCT s FROM Session s WHERE s.encountersCompleted IS NOT EMPTY")
    List<Session> findSessionsWithEncounters();

    @Query("SELECT s FROM Session s WHERE s.campaign.dungeonMaster.dungeonMasterId = :dmId")
    List<Session> findByDungeonMaster(@Param("dmId") Long dmId);
}