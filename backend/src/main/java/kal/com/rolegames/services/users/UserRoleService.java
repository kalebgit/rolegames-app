package kal.com.rolegames.services.users;

import jakarta.transaction.Transactional;
import kal.com.rolegames.models.users.*;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.users.*;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class UserRoleService {

    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final DungeonMasterRepository dungeonMasterRepository;

    private final PlayerService playerService;
    private final DungeonMasterService dmService;

    private final static Logger logger = LoggerFactory.getLogger(UserRoleService.class);

    /**
     * Obtiene los roles activos de un usuario de forma segura
     */
    @Transactional
    public Set<UserType> getUserActiveRoles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Set<UserType> activeRoles = new HashSet<>();
        activeRoles.add(user.getUserType());

        // Cargar roles adicionales explícitamente dentro de la transacción
        user.getRoles().stream()
                .filter(UserRole::getIsActive)
                .forEach(role -> activeRoles.add(role.getRoleType()));

        return activeRoles;
    }

    /**
     * Verifica si un usuario puede actuar como Player
     */
    @Transactional
    public boolean canActAsPlayer(Long userId) {
        Set<UserType> roles = getUserActiveRoles(userId);
        return roles.contains(UserType.PLAYER);
    }

    /**
     * Verifica si un usuario puede actuar como DungeonMaster
     */
    @Transactional
    public boolean canActAsDungeonMaster(Long userId) {
        Set<UserType> roles = getUserActiveRoles(userId);
        return roles.contains(UserType.DUNGEON_MASTER);
    }
    /**
     * Permite a un usuario obtener el rol de Player
     */
    @Transactional
    public Player enablePlayerRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Optional<Player> existingPlayer = playerRepository.findByUserId(userId);
        if (existingPlayer.isPresent()) {
            user.addRole(UserType.PLAYER);
            userRepository.save(user);
            return existingPlayer.get();
        }

        Player player = playerService.createPlayerFromUser(user);

        user.addRole(UserType.PLAYER);
        userRepository.save(user);

        return player;
    }

    /**
     * Permite a un usuario obtener el rol de DungeonMaster
     */
    @Transactional
    public DungeonMaster enableDungeonMasterRole(Long userId) {
        logger.info("[SERVICE] [ROL] recibinedo usuario con id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado para cambiar su rol"));

        logger.info("[SERVICE] [ROL] si existio usuario para asignar el rol: {}", user);
        Optional<DungeonMaster> existingDM = dungeonMasterRepository.findByUserId(userId);
        if (existingDM.isPresent()) {
            logger.info("[SERVICE] [ROL] el dm ya existia: ");
            user.addRole(UserType.DUNGEON_MASTER);
            userRepository.save(user);
            return existingDM.get();
        }

        logger.info("[SERVICE] [ROL] creando dm con el service");

        DungeonMaster dm = dmService.createDungeonMasterFromUser(user);

        logger.info("[SERVICE] [ROL] se ha creado el dm: {}", dm);

        user.addRole(UserType.DUNGEON_MASTER);
        User updatedUser = userRepository.save(user);

        logger.info("[SERVICE] [ROL] el usuario fue actualizado: {}", updatedUser);
        logger.info("[SERVICE] [ROL] todo bien para actualizar al usuario con su nuevo rol: {}", dm);

        return dm;
    }

    /**
     * Desactiva un rol específico
     */
    @Transactional
    public void disableRole(Long userId, UserType roleType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        user.removeRole(roleType);
        userRepository.save(user);
    }

    /**
     * Obtiene la instancia Player si el usuario tiene ese rol
     */
    public Optional<Player> getPlayerInstance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (user.canActAsPlayer()) {
            return playerRepository.findByUserId(userId);
        }
        return Optional.empty();
    }

    /**
     * Obtiene la instancia DungeonMaster si el usuario tiene ese rol
     */
    public Optional<DungeonMaster> getDungeonMasterInstance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (user.canActAsDungeonMaster()) {
            return dungeonMasterRepository.findByUserId(userId);
        }
        return Optional.empty();
    }
}