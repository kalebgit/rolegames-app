package kal.com.rolegames.controllers;

import kal.com.rolegames.dto.users.UserDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.services.users.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal User user) {
        logger.info("🔍 /api/users/me - Inicio del endpoint");
        logger.info("📝 Usuario autenticado: {}", user != null ? user.getUsername() : "NULL");

        if (user == null) {
            logger.error("❌ Usuario no autenticado o token inválido");
            return ResponseEntity.status(401).build();
        }

        try {
            UserDTO userDTO = userService.getUserById(user.getUserId());
            logger.info("✅ Datos del usuario obtenidos exitosamente: {}", userDTO.getUsername());
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            logger.error("❌ Error al obtener usuario: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO));
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<UserDTO> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(
                id, request.getCurrentPassword(), request.getNewPassword()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
}