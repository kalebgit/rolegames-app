package kal.com.rolegames.controllers;

import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.services.auth.AuthService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.EntityResponse;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor(onConstructor_= @__({@Autowired}))
public class AuthController {

    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
        String token = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        return ResponseEntity
                .ok()
                .header("Authorization", "Bearer " + token)
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){

        if(user.getUserType() == null){
            user.setUserType(UserType.PLAYER);
        }

        return ResponseEntity.ok().body(authService.register(user));
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest{
        private String username;
        private String password;
    }
}
