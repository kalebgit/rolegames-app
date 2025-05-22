package kal.com.rolegames.repositories.users;

import kal.com.rolegames.models.users.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByUserId(Long userId);

}
