package kal.com.rolegames.controllers.sessions;

import kal.com.rolegames.dto.sessions.CampaignDTO;
import kal.com.rolegames.dto.users.PlayerDTO;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.services.sessions.CampaignService;
import kal.com.rolegames.services.users.PlayerService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class CampaignController {

    private final CampaignService campaignService;
    private final PlayerService playerService;
    private final Logger logger = LoggerFactory.getLogger(CampaignController.class);

    @GetMapping
    public ResponseEntity<List<CampaignDTO>> getAllCampaigns(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(campaignService.getAllCampaigns(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignDTO> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @PostMapping
    public ResponseEntity<CampaignDTO> createCampaign(
            @RequestBody CampaignDTO campaignDTO,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(campaignService.createCampaign(campaignDTO, user.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignDTO> updateCampaign(
            @PathVariable Long id,
            @RequestBody CampaignDTO campaignDTO) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, campaignDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/players/{userId}")
    public ResponseEntity<CampaignDTO> addPlayerToCampaign(
            @PathVariable Long id,
            @PathVariable Long userId) {
        //mientras asi porque no hicimos un service de player
        PlayerDTO player= playerService.getPlayerByUserId(userId);
            logger.warn("❗️se esta agregando al jugador: "+ player);

        return ResponseEntity.ok(campaignService.addPlayerToCampaign(id, player.getPlayerId()));
    }

    @DeleteMapping("/{id}/players/{playerId}")
    public ResponseEntity<CampaignDTO> removePlayerFromCampaign(
            @PathVariable Long id,
            @PathVariable Long playerId) {
        return ResponseEntity.ok(campaignService.removePlayerFromCampaign(id, playerId));
    }

    @PostMapping("/{id}/npcs/{npcId}")
    public ResponseEntity<CampaignDTO> addImportantNPC(
            @PathVariable Long id,
            @PathVariable Long npcId) {
        return ResponseEntity.ok(campaignService.addImportantNPC(id, npcId));
    }
}