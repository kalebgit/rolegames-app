package kal.com.rolegames.repositories.characters;

import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.users.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerCharacterRepository extends JpaRepository<PlayerCharacter, Long> {
    List<PlayerCharacter> findByPlayer(Player player);
    List<PlayerCharacter> findByPlayerUserId(Long userId);
}