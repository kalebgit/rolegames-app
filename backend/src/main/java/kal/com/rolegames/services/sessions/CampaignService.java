package kal.com.rolegames.services.sessions;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.sessions.CampaignDTO;
import kal.com.rolegames.mappers.sessions.CampaignMapper;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.repositories.characters.NonPlayerCharacterRepository;
import kal.com.rolegames.repositories.sessions.CampaignRepository;
import kal.com.rolegames.repositories.users.DungeonMasterRepository;
import kal.com.rolegames.repositories.users.PlayerRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class CampaignService {
    private final CampaignRepository campaignRepository;
    private final DungeonMasterRepository dmRepository;
    private final PlayerRepository playerRepository;
    private final NonPlayerCharacterRepository npcRepository;
    private final CampaignMapper campaignMapper;

    public List<CampaignDTO> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(campaignMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CampaignDTO getCampaignById(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));
        return campaignMapper.toDTO(campaign);
    }

    @Transactional
    public CampaignDTO createCampaign(CampaignDTO dto, Long dmId) {
        DungeonMaster dm = dmRepository.findByUserId(dmId)
                .orElseThrow(() -> new NoSuchElementException("Dungeon Master not found"));

        Campaign campaign = campaignMapper.toEntity(dto);
        campaign.setDungeonMaster(dm);

        Campaign savedCampaign = campaignRepository.save(campaign);
        return campaignMapper.toDTO(savedCampaign);
    }

    @Transactional
    public CampaignDTO updateCampaign(Long campaignId, CampaignDTO dto) {
        Campaign existingCampaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        campaignMapper.updateCampaignFromDto(dto, existingCampaign);
        Campaign updatedCampaign = campaignRepository.save(existingCampaign);
        return campaignMapper.toDTO(updatedCampaign);
    }

    @Transactional
    public void deleteCampaign(Long campaignId) {
        if (!campaignRepository.existsById(campaignId)) {
            throw new NoSuchElementException("Campaign not found");
        }
        campaignRepository.deleteById(campaignId);
    }

    @Transactional
    public CampaignDTO addPlayerToCampaign(Long campaignId, Long playerId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found"));

        campaign.addPlayer(player);
        Campaign updatedCampaign = campaignRepository.save(campaign);
        return campaignMapper.toDTO(updatedCampaign);
    }

    @Transactional
    public CampaignDTO removePlayerFromCampaign(Long campaignId, Long playerId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found"));

        campaign.removePlayer(player);
        Campaign updatedCampaign = campaignRepository.save(campaign);
        return campaignMapper.toDTO(updatedCampaign);
    }

    @Transactional
    public CampaignDTO addImportantNPC(Long campaignId, Long npcId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        NonPlayerCharacter npc = npcRepository.findById(npcId)
                .orElseThrow(() -> new NoSuchElementException("NPC not found"));

        campaign.addImportantNPC(npc);
        Campaign updatedCampaign = campaignRepository.save(campaign);
        return campaignMapper.toDTO(updatedCampaign);
    }
}