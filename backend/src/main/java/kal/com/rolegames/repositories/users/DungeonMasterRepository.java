package kal.com.rolegames.repositories.users;

import kal.com.rolegames.models.users.DungeonMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DungeonMasterRepository extends JpaRepository<DungeonMaster, Long> {
    Optional<DungeonMaster> findByUserId(Long userId);
}
