package kal.com.rolegames.controllers.sessions;

import kal.com.rolegames.dto.sessions.*;
import kal.com.rolegames.services.sessions.SessionStatsService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class SessionStatsController {

    private final SessionStatsService statsService;

    private static final Logger logger = LoggerFactory.getLogger(SessionStatsController.class);

    @GetMapping("/campaigns/{campaignId}/sessions")
    public ResponseEntity<List<SessionSummaryDTO>> getSessionSummariesByCampaign(@PathVariable Long campaignId) {
        logger.info("[STATS CONTROLLER] Getting session summaries for campaign: {}", campaignId);
        return ResponseEntity.ok(statsService.getSessionSummariesByCampaign(campaignId));
    }

    @GetMapping("/sessions/{sessionId}/encounters")
    public ResponseEntity<List<EncounterSummaryDTO>> getEncounterSummariesBySession(@PathVariable Long sessionId) {
        logger.info("[STATS CONTROLLER] Getting encounter summaries for session: {}", sessionId);
        return ResponseEntity.ok(statsService.getEncounterSummariesBySession(sessionId));
    }

    @GetMapping("/campaigns/{campaignId}")
    public ResponseEntity<CampaignStatsDTO> getCampaignStats(@PathVariable Long campaignId) {
        logger.info("[STATS CONTROLLER] Getting campaign stats for: {}", campaignId);
        return ResponseEntity.ok(statsService.getCampaignStats(campaignId));
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<SessionStatsDTO> getSessionStats(@PathVariable Long sessionId) {
        logger.info("[STATS CONTROLLER] Getting session stats for: {}", sessionId);
        return ResponseEntity.ok(statsService.getSessionStats(sessionId));
    }

    @GetMapping("/players/{playerId}/campaigns/{campaignId}")
    public ResponseEntity<PlayerSessionStatsDTO> getPlayerSessionStats(
            @PathVariable Long playerId,
            @PathVariable Long campaignId) {
        logger.info("[STATS CONTROLLER] Getting player session stats for player: {} in campaign: {}", playerId, campaignId);
        return ResponseEntity.ok(statsService.getPlayerSessionStats(playerId, campaignId));
    }
}