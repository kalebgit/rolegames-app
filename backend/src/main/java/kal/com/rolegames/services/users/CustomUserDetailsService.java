package kal.com.rolegames.services.users;

import kal.com.rolegames.models.users.User;
import kal.com.rolegames.repositories.users.UserRepository;
import kal.com.rolegames.security.CustomAuthenticationProvider;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
public class CustomUserDetailsService implements UserDetailsService {

    private UserRepository userRepository;

    private final static Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        logger.info("[SERVICE] [DB] [USERNAME: {}] Datos recibidos ", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> {
                    logger.warn("[DB] Usuario no encontrado");
                    return new UsernameNotFoundException("User not found with username " + username);
                });

        logger.info("[DB] [USER: {}, type: {}] Usuario recuperado", user, user.getClass());
        return user;
    }
}
