package kal.com.rolegames.repositories.characters;

import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.users.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlayerCharacterRepository extends JpaRepository<PlayerCharacter, Long> {
    List<PlayerCharacter> findByPlayer(Player player);
    @Query("SELECT pc FROM PlayerCharacter pc WHERE pc.player.user.userId = :userId")
    List<PlayerCharacter> findByPlayerUserId(@Param("userId") Long userId);
}