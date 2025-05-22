package kal.com.rolegames.repositories.sessions;

import kal.com.rolegames.models.sessions.Encounter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncounterRepository extends JpaRepository<Encounter, Long> {
    List<Encounter> findBySessionSessionId(Long sessionId);
    List<Encounter> findByIsCompleted(Boolean isCompleted);
}