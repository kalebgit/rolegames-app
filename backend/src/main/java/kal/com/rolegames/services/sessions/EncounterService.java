package kal.com.rolegames.services.sessions;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.items.RewardDTO;
import kal.com.rolegames.dto.sessions.EncounterDTO;
import kal.com.rolegames.mappers.items.RewardMapper;
import kal.com.rolegames.mappers.sessions.EncounterMapper;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.items.Reward;
import kal.com.rolegames.models.sessions.Encounter;
import kal.com.rolegames.models.sessions.Session;
import kal.com.rolegames.models.util.RewardType;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import kal.com.rolegames.repositories.items.ItemRepository;
import kal.com.rolegames.repositories.sessions.EncounterRepository;
import kal.com.rolegames.repositories.sessions.SessionRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class EncounterService {

    private final EncounterRepository encounterRepository;
    private final SessionRepository sessionRepository;
    private final GameCharacterRepository characterRepository;
    private final ItemRepository itemRepository;

    private final EncounterMapper encounterMapper;
    private final RewardMapper rewardMapper;

    public List<EncounterDTO> getAllEncounters() {
        return encounterMapper.toEncounterListDto(new ArrayList<>(encounterRepository.findAll()));
    }

    public List<EncounterDTO> getEncountersBySession(Long sessionId) {
        return encounterMapper.toEncounterListDto(new ArrayList<>(encounterRepository.findBySessionSessionId(sessionId)));
    }

    public EncounterDTO getEncounterById(Long id) {
        Encounter encounter = encounterRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));
        return mapToDetailedDTO(encounter);
    }

    @Transactional
    public EncounterDTO createEncounter(EncounterDTO dto, Long sessionId) {
        Session session = null;
        if (sessionId != null) {
            session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new NoSuchElementException("Session not found"));
        }

        Encounter encounter = encounterMapper.toEntity(dto);
        if (session != null) {
            encounter.setSession(session);
        }

        Encounter savedEncounter = encounterRepository.save(encounter);
        return mapToDetailedDTO(savedEncounter);
    }

    @Transactional
    public EncounterDTO updateEncounter(Long encounterId, EncounterDTO dto) {
        Encounter existingEncounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        encounterMapper.updateEncounterFromDto(dto, existingEncounter);
        Encounter updatedEncounter = encounterRepository.save(existingEncounter);
        return mapToDetailedDTO(updatedEncounter);
    }

    @Transactional
    public void deleteEncounter(Long encounterId) {
        if (!encounterRepository.existsById(encounterId)) {
            throw new NoSuchElementException("Encounter not found");
        }
        encounterRepository.deleteById(encounterId);
    }

    @Transactional
    public EncounterDTO completeEncounter(Long encounterId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        encounter.setIsCompleted(true);
        if (encounter.getCombatState() != null && encounter.getCombatState().getIsActive()) {
            encounter.endCombat();
        }

        Encounter updatedEncounter = encounterRepository.save(encounter);
        return mapToDetailedDTO(updatedEncounter);
    }

    @Transactional
    public EncounterDTO addParticipant(Long encounterId, Long characterId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        GameCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new NoSuchElementException("Character not found"));

        encounter.addParticipant(character);
        Encounter updatedEncounter = encounterRepository.save(encounter);
        return mapToDetailedDTO(updatedEncounter);
    }

    @Transactional
    public EncounterDTO addReward(Long encounterId, RewardDTO rewardDTO) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        Reward reward = rewardMapper.toEntity(rewardDTO);

        if (rewardDTO.getRewardType() == RewardType.ITEM && rewardDTO.getItemId() != null) {
            Item item = itemRepository.findById(rewardDTO.getItemId())
                    .orElseThrow(() -> new NoSuchElementException("Item not found"));
            reward.setItemReward(item);
        }

        encounter.addReward(reward);
        Encounter updatedEncounter = encounterRepository.save(encounter);
        return mapToDetailedDTO(updatedEncounter);
    }

    private EncounterDTO mapToDetailedDTO(Encounter encounter) {
        EncounterDTO dto = encounterMapper.toDTO(encounter);

        // Map participant IDs
        dto.setParticipantIds(encounter.getParticipants().stream()
                .map(GameCharacter::getCharacterId)
                .collect(Collectors.toSet()));

        return dto;
    }
}