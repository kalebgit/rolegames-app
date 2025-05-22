package kal.com.rolegames.services.auth;

import kal.com.rolegames.models.users.User;
import kal.com.rolegames.repositories.users.UserRepository;
import kal.com.rolegames.security.util.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
//lombok
@AllArgsConstructor(onConstructor_=@__({@Autowired}))
public class AuthService {

    private AuthenticationManager authenticationManager;
    private JwtTokenProvider tokenProvider;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public String authenticate(String username, String password){
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        return tokenProvider.generateToken(auth);
    }

    public User register(User user){
        if(userRepository.findById(user.getUserId()).isPresent() || userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email is already in use!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
}
