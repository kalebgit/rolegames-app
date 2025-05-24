package kal.com.rolegames.services.users;

import jakarta.transaction.Transactional;
import kal.com.rolegames.models.users.*;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.users.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class UserRoleService {

    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    private final DungeonMasterRepository dungeonMasterRepository;

    private final PlayerService playerService;
    private final DungeonMasterService dmService;

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

        return playerRepository.save(player);
    }

    /**
     * Permite a un usuario obtener el rol de DungeonMaster
     */
    @Transactional
    public DungeonMaster enableDungeonMasterRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Optional<DungeonMaster> existingDM = dungeonMasterRepository.findByUserId(userId);
        if (existingDM.isPresent()) {
            user.addRole(UserType.DUNGEON_MASTER);
            userRepository.save(user);
            return existingDM.get();
        }

        DungeonMaster dm = dmService.createDungeonMasterFromUser(user);

        user.addRole(UserType.DUNGEON_MASTER);
        userRepository.save(user);

        return dungeonMasterRepository.save(dm);
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