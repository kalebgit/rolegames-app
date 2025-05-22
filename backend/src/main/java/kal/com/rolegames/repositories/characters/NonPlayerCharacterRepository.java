package kal.com.rolegames.repositories.characters;

import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.NPCType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NonPlayerCharacterRepository extends JpaRepository<NonPlayerCharacter, Long> {
    List<NonPlayerCharacter> findByCreator(User creator);
    List<NonPlayerCharacter> findByNpcType(NPCType npcType);
}