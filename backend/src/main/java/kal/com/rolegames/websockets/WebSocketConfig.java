package kal.com.rolegames.websockets;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
@AllArgsConstructor(onConstructor_ = @__({@Autowired}))
public class WebSocketConfig implements WebSocketConfigurer {

    private final EncounterWebSocketHandler encounterHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(encounterHandler, "/ws/encounters/{encounterId}")
                .setAllowedOriginPatterns("*") // Permitir todos los orígenes en desarrollo
                .withSockJS() // Fallback para navegadores sin WebSocket nativo
                .setHeartbeatTime(25000) // Heartbeat cada 25 segundos
                .setDisconnectDelay(5000); // Esperar 5 segundos antes de desconectar
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(8192);
        container.setMaxBinaryMessageBufferSize(8192);
        container.setMaxSessionIdleTimeout(300000L); // 5 minutos
        return container;
    }
}