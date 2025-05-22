package kal.com.rolegames.security.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${app.jwtSecret:d82f17be37c62ac9397fd35dfa211e57079a0f459c5482d564309781b48adc91f8f9878750286db8c508fa932d5c0eb62a40f18419f7224f808c8517f32d6dc0}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs:86400000}") // 24 hours by default
    private long jwtExpirationInMs;


    //genera la llave
    private SecretKey getKey(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);


        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserNameFromToken(String token){
        Claims claims = Jwts.
                parserBuilder().
                setSigningKey(getKey()).
                build().
                parseClaimsJws(token).
                getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token){
        try{
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return true;
        }catch (SignatureException ex) {
            // Invalid JWT signature
        } catch (MalformedJwtException ex) {
            // Invalid JWT token
        } catch (ExpiredJwtException ex) {
            // Expired JWT token
        } catch (UnsupportedJwtException ex) {
            // Unsupported JWT token
        } catch (IllegalArgumentException ex) {
            // JWT claims string is empty
        }
        return false;
    }

    public String getTokenFromRequest(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        //checa que no solo sean espacios en blanco o ""
        if(StringUtils.hasText(bearerToken)){
           String[] words = bearerToken.split(" ");
           return words[1];
        }
        return null;
    }
}
