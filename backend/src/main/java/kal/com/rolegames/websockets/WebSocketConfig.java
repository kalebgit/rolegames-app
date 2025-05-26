package kal.com.rolegames.websockets;

import kal.com.rolegames.websockets.EncounterWebSocketHandler;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
public class WebSocketConfig implements WebSocketConfigurer {

    private EncounterWebSocketHandler encounterHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(encounterHandler, "/ws/encounters/{encounterId}")
                .setAllowedOrigins("*") // En producción, especifica dominios
                .withSockJS(); // Fallback para navegadores sin WebSocket
    }
}