package kal.com.rolegames.repositories.sessions;

import kal.com.rolegames.models.sessions.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
}
