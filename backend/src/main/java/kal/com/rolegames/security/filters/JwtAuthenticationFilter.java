package kal.com.rolegames.security.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kal.com.rolegames.security.util.JwtTokenProvider;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private JwtTokenProvider tokenProvider;
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        logger.info("🔐 JWT Filter - Procesando: {} {}", request.getMethod(), requestURI);

        try {
            String jwt = null;
            if (request.getParameter("token") != null) {
                jwt = request.getParameter("token");
            }else{
                jwt = tokenProvider.getTokenFromRequest(request);
            }
            logger.info("🔍 Token extraído: {}", jwt != null ? "PRESENTE (***)" : "AUSENTE");

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                logger.info("✅ Token válido");

                String username = tokenProvider.getUserNameFromToken(jwt);
                logger.info("👤 Usuario del token: {}", username);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                logger.info("📋 UserDetails cargado: {}", userDetails.getUsername());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("🔒 Contexto de seguridad establecido para: {}", username);
            } else {
                logger.warn("❌ Token inválido o ausente para: {}", requestURI);
            }
        } catch (Exception ex) {
            logger.error("❌ Error en JWT Filter para {}: {}", requestURI, ex.getMessage(), ex);
        }

        filterChain.doFilter(request, response);
    }
}