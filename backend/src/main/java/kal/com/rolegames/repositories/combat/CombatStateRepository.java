package kal.com.rolegames.repositories.combat;

import kal.com.rolegames.models.combat.CombatState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CombatStateRepository extends JpaRepository<CombatState, Long> {
    Optional<CombatState> findByIsActiveTrue();
}