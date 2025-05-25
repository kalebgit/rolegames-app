package kal.com.rolegames.services.sessions;

import kal.com.rolegames.dto.sessions.*;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.sessions.Encounter;
import kal.com.rolegames.models.sessions.Session;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.util.EncounterType;
import kal.com.rolegames.models.util.RewardType;
import kal.com.rolegames.repositories.sessions.CampaignRepository;
import kal.com.rolegames.repositories.sessions.EncounterRepository;
import kal.com.rolegames.repositories.sessions.SessionRepository;
import kal.com.rolegames.repositories.users.PlayerRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class SessionStatsService {

    private final SessionRepository sessionRepository;
    private final EncounterRepository encounterRepository;
    private final CampaignRepository campaignRepository;
    private final PlayerRepository playerRepository;

    private static final Logger logger = LoggerFactory.getLogger(SessionStatsService.class);

    public List<SessionSummaryDTO> getSessionSummariesByCampaign(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        return campaign.getSessions().stream()
                .map(this::mapToSessionSummary)
                .collect(Collectors.toList());
    }

    public List<EncounterSummaryDTO> getEncounterSummariesBySession(Long sessionId) {
        List<Encounter> encounters = encounterRepository.findBySessionSessionId(sessionId);

        return encounters.stream()
                .map(this::mapToEncounterSummary)
                .collect(Collectors.toList());
    }

    public CampaignStatsDTO getCampaignStats(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        CampaignStatsDTO stats = new CampaignStatsDTO();
        stats.setCampaignId(campaign.getCampaignId());
        stats.setCampaignName(campaign.getName());
        stats.setDungeonMasterName(campaign.getDungeonMaster().getUsername());
        stats.setStartDate(campaign.getStartDate());
        stats.setIsActive(campaign.getIsActive());

        // Calculate session stats
        List<Session> sessions = campaign.getSessions().stream().toList();
        stats.setTotalSessions(sessions.size());

        if (!sessions.isEmpty()) {
            stats.setAverageSessionDuration(
                    sessions.stream()
                            .filter(s -> s.getDuration() != null)
                            .mapToInt(Session::getDuration)
                            .average()
                            .orElse(0.0)
            );
        }

        List<Encounter> allEncounters = sessions.stream()
                .flatMap(s -> s.getEncountersCompleted().stream())
                .collect(Collectors.toList());

        stats.setTotalEncounters(allEncounters.size());
        stats.setCompletedEncounters((int) allEncounters.stream().filter(Encounter::getIsCompleted).count());
        stats.setPendingEncounters(stats.getTotalEncounters() - stats.getCompletedEncounters());

        stats.setTotalCombatEncounters((int) allEncounters.stream()
                .filter(e -> e.getEncounterType() == EncounterType.COMBAT).count());
        stats.setTotalSocialEncounters((int) allEncounters.stream()
                .filter(e -> e.getEncounterType() == EncounterType.SOCIAL).count());
        stats.setTotalPuzzleEncounters((int) allEncounters.stream()
                .filter(e -> e.getEncounterType() == EncounterType.PUZZLE).count());

        stats.setTotalExperienceAwarded(
                allEncounters.stream()
                        .flatMap(e -> e.getRewards().stream())
                        .filter(r -> r.getRewardType() == RewardType.EXPERIENCE && r.getClaimed())
                        .mapToInt(r -> r.getExperienceAmount() != null ? r.getExperienceAmount() : 0)
                        .sum()
        );

        stats.setTotalGoldAwarded(
                allEncounters.stream()
                        .flatMap(e -> e.getRewards().stream())
                        .filter(r -> r.getRewardType() == RewardType.GOLD && r.getClaimed())
                        .mapToInt(r -> r.getGoldAmount() != null ? r.getGoldAmount() : 0)
                        .sum()
        );

        stats.setActivePlayerCount(campaign.getPlayers().size());
        stats.setTotalPlayersParticipated(
                sessions.stream()
                        .flatMap(s -> s.getAttendingPlayers().stream())
                        .collect(Collectors.toSet())
                        .size()
        );

        return stats;
    }

    public SessionStatsDTO getSessionStats(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        SessionStatsDTO stats = new SessionStatsDTO();
        stats.setSessionId(session.getSessionId());
        stats.setSessionNumber(session.getSessionNumber());
        stats.setCampaignName(session.getCampaign().getName());
        stats.setDate(session.getDate());
        stats.setDuration(session.getDuration());
        stats.setAttendingPlayerCount(session.getAttendingPlayers().size());
        stats.setAttendingCharacterCount(session.getAttendingCharacters().size());

        List<Encounter> encounters = session.getEncountersCompleted().stream().toList();
        stats.setTotalEncounters(encounters.size());
        stats.setCompletedEncounters((int) encounters.stream().filter(Encounter::getIsCompleted).count());

        stats.setCombatEncounters((int) encounters.stream()
                .filter(e -> e.getEncounterType() == EncounterType.COMBAT).count());
        stats.setSocialEncounters((int) encounters.stream()
                .filter(e -> e.getEncounterType() == EncounterType.SOCIAL).count());
        stats.setPuzzleEncounters((int) encounters.stream()
                .filter(e -> e.getEncounterType() == EncounterType.PUZZLE).count());

        stats.setTotalExperienceAwarded(
                encounters.stream()
                        .flatMap(e -> e.getRewards().stream())
                        .filter(r -> r.getRewardType() == RewardType.EXPERIENCE)
                        .mapToInt(r -> r.getExperienceAmount() != null ? r.getExperienceAmount() : 0)
                        .sum()
        );

        stats.setTotalGoldAwarded(
                encounters.stream()
                        .flatMap(e -> e.getRewards().stream())
                        .filter(r -> r.getRewardType() == RewardType.GOLD)
                        .mapToInt(r -> r.getGoldAmount() != null ? r.getGoldAmount() : 0)
                        .sum()
        );

        stats.setTotalItemsAwarded((int) encounters.stream()
                .flatMap(e -> e.getRewards().stream())
                .filter(r -> r.getRewardType() == RewardType.ITEM)
                .count());

        stats.setAverageEncounterDifficulty(
                encounters.stream()
                        .filter(e -> e.getDifficulty() != null)
                        .mapToDouble(e -> e.getDifficulty().ordinal())
                        .average()
                        .orElse(0.0)
        );

        return stats;
    }

    public PlayerSessionStatsDTO getPlayerSessionStats(Long playerId, Long campaignId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found"));

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        List<Session> playerSessions = campaign.getSessions().stream()
                .filter(s -> s.getAttendingPlayers().contains(player))
                .collect(Collectors.toList());

        PlayerSessionStatsDTO stats = new PlayerSessionStatsDTO();
        stats.setPlayerId(player.getPlayerId());
        stats.setPlayerName(player.getUsername());
        stats.setSessionsAttended(playerSessions.size());

        if (!playerSessions.isEmpty()) {
            int totalEncounters = playerSessions.stream()
                    .mapToInt(s -> s.getEncountersCompleted().size())
                    .sum();
            stats.setEncountersParticipated(totalEncounters);

            int combatEncounters = playerSessions.stream()
                    .flatMap(s -> s.getEncountersCompleted().stream())
                    .mapToInt(e -> e.getEncounterType() == EncounterType.COMBAT ? 1 : 0)
                    .sum();
            stats.setCombatEncountersParticipated(combatEncounters);

            List<LocalDateTime> sessionDates = playerSessions.stream()
                    .map(Session::getDate)
                    .filter(Objects::nonNull)
                    .sorted()
                    .collect(Collectors.toList());

            if (!sessionDates.isEmpty()) {
                stats.setFirstSessionDate(sessionDates.get(0));
                stats.setLastSessionDate(sessionDates.get(sessionDates.size() - 1));
            }

            stats.setAverageSessionDuration(
                    playerSessions.stream()
                            .filter(s -> s.getDuration() != null)
                            .mapToInt(Session::getDuration)
                            .average()
                            .orElse(0.0)
            );
        }

        return stats;
    }

    private SessionSummaryDTO mapToSessionSummary(Session session) {
        SessionSummaryDTO summary = new SessionSummaryDTO();
        summary.setSessionId(session.getSessionId());
        summary.setCampaignName(session.getCampaign().getName());
        summary.setSessionNumber(session.getSessionNumber());
        summary.setDate(session.getDate());
        summary.setDuration(session.getDuration());
        summary.setPlayerCount(session.getAttendingPlayers().size());
        summary.setCharacterCount(session.getAttendingCharacters().size());
        summary.setEncounterCount(session.getEncountersCompleted().size());
        summary.setHasEncounters(!session.getEncountersCompleted().isEmpty());

        if (session.getDate() != null && session.getDate().isAfter(LocalDateTime.now())) {
            summary.setStatus("PLANNED");
        } else if (session.getEncountersCompleted().stream().allMatch(Encounter::getIsCompleted)) {
            summary.setStatus("COMPLETED");
        } else {
            summary.setStatus("IN_PROGRESS");
        }

        return summary;
    }

    private EncounterSummaryDTO mapToEncounterSummary(Encounter encounter) {
        EncounterSummaryDTO summary = new EncounterSummaryDTO();
        summary.setEncounterId(encounter.getEncounterId());
        summary.setName(encounter.getName());
        summary.setEncounterType(encounter.getEncounterType());
        summary.setDifficulty(encounter.getDifficulty());
        summary.setIsCompleted(encounter.getIsCompleted());
        summary.setHasCombatState(encounter.getCombatState() != null);
        summary.setIsCombatActive(encounter.getCombatState() != null && encounter.getCombatState().getIsActive());
        summary.setParticipantCount(encounter.getParticipants().size());
        summary.setRewardCount(encounter.getRewards().size());

        summary.setTotalExperienceReward(
                encounter.getRewards().stream()
                        .filter(r -> r.getRewardType() == RewardType.EXPERIENCE)
                        .mapToInt(r -> r.getExperienceAmount() != null ? r.getExperienceAmount() : 0)
                        .sum()
        );

        summary.setTotalGoldReward(
                encounter.getRewards().stream()
                        .filter(r -> r.getRewardType() == RewardType.GOLD)
                        .mapToInt(r -> r.getGoldAmount() != null ? r.getGoldAmount() : 0)
                        .sum()
        );

        if (encounter.getSession() != null) {
            summary.setSessionName(encounter.getSession().getCampaign().getName() + " - Session " + encounter.getSession().getSessionNumber());
            summary.setSessionNumber(encounter.getSession().getSessionNumber());
        }

        return summary;
    }
}