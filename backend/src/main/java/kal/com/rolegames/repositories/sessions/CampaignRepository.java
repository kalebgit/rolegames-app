package kal.com.rolegames.repositories.sessions;

import kal.com.rolegames.dto.sessions.CampaignDTO;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findByPlayersContains(Player player);
}
