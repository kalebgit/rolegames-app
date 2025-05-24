package kal.com.rolegames.controllers;

import kal.com.rolegames.models.users.*;
import kal.com.rolegames.models.util.UserType;
// import kal.com.rolegames.services.users.UserInstanceService; // Para Opción 2
import kal.com.rolegames.services.users.UserRoleService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/roles")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class UserRoleController {

    private final UserRoleService userRoleService;

    /**
     * Obtiene los roles disponibles del usuario autenticado
     */
    @GetMapping("/my-roles")
    public ResponseEntity<Map<String, Object>> getMyRoles(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();

        response.put("userId", user.getUserId());
        response.put("username", user.getUsername());
        response.put("primaryRole", user.getUserType());

        response.put("availableRoles", user.getActiveRoles());
        response.put("canActAsPlayer", user.canActAsPlayer());
        response.put("canActAsDungeonMaster", user.canActAsDungeonMaster());

        return ResponseEntity.ok(response);
    }

    /**
     * Permite al usuario activar el rol de Player
     */
    @PostMapping("/enable-player")
    public ResponseEntity<Map<String, Object>> enablePlayerRole(@AuthenticationPrincipal User user) {
        try {
            Player player = userRoleService.enablePlayerRole(user.getUserId());


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
        try {
            DungeonMaster dm = userRoleService.enableDungeonMasterRole(user.getUserId());


            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Dungeon Master role activated successfully");
            response.put("dmId", dm.getUserId());
            response.put("campaignCount", dm.getCampaigns().size());
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
        Optional<Player> player = userRoleService.getPlayerInstance(user.getUserId());

        if (player.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("hasPlayerInstance", true);
            response.put("playerId", player.get().getUserId());
            response.put("level", player.get().getLevel());
            response.put("experience", player.get().getExperience());
            response.put("characterCount", player.get().getCharacters().size());

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

        Optional<DungeonMaster> dm = userRoleService.getDungeonMasterInstance(user.getUserId());


        if (dm.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("hasDMInstance", true);
            response.put("dmId", dm.get().getUserId());
            response.put("campaignCount", dm.get().getCampaigns().size());
            response.put("npcCount", dm.get().getCreatedNpcs().size());
            response.put("itemCount", dm.get().getCreatedItems().size());
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

        Map<String, Object> response = new HashMap<>();

        if (!user.hasRole(request.getTargetRole())) {
            response.put("success", false);
            response.put("message", "User does not have access to " + request.getTargetRole() + " role");
            return ResponseEntity.badRequest().body(response);
        }


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