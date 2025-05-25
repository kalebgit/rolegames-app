package kal.com.rolegames.controllers;

import kal.com.rolegames.dto.users.UserDTO;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.services.auth.AuthService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.EntityResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor(onConstructor_= @__({@Autowired}))
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
        try{
            logger.info("[CONTROLLER][REQUEST: {}] [LOGIN] Datos recibidos", loginRequest);
            String token = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful");
            response.put("username", loginRequest.getUsername());

            return ResponseEntity
                    .ok()
                    .header("Authorization", "Bearer " + token)
                    .body(response);
        } catch (Exception e) {
            logger.warn("[CONTROLLER] hubo un error en el login");
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Credenciales erroneas");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        logger.info("[CONTROLLER][USER: {}] [Register] Datos recibidos", user);
        try {
            if(user.getUserType() == null){
                user.setUserType(UserType.PLAYER);
            }

            UserDTO registeredUser = authService.register(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", registeredUser.getUserId());
            response.put("username", registeredUser.getUsername());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Registration failed");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest{
        private String username;
        private String password;
    }
}
