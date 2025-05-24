package kal.com.rolegames.services.users;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.users.PlayerRepository;
import kal.com.rolegames.repositories.users.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class PlayerService {

    private final PlayerRepository playerRepository;

    private static final Logger logger = LoggerFactory.getLogger(PlayerService.class);

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Obtiene un jugador por su ID de usuario, lanza excepción si no existe
     */
    public Player getByUserId(Long userId) {
        return playerRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Player not found for user ID: " + userId));
    }



    /**
     * Obtiene todos los jugadores
     */
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    /**
     * Agrega un personaje a la lista del jugador
     */
    @Transactional
    public Player addCharacterToPlayer(Long playerId, PlayerCharacter character) {
        Player player = getByUserId(playerId);
        player.addCharacter(character);
        return playerRepository.save(player);
    }


    /**
     * Remueve un personaje de la lista del jugador
     */
    @Transactional
    public Player removeCharacterFromPlayer(Long playerId, PlayerCharacter character) {
        Player player = getByUserId(playerId);
        player.removeCharacter(character);
        return playerRepository.save(player);
    }

    /**
     * Agrega experiencia a un jugador
     */
    @Transactional
    public Player addExperienceToPlayer(Long playerId, int experienceAmount) {
        Player player = getByUserId(playerId);
        player.addExperience(experienceAmount);
        return playerRepository.save(player);
    }


    /**
     * Obtiene el nivel actual del jugador
     */
    public int getPlayerLevel(Long playerId) {
        Player player = getByUserId(playerId);
        return player.getLevel();
    }

    /**
     * Obtiene todos los personajes de un jugador
     */
    public List<PlayerCharacter> getPlayerCharacters(Long playerId) {
        Player player = getByUserId(playerId);
        return player.getCharacters().stream().toList();
    }


    /**
     * Verifica si un jugador existe por ID
     */
    public boolean existsById(Long playerId) {
        return playerRepository.existsById(playerId);
    }

    /**
     * Actualiza la información básica del jugador
     */
    @Transactional
    public Player updatePlayer(Player player) {
        if (!existsById(player.getUser().getUserId())) {
            throw new NoSuchElementException("Player not found with ID: " + player.getUser().getUserId());
        }
        return playerRepository.save(player);
    }

    /**
     * Elimina un jugador
     */
    @Transactional
    public void deletePlayer(Long playerId) {
        if (!existsById(playerId)) {
            throw new NoSuchElementException("Player not found with ID: " + playerId);
        }
        playerRepository.deleteById(playerId);
    }
}