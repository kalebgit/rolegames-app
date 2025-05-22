package kal.com.rolegames.services.combat;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.combat.CombatStateDTO;
import kal.com.rolegames.mappers.combat.CombatStateMapper;
import kal.com.rolegames.mappers.effects.EffectMapper;
import kal.com.rolegames.mappers.combat.InitiativeMapper;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.combat.CombatState;
import kal.com.rolegames.models.sessions.Encounter;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import kal.com.rolegames.repositories.combat.CombatStateRepository;
import kal.com.rolegames.repositories.sessions.EncounterRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class CombatService {

    private final CombatStateRepository combatStateRepository;
    private final EncounterRepository encounterRepository;
    private final GameCharacterRepository characterRepository;

    //mappers
    private InitiativeMapper initiativeMapper;
    private EffectMapper effectMapper;
    private CombatStateMapper combatMapper;


    public CombatStateDTO getCurrentCombat() {
        CombatState activeState = combatStateRepository.findByIsActiveTrue()
                .orElseThrow(() -> new NoSuchElementException("No active combat found"));

        return combatMapper.toDTO(activeState);
    }

    @Transactional
    public CombatStateDTO startCombatForEncounter(Long encounterId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        combatStateRepository.findByIsActiveTrue().ifPresent(active -> {
            active.setIsActive(false);
            active.setEndTime(LocalDateTime.now());
            combatStateRepository.save(active);
        });

        encounter.startCombat();
        Encounter savedEncounter = encounterRepository.save(encounter);

        return combatMapper.toDTO(savedEncounter.getCombatState());
    }

    @Transactional
    public CombatStateDTO nextTurn() {
        CombatState activeState = combatStateRepository.findByIsActiveTrue()
                .orElseThrow(() -> new NoSuchElementException("No active combat found"));

        activeState.nextTurn();
        CombatState updatedState = combatStateRepository.save(activeState);

        return combatMapper.toDTO(updatedState);
    }

    @Transactional
    public void endCombat() {
        CombatState activeState = combatStateRepository.findByIsActiveTrue()
                .orElseThrow(() -> new NoSuchElementException("No active combat found"));

        activeState.endCombat();
        combatStateRepository.save(activeState);

        Encounter encounter = activeState.getEncounter();
        encounter.endCombat();
        encounterRepository.save(encounter);
    }

    @Transactional
    public CombatStateDTO addParticipant(Long characterId, Integer initiativeRoll) {
        CombatState activeState = combatStateRepository.findByIsActiveTrue()
                .orElseThrow(() -> new NoSuchElementException("No active combat found"));

        GameCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new NoSuchElementException("Character not found"));

        activeState.addParticipant(character, initiativeRoll);
        CombatState updatedState = combatStateRepository.save(activeState);

        return combatMapper.toDTO(updatedState);
    }


}