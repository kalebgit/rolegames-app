package kal.com.rolegames.security;

import com.mysql.cj.conf.PropertySet;
import com.mysql.cj.exceptions.ExceptionInterceptor;
import com.mysql.cj.protocol.Protocol;
import kal.com.rolegames.models.users.User;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
//lombok
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private UserDetailsService userDetailsService;
    private PasswordEncoder passwordEncoder;

    private final static Logger logger = LoggerFactory.getLogger(CustomAuthenticationProvider.class);

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        logger.info("[SERVICE-AUTH] [AUTH: {}] Datos recibidos", authentication);
        String username = authentication.getName();
        String credentials = authentication.getCredentials().toString();

        UserDetails user = userDetailsService.loadUserByUsername(username);
        logger.info("[SERVICE-AUTH] [USER DETAILS: {}] Userdetails creados", user);
        if(passwordEncoder.matches(credentials, user.getPassword())){
            return new UsernamePasswordAuthenticationToken(
                    user,
                    credentials,
                    user.getAuthorities());
        }else{
            throw new BadCredentialsException("Invalid password");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }}
