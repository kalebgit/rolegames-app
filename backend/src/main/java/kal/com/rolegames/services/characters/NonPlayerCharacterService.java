package kal.com.rolegames.services.characters;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.characters.NonPlayerCharacterDTO;
import kal.com.rolegames.mappers.characters.NonPlayerCharacterMapper;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.characters.NPCBehavior;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.util.NPCType;
import kal.com.rolegames.repositories.characters.NonPlayerCharacterRepository;
import kal.com.rolegames.repositories.users.DungeonMasterRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class NonPlayerCharacterService {
    private final NonPlayerCharacterRepository npcRepository;
    private final DungeonMasterRepository dmRepository;
    private final NonPlayerCharacterMapper mapper;

    public List<NonPlayerCharacterDTO> getAllNPCs() {
        return mapper.toNonPlayerCharacterListDto(new ArrayList<>(npcRepository.findAll()));
    }

    public List<NonPlayerCharacterDTO> getNPCsByCreator(Long creatorId) {
        DungeonMaster dm = dmRepository.findById(creatorId)
                .orElseThrow(() -> new NoSuchElementException("Dungeon Master not found"));
        return mapper.toNonPlayerCharacterListDto(new ArrayList<>(npcRepository.findByCreator(dm)));
    }

    public List<NonPlayerCharacterDTO> getNPCsByType(NPCType type) {
        return mapper.toNonPlayerCharacterListDto(new ArrayList<>(npcRepository.findByNpcType(type)));
    }

    public NonPlayerCharacterDTO getNPCById(Long id) {
        NonPlayerCharacter npc = npcRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("NPC not found"));
        return mapper.toDTO(npc);
    }

    @Transactional
    public NonPlayerCharacterDTO createNPC(NonPlayerCharacterDTO dto, Long creatorId) {
        DungeonMaster creator = dmRepository.findById(creatorId)
                .orElseThrow(() -> new NoSuchElementException("Dungeon Master not found"));

        NonPlayerCharacter npc = mapper.toEntity(dto);
        npc.setCreator(creator);

        if (npc.getBehavior() == null) {
            NPCBehavior behavior = NPCBehavior.builder()
                    .personalityDescription("Default behavior")
                    .aggressiveness(5)
                    .friendliness(5)
                    .honesty(5)
                    .build();
            npc.setBehavior(behavior);
            behavior.setNpc(npc);
        }

        NonPlayerCharacter savedNPC = npcRepository.save(npc);
        return mapper.toDTO(savedNPC);
    }

    @Transactional
    public NonPlayerCharacterDTO updateNPC(Long npcId, NonPlayerCharacterDTO dto) {
        NonPlayerCharacter existingNPC = npcRepository.findById(npcId)
                .orElseThrow(() -> new NoSuchElementException("NPC not found"));

        mapper.updateNonPlayerCharacterFromDto(dto, existingNPC);
        NonPlayerCharacter updatedNPC = npcRepository.save(existingNPC);
        return mapper.toDTO(updatedNPC);
    }

    @Transactional
    public void deleteNPC(Long npcId) {
        if (!npcRepository.existsById(npcId)) {
            throw new NoSuchElementException("NPC not found");
        }
        npcRepository.deleteById(npcId);
    }
}