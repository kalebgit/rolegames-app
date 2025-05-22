package kal.com.rolegames.services.characters;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.characters.PlayerCharacterDTO;
import kal.com.rolegames.mappers.characters.PlayerCharacterMapper;
import kal.com.rolegames.models.characters.DeathSaveTracker;
import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.repositories.characters.DeathSaveTrackerRepository;
import kal.com.rolegames.repositories.characters.PlayerCharacterRepository;
import kal.com.rolegames.repositories.sessions.CampaignRepository;
import kal.com.rolegames.repositories.users.PlayerRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class PlayerCharacterService {
    private final PlayerCharacterRepository playerCharacterRepository;
    private final PlayerRepository playerRepository;
    private final CampaignRepository campaignRepository;
    private final DeathSaveTrackerRepository deathSaveTrackerRepository;
    //mapper
    private final PlayerCharacterMapper mapper;

    public List<PlayerCharacterDTO> getAllCharacters() {
        return mapper.toPlayerCharacterDtoList( playerCharacterRepository.findAll());
    }

    public List<PlayerCharacterDTO> getCharactersByPlayer(Long playerId) {
        return mapper.toPlayerCharacterDtoList( playerCharacterRepository.findByPlayerUserId(playerId));
    }

    public PlayerCharacterDTO getCharacterById(Long id) {
        return mapper.toDto( playerCharacterRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontro el personaje")));
    }

    @Transactional
    public PlayerCharacterDTO createCharacter(PlayerCharacterDTO dto, Long userId){
        Player player = playerRepository.findByUserId(userId).orElseThrow(()->
                new NoSuchElementException("No se encontro el jugador"));
        PlayerCharacter character = mapper.toEntity(dto);
        character.setPlayer(player);
        if(character.getDeathSaves() == null){
            DeathSaveTracker deathSaves = DeathSaveTracker.builder()
                    .successes(0)
                    .failures(0)
                    .build();

            character.setDeathSaves(deathSaves);
            deathSaves.setCharacter(character);
        }
        return mapper.toDto( playerCharacterRepository.save(character));
    }

    @Transactional
    public PlayerCharacterDTO updateCharacter(Long characterId, PlayerCharacterDTO updatedCharacter){
        PlayerCharacter original = playerCharacterRepository.findById(characterId)
                .orElseThrow(()->new NoSuchElementException(" no existe este personaje"));
        mapper.updatePlayerCharacterFromDto(updatedCharacter, original);
        return mapper.toDto(playerCharacterRepository.save(original));
    }
}
