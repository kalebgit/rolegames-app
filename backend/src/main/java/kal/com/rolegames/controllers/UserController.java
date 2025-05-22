package kal.com.rolegames.controllers;

import kal.com.rolegames.dto.UserDTO;
import kal.com.rolegames.mappers.UserMapper;
import kal.com.rolegames.models.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private UserMapper mapper;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(mapper.toDto(user));
    }

}
