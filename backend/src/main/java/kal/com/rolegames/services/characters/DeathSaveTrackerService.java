package kal.com.rolegames.services.characters;

import jakarta.transaction.Transactional;
import kal.com.rolegames.models.characters.CharacterState;
import kal.com.rolegames.models.characters.DeathSaveTracker;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.util.StateType;
import kal.com.rolegames.repositories.characters.CharacterStateRepository;
import kal.com.rolegames.repositories.characters.DeathSaveTrackerRepository;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;


@Service

//lombok
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class DeathSaveTrackerService {

    private final DeathSaveTrackerRepository deathSaveTrackerRepository;
    private final CharacterStateRepository characterStateRepository;
    private final GameCharacterRepository gameCharacterRepository;


    @Transactional
    public void addSuccess(Long deathSaveId) {
        DeathSaveTracker deathSave = deathSaveTrackerRepository.findById(deathSaveId).orElseThrow(NoSuchElementException::new);
        deathSave.setSuccesses(deathSave.getSuccesses() + 1);
        if(deathSave.getSuccesses() >= 3){
            Long characterId = deathSaveTrackerRepository.findCharacterValueById(deathSaveId).orElseThrow(NoSuchElementException::new);
            CharacterState stableState  = characterStateRepository.findByStateType(StateType.NORMAL)
                .orElseGet(
                        ()->{
                            CharacterState newState = CharacterState.builder()
                                    .name("Stable")
                                    .stateType(StateType.NORMAL)
                                    .description("Character is stable and no longer making death saves")
                                    .build();
                            return characterStateRepository.save(newState);
                        }
                );
            GameCharacter gameCharacter = gameCharacterRepository.findById(characterId).orElseThrow(NoSuchElementException::new);
            gameCharacter.setCurrentState(stableState);
        }
    }

    public void addFailure(Long deathSaveId) {
        DeathSaveTracker deathSave = deathSaveTrackerRepository.findById(deathSaveId).orElseThrow(NoSuchElementException::new);
        if(deathSave.getFailures() >= 3){
            Long characterId = deathSaveTrackerRepository.findCharacterValueById(deathSaveId).orElseThrow(NoSuchElementException::new);
            CharacterState deadState = characterStateRepository.findByStateType(StateType.DEAD)
                    .orElseGet(
                            ()->{
                                CharacterState newState = CharacterState.builder()
                                        .name("Dead")
                                        .stateType(StateType.DEAD)
                                        .description("Character has died")
                                        .build();
                                return characterStateRepository.save(newState);
                            }
                    );
            GameCharacter gameCharacter = gameCharacterRepository.findById(characterId).orElseThrow(NoSuchElementException::new);
            gameCharacter.setCurrentState(deadState);
        }
    }
}
