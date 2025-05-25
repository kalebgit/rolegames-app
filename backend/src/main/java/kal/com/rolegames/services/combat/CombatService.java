package kal.com.rolegames.services.combat;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.combat.CombatStateDTO;
import kal.com.rolegames.mappers.combat.CombatStateMapper;
import kal.com.rolegames.mappers.effects.EffectMapper;
import kal.com.rolegames.mappers.combat.InitiativeMapper;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.combat.CombatState;
import kal.com.rolegames.models.combat.Initiative;
import kal.com.rolegames.models.sessions.Encounter;
import kal.com.rolegames.models.util.EncounterType;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import kal.com.rolegames.repositories.combat.CombatStateRepository;
import kal.com.rolegames.repositories.sessions.EncounterRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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


    private static final Logger logger = LoggerFactory.getLogger(CombatService.class);

    public CombatStateDTO getCurrentCombat() {
        CombatState activeState = combatStateRepository.findByIsActiveTrue()
                .orElseThrow(() -> new NoSuchElementException("No active combat found"));

        return combatMapper.toDTO(activeState);
    }

    @Transactional
    public CombatState createCombatForEncounter(Long encounterId){
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));


        // terminar el ultimo combate activo
        combatStateRepository.findByIsActiveTrue().ifPresent(active -> {
            active.setIsActive(false);
            active.setEndTime(LocalDateTime.now());
            combatStateRepository.save(active);
        });

        //lo que hacia encoutner.startCombat
        if(!encounter.getEncounterType().equals(EncounterType.COMBAT) && encounter.getCombatState() != null){
            throw new IllegalArgumentException("El encuentro no es de tipo de combate o ya habia un combat para este encuentro");
        }

        CombatState newCombat = CombatState.builder()
                .encounter(encounter)
                .currentRound(1)
                .isActive(true)
                .startTime(LocalDateTime.now())
                .build();
        CombatState savedCombat = combatStateRepository.save(newCombat);

        logger.warn("❗❗️❗️❗️️ Se ha creado exitosamente el combatState: {}", savedCombat);
        encounter.setCombatState(savedCombat);
        encounterRepository.save(encounter);
        logger.warn("❗❗️❗️❗️️ Se le ha asignado el state al encuentro con id: {}", encounterId);

        return savedCombat;
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