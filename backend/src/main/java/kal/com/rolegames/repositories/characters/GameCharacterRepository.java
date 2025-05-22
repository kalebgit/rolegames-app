package kal.com.rolegames.repositories.characters;

import kal.com.rolegames.models.characters.GameCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameCharacterRepository extends JpaRepository<GameCharacter, Long> {
}
