package kal.com.rolegames.repositories.characters;

import kal.com.rolegames.models.characters.DeathSaveTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface DeathSaveTrackerRepository extends JpaRepository<DeathSaveTracker, Long> {


    @Query("SELECT d.successes FROM DeathSaveTracker d WHERE d.deathSaveId = :id")
    Optional<Integer> findSuccessesValueById(@Param("id") Long id);

    @Query("SELECT d.failures FROM DeathSaveTracker d WHERE d.deathSaveId = :id")
    Optional<Integer> findFailuresValueById(@Param("id") Long id);

    @Query("SELECT d.character FROM DeathSaveTracker d WHERE d.deathSaveId = :id")
    Optional<Long> findCharacterValueById(@Param("id") Long id);
}

