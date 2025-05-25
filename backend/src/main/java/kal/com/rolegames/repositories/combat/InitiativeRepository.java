package kal.com.rolegames.repositories.combat;

import kal.com.rolegames.models.combat.Initiative;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InitiativeRepository extends JpaRepository<Initiative, Long> {
}
