package kal.com.rolegames.services.users;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.users.PlayerDTO;
import kal.com.rolegames.dto.users.UserDTO;
import kal.com.rolegames.mappers.users.PlayerMapper;
import kal.com.rolegames.mappers.users.UserMapper;
import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.users.User;
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
    private final UserRepository userRepository;
    private final PlayerMapper playerMapper;
    private final UserMapper userMapper;

    private static final Logger logger = LoggerFactory.getLogger(PlayerService.class);

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Obtiene todos los jugadores
     */
    public List<PlayerDTO> getAllPlayers() {
        List<Player> players = playerRepository.findAll();
        return playerMapper.toPlayerDtoList(players);
    }

    /**
     * Obtiene un jugador por ID
     */
    public PlayerDTO getPlayerById(Long playerId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found with id: " + playerId));
        return playerMapper.toDto(player);
    }

    /**
     * Obtiene un jugador por su ID de usuario
     */
    public PlayerDTO getPlayerByUserId(Long userId) {
        Player player = playerRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Player not found for user ID: " + userId));
        return playerMapper.toDto(player);
    }

    @Transactional
    public PlayerDTO createPlayerFromUser(UserDTO user) {
        logger.info("[PLAYER_SERVICE] Creando player a partir del usuario: {}", user.getUsername());

        if (playerRepository.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("[PLAYER_SERVICE] Player ya existe para este usuario");
            throw new IllegalStateException("Player already exists for this user");
        }

        try {
            User userfound = userRepository.getReferenceById(user.getUserId());
            Player newPlayer = Player.builder()
                    .user(userfound)
                    .experience(0)
                    .build();

            Player savedPlayer = playerRepository.save(newPlayer);
            logger.info("[PLAYER_SERVICE] ✅Player guardado exitosamente con ID: {}", savedPlayer.getPlayerId());

            return playerMapper.toDto(savedPlayer);

        } catch (Exception exc) {
            logger.error("[PLAYER_SERVICE] Error al crear Player: {} - {}",
                    exc.getClass().getSimpleName(), exc.getMessage(), exc);
            throw new RuntimeException("Error al crear Player: " + exc.getMessage(), exc);
        }
    }


    /**
     * Crea un Player desde un DTO
     */
    @Transactional
    public PlayerDTO createPlayer(PlayerDTO playerDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        return createPlayerFromUser(userMapper.toDto(user));
    }

    /**
     * Actualiza un player existente
     */
    @Transactional
    public PlayerDTO updatePlayer(Long playerId, PlayerDTO playerDTO) {
        Player existingPlayer = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found with id: " + playerId));

        playerMapper.updatePlayerFromDto(playerDTO, existingPlayer);
        Player updatedPlayer = playerRepository.save(existingPlayer);

        logger.info("[PLAYER_SERVICE] Player actualizado: {}", updatedPlayer.getPlayerId());
        return playerMapper.toDto(updatedPlayer);
    }

    /**
     * Agrega un personaje a la lista del jugador
     */
    @Transactional
    public PlayerDTO addCharacterToPlayer(Long playerId, PlayerCharacter character) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found with id: " + playerId));

        player.addCharacter(character);
        Player updatedPlayer = playerRepository.save(player);

        logger.info("[PLAYER_SERVICE] Personaje agregado al player: {}", playerId);
        return playerMapper.toDto(updatedPlayer);
    }

    /**
     * Agrega un personaje por userId
     */
    @Transactional
    public PlayerDTO addCharacterToPlayerByUserId(Long userId, PlayerCharacter character) {
        Player player = playerRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Player not found for user ID: " + userId));

        player.addCharacter(character);
        Player updatedPlayer = playerRepository.save(player);

        logger.info("[PLAYER_SERVICE] Personaje agregado al player por userId: {}", userId);
        return playerMapper.toDto(updatedPlayer);
    }

    /**
     * Remueve un personaje de la lista del jugador
     */
    @Transactional
    public PlayerDTO removeCharacterFromPlayer(Long playerId, PlayerCharacter character) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found with id: " + playerId));

        player.removeCharacter(character);
        Player updatedPlayer = playerRepository.save(player);

        logger.info("[PLAYER_SERVICE] Personaje removido del player: {}", playerId);
        return playerMapper.toDto(updatedPlayer);
    }

    /**
     * Agrega experiencia a un jugador
     */
    @Transactional
    public PlayerDTO addExperienceToPlayer(Long playerId, int experienceAmount) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found with id: " + playerId));

        player.addExperience(experienceAmount);
        Player updatedPlayer = playerRepository.save(player);

        logger.info("[PLAYER_SERVICE] Experiencia agregada al player: {} (+{})", playerId, experienceAmount);
        return playerMapper.toDto(updatedPlayer);
    }

    /**
     * Agrega experiencia por userId
     */
    @Transactional
    public PlayerDTO addExperienceToPlayerByUserId(Long userId, int experienceAmount) {
        Player player = playerRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Player not found for user ID: " + userId));

        player.addExperience(experienceAmount);
        Player updatedPlayer = playerRepository.save(player);

        logger.info("[PLAYER_SERVICE] Experiencia agregada al player por userId: {} (+{})", userId, experienceAmount);
        return playerMapper.toDto(updatedPlayer);
    }

    /**
     * Elimina un player
     */
    @Transactional
    public void deletePlayer(Long playerId) {
        if (!playerRepository.existsById(playerId)) {
            throw new NoSuchElementException("Player not found with id: " + playerId);
        }

        playerRepository.deleteById(playerId);
        logger.info("[PLAYER_SERVICE] Player eliminado con ID: {}", playerId);
    }

    /**
     * Verifica si un jugador existe por ID
     */
    public boolean existsById(Long playerId) {
        return playerRepository.existsById(playerId);
    }

    /**
     * Verifica si un jugador existe por userId
     */
    public boolean existsByUserId(Long userId) {
        return playerRepository.findByUserId(userId).isPresent();
    }

    /**
     * Obtiene la instancia Player si existe
     */
    public Optional<Player> getPlayerInstance(Long userId) {
        return playerRepository.findByUserId(userId);
    }
}