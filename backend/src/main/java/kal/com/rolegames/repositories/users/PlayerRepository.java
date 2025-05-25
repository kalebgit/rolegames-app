package kal.com.rolegames.repositories.users;

import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    @Query("SELECT p FROM Player p WHERE p.user.userId = :userId")
    Optional<Player> findByUserId(@Param("userId") Long userId);




}
