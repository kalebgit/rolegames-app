package kal.com.rolegames.security.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kal.com.rolegames.security.util.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
//lombok
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
//simplemente esta validando tokens ya generados, no haciendo un login o algo parecido
// por eso se implementa OncePerRequestFilter y no AuthenticationProvider
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtTokenProvider tokenProvider;
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try{
            String jwt = tokenProvider.getTokenFromRequest(request);
            if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)){
                String username = tokenProvider.getUserNameFromToken(jwt);
                UserDetails details = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken token =
                        new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(token);
            }
        }catch (Exception ex) {
            logger.error("Could not set user authentication in security context when trying to process jwt token", ex);
        }

        filterChain.doFilter(request, response);
    }
}
