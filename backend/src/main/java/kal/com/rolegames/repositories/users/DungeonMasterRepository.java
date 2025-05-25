package kal.com.rolegames.repositories.users;

import kal.com.rolegames.models.users.DungeonMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DungeonMasterRepository extends JpaRepository<DungeonMaster, Long> {
    @Query("SELECT dm FROM DungeonMaster dm WHERE dm.user.userId = :userId")
    Optional<DungeonMaster> findByUserId(@Param("userId") Long userId);}
