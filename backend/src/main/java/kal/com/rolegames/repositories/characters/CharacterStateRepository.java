package kal.com.rolegames.repositories.characters;

import kal.com.rolegames.models.characters.CharacterState;
import kal.com.rolegames.models.util.StateType;
import kal.com.rolegames.repositories.RootRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterStateRepository extends JpaRepository<CharacterState, Long> {

    Optional<CharacterState> findByStateType(StateType stateType);
}
