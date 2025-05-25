package kal.com.rolegames.services.users;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.users.UserDTO;
import kal.com.rolegames.mappers.users.UserMapper;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.users.UserRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    /**
     * Obtiene todos los usuarios
     */
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toUserDtoList(users);
    }

    /**
     * Obtiene un usuario por ID
     */
    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        return userMapper.toDto(user);
    }

    /**
     * Obtiene un usuario por username
     */
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found with username: " + username));
        return userMapper.toDto(user);
    }

    /**
     * Obtiene un usuario por email
     */
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found with email: " + email));
        return userMapper.toDto(user);
    }

    /**
     * Crea un nuevo usuario básico (sin Player/DM)
     */
    @Transactional
    public User createUser(User user) {
        logger.info("[USER_SERVICE] Creando nuevo usuario: {}", user.getUsername());

        // Verificar que username y email no existan
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + user.getEmail());
        }

        user.addRole(user.getUserType());

        User savedUser = userRepository.save(user);
        logger.info("[USER_SERVICE]  ❗ ❗ ❗ ❗ ❗Usuario creado exitosamente: {}", savedUser);

        return savedUser;
    }

    /**
     * Actualiza un usuario existente
     */
    @Transactional
    public UserDTO updateUser(Long userId, UserDTO userDTO) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        // Verificar que username y email no sean duplicados (excepto el actual)
        Optional<User> userWithUsername = userRepository.findByUsername(userDTO.getUsername());
        if (userWithUsername.isPresent() && !userWithUsername.get().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Username already exists: " + userDTO.getUsername());
        }

        Optional<User> userWithEmail = userRepository.findByEmail(userDTO.getEmail());
        if (userWithEmail.isPresent() && !userWithEmail.get().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Email already exists: " + userDTO.getEmail());
        }

        userMapper.updateUserFromDto(userDTO, existingUser);
        User updatedUser = userRepository.save(existingUser);

        logger.info("[USER_SERVICE] Usuario actualizado: {}", updatedUser.getUsername());
        return userMapper.toDto(updatedUser);
    }

    /**
     * Cambia la contraseña de un usuario
     */
    @Transactional
    public UserDTO changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Actualizar contraseña
        user.setPassword(passwordEncoder.encode(newPassword));
        User updatedUser = userRepository.save(user);

        logger.info("[USER_SERVICE] Contraseña actualizada para usuario: {}", user.getUsername());
        return userMapper.toDto(updatedUser);
    }

    /**
     * Agrega un rol a un usuario
     */
    @Transactional
    public UserDTO addRoleToUser(Long userId, UserType roleType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        user.addRole(roleType);
        User updatedUser = userRepository.save(user);

        logger.info("[USER_SERVICE] Rol {} agregado al usuario: {}", roleType, user.getUsername());
        return userMapper.toDto(updatedUser);
    }

    /**
     * Remueve un rol de un usuario
     */
    @Transactional
    public UserDTO removeRoleFromUser(Long userId, UserType roleType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        // No permitir remover el rol principal
        if (user.getUserType() == roleType) {
            throw new IllegalArgumentException("Cannot remove primary user type");
        }

        user.removeRole(roleType);
        User updatedUser = userRepository.save(user);

        logger.info("[USER_SERVICE] Rol {} removido del usuario: {}", roleType, user.getUsername());
        return userMapper.toDto(updatedUser);
    }

    /**
     * Elimina un usuario
     */
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new NoSuchElementException("User not found with id: " + userId);
        }

        userRepository.deleteById(userId);
        logger.info("[USER_SERVICE] Usuario eliminado con ID: {}", userId);
    }

    /**
     * Verifica si existe un usuario por username
     */
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    /**
     * Verifica si existe un usuario por email
     */
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * Obtiene los roles activos de un usuario
     */
    public List<UserType> getUserActiveRoles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        return user.getActiveRoles().stream().toList();
    }
}