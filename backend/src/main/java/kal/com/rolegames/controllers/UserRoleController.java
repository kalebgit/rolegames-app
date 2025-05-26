package kal.com.rolegames.controllers;

import kal.com.rolegames.dto.users.DungeonMasterDTO;
import kal.com.rolegames.dto.users.PlayerDTO;
import kal.com.rolegames.models.users.*;
import kal.com.rolegames.models.util.UserType;
// import kal.com.rolegames.services.users.UserInstanceService; // Para Opción 2
import kal.com.rolegames.repositories.users.UserRepository;
import kal.com.rolegames.services.users.UserRoleService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/roles")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class UserRoleController {

    //para debug
    private final UserRepository userRepository;

    private final UserRoleService userRoleService;

    private final static Logger logger = LoggerFactory.getLogger(UserRoleController.class);

    /**
     * Obtiene los roles disponibles del usuario autenticado
     */
    @GetMapping("/my-roles")
    public ResponseEntity<Map<String, Object>> getMyRoles(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();

        response.put("userId", user.getUserId());
        response.put("username", user.getUsername());
        response.put("primaryRole", user.getUserType());

        // Usar el servicio para obtener roles de forma segura
        response.put("availableRoles", userRoleService.getUserActiveRoles(user.getUserId()));
        response.put("canActAsPlayer", userRoleService.canActAsPlayer(user.getUserId()));
        response.put("canActAsDungeonMaster", userRoleService.canActAsDungeonMaster(user.getUserId()));

        return ResponseEntity.ok(response);
    }
    /**
     * Permite al usuario activar el rol de Player
     */
    @PostMapping("/enable-player")
    public ResponseEntity<Map<String, Object>> enablePlayerRole(@AuthenticationPrincipal User user) {
        try {
            PlayerDTO player = userRoleService.enablePlayerRole(user.getUserId());


            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Player role activated successfully");
            response.put("playerId", player.getUserId());
            response.put("playerLevel", player.getLevel());
            response.put("experience", player.getExperience());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to activate player role: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Permite al usuario activar el rol de DungeonMaster
     */
    @PostMapping("/enable-dm")
    public ResponseEntity<Map<String, Object>> enableDungeonMasterRole(@AuthenticationPrincipal User user) {

        logger.info("[ROLES] [DM] activando role de dungeon master");

        try {
            DungeonMasterDTO dm = userRoleService.enableDungeonMasterRole(user.getUserId());

            logger.info("[ROLES] [DM] ✅Se ha creado el dungeon_master");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Dungeon Master role activated successfully");
            response.put("dmId", dm.getUserId());
            response.put("campaignCount", dm.getCampaignCount());
            response.put("dmStyle", dm.getDmStyle());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to activate DM role: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Desactiva un rol específico (solo para roles no primarios)
     */
    @PostMapping("/disable-role")
    public ResponseEntity<Map<String, Object>> disableRole(
            @AuthenticationPrincipal User user,
            @RequestBody DisableRoleRequest request) {
        try {
            userRoleService.disableRole(user.getUserId(), request.getRoleType());


            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Role " + request.getRoleType() + " disabled successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to disable role: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Obtiene la instancia Player del usuario (si está disponible)
     */
    @GetMapping("/player-instance")
    public ResponseEntity<Map<String, Object>> getPlayerInstance(@AuthenticationPrincipal User user) {
        Optional<PlayerDTO> player = userRoleService.getPlayerInstance(user.getUserId());

        if (player.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("hasPlayerInstance", true);
            response.put("playerId", player.get().getUserId());
            response.put("level", player.get().getLevel());
            response.put("experience", player.get().getExperience());
            response.put("characterCount", player.get().getCharacterCount());

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("hasPlayerInstance", false);
            response.put("message", "User does not have access to Player functionality");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Obtiene la instancia DungeonMaster del usuario (si está disponible)
     */
    @GetMapping("/dm-instance")
    public ResponseEntity<Map<String, Object>> getDungeonMasterInstance(@AuthenticationPrincipal User user) {

        Optional<DungeonMasterDTO> dm = userRoleService.getDungeonMasterInstance(user.getUserId());


        if (dm.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("hasDMInstance", true);
            response.put("dmId", dm.get().getUserId());
            response.put("campaignCount", dm.get().getCampaignCount());
            response.put("npcCount", dm.get().getNpcCount());
            response.put("itemCount", dm.get().getItemCount());
            response.put("dmStyle", dm.get().getDmStyle());
            response.put("rating", dm.get().getRating());

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("hasDMInstance", false);
            response.put("message", "User does not have access to Dungeon Master functionality");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Cambia entre roles (útil para usuarios con múltiples roles)
     */
    @PostMapping("/switch-context")
    public ResponseEntity<Map<String, Object>> switchRoleContext(
            @AuthenticationPrincipal User user,
            @RequestBody SwitchContextRequest request) {

        logger.info("Usuario para cambiar el contexto de roles: " + user);
        Map<String, Object> response = new HashMap<>();
        User userFromDB = userRepository.findById(user.getUserId())
                .orElseThrow(()->new NoSuchElementException("no existe el usuario o no fue encontrado"));

        logger.info("Usuario que esta en repositorio: " + userFromDB);
        if (!user.hasRole(request.getTargetRole())) {
            response.put("success", false);
            response.put("message", "User does not have access to " + request.getTargetRole() + " role");
            return ResponseEntity.badRequest().body(response);
        }

        //guardando el contexto actual
        user.setUserType(request.targetRole);
        userRepository.save(user);

        response.put("success", true);
        response.put("currentRole", request.getTargetRole());
        response.put("message", "Role context switched successfully");

        return ResponseEntity.ok(response);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DisableRoleRequest {
        private UserType roleType;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SwitchContextRequest {
        private UserType targetRole;
    }
}