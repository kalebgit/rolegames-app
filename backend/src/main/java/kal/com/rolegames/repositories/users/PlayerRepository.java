package kal.com.rolegames.repositories.users;

import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    Optional<Player> findByUserId(Long userId);
    Optional<Player> findByUser(User user);

}
