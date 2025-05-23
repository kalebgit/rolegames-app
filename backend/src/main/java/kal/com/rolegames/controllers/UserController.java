package kal.com.rolegames.controllers;

import kal.com.rolegames.dto.UserDTO;
import kal.com.rolegames.mappers.UserMapper;
import kal.com.rolegames.models.users.User;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private UserMapper mapper;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user) {
        logger.info("🔍 /api/users/me - Inicio del endpoint");
        logger.info("📝 Usuario autenticado: {}", user != null ? user.getUsername() : "NULL");

        if (user == null) {
            logger.error("❌ Usuario no autenticado o token inválido");
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }

        try {
            UserDTO userDTO = mapper.toDto(user);
            logger.info("✅ Datos del usuario obtenidos exitosamente: {}", userDTO.getUsername());
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            logger.error("❌ Error al mapear usuario: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error interno del servidor");
        }
    }
}