package kal.com.rolegames.services.auth;

import kal.com.rolegames.dto.users.DungeonMasterDTO;
import kal.com.rolegames.dto.users.PlayerDTO;
import kal.com.rolegames.dto.users.UserDTO;
import kal.com.rolegames.exceptions.EmailAlreadyInUseException;
import kal.com.rolegames.exceptions.InvalidUserTypeException;
import kal.com.rolegames.exceptions.UserRegistrationException;
import kal.com.rolegames.exceptions.UsernameAlreadyInUseException;
import kal.com.rolegames.mappers.users.UserMapper;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.users.UserRepository;
import kal.com.rolegames.security.util.JwtTokenProvider;
import kal.com.rolegames.services.users.DungeonMasterService;
import kal.com.rolegames.services.users.PlayerService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor(onConstructor_=@__({@Autowired}))
public class AuthService {

    private final UserMapper userMapper;
    private AuthenticationManager authenticationManager;
    private JwtTokenProvider tokenProvider;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    private PlayerService playerService;
    private DungeonMasterService dmService;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    /**
     * Autentica un usuario y genera un token JWT
     * @param username nombre de usuario
     * @param password contraseña
     * @return token JWT
     * @throws BadCredentialsException si las credenciales son inválidas
     */
    public String authenticate(String username, String password) {
        logger.info("[SERVICE][USER: {}] datos recibidos para autenticación", username);

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            logger.info("[SERVICE] [AUTH: {}] autenticación exitosa", auth.getName());
            SecurityContextHolder.getContext().setAuthentication(auth);

            return tokenProvider.generateToken(auth);

        } catch (AuthenticationException e) {
            logger.warn("[SERVICE] Error de autenticación para usuario: {}", username);
            throw new BadCredentialsException("Credenciales inválidas");
        }
    }

    /**
     * Registra un nuevo usuario en el sistema
     * @param user datos del usuario a registrar
     * @return usuario registrado
     * @throws EmailAlreadyInUseException si el email ya está en uso
     * @throws UsernameAlreadyInUseException si el username ya está en uso
     * @throws InvalidUserTypeException si el tipo de usuario no es válido
     * @throws UserRegistrationException si ocurre un error durante el registro
     */
    @Transactional
    public UserDTO register(User user) {
        logger.info("[SERVICE] Iniciando registro para usuario: {}", user.getUsername());


        // Validar que el email no esté en uso
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("[SERVICE] Intento de registro con email ya existente: {}", user.getEmail());
            throw new EmailAlreadyInUseException("El email '" + user.getEmail() + "' ya está en uso");
        }

        // Validar que el username no esté en uso
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            logger.warn("[SERVICE] Intento de registro con username ya existente: {}", user.getUsername());
            throw new UsernameAlreadyInUseException("El nombre de usuario '" + user.getUsername() + "' ya está en uso");
        }

        // Encriptar la contraseña

        try {
            //todavia no se crea el usuario, se setea el password codficiado
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // para player
            if (user.getUserType() == UserType.PLAYER) {
                logger.info("[SERVICE] Creando usuario tipo PLAYER");
                 PlayerDTO player = playerService.createPlayerFromUser(user);

                 logger.warn("[USUARIOOOO EN BASE DE DATOOSS] este es el usuario ya en base de " +
                         "datos: " + userRepository.findById(player.getUserId()));
                // para dm
            } else if (user.getUserType() == UserType.DUNGEON_MASTER) {
                logger.info("[SERVICE] Creando usuario tipo DUNGEON_MASTER");
                DungeonMasterDTO dm = dmService.createDungeonMasterFromUser(user);

                logger.warn("[USUARIOOOO EN BASE DE DATOOSS] este es el usuario ya en base de " +
                        "datos: " + userRepository.findById(dm.getUserId()));

               //para admin
//            } else if (user.getUserType() == UserType.ADMIN) {
//                logger.info("[SERVICE] Creando usuario tipo ADMIN");
//                // Por ahora guardar como usuario básico, implementar AdminService después
//                user = userRepository.save(user);
            } else {
                logger.error("[SERVICE] Tipo de usuario no válido: {}", user.getUserType());
                throw new InvalidUserTypeException("Tipo de usuario no válido: " + user.getUserType());
            }

            logger.info("[SERVICE] Usuario registrado exitosamente: {}", user);
            return userMapper.toDto(user);

        } catch (EmailAlreadyInUseException | UsernameAlreadyInUseException | InvalidUserTypeException e) {
            // Re-lanzar excepciones específicas
            throw e;
        } catch (Exception e) {
            logger.error("[SERVICE] Error inesperado durante el registro del usuario: {}", user.getUsername(), e);
            throw new UserRegistrationException("Error durante el registro del usuario: " + e.getMessage(), e);
        }
    }
}