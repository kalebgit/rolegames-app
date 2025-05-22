package kal.com.rolegames.repositories.sessions;

import kal.com.rolegames.models.sessions.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
