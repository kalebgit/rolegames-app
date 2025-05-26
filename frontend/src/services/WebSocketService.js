import { useState, useEffect, useCallback } from 'react';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.sessionId = null;
    this.userId = null;
    this.encounterId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // ========================================
  // CONNECTION MANAGEMENT
  // ========================================
  connect(sessionId, userId, encounterId) {
    return new Promise((resolve, reject) => {
      this.sessionId = sessionId;
      this.userId = userId;
      this.encounterId = encounterId;
      
      try {
        // Construir URL del WebSocket
        const wsUrl = `${process.env.NODE_ENV === 'production' ? 'wss:' : 'ws:'}//${window.location.host}/ws/encounters/${encounterId}`;
        
        console.log(`🔌 WebSocket: Conectando a ${wsUrl}`);
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log(`✅ WebSocket: Conectado al encounter ${encounterId}`);
          
          // Registrar usuario
          this.send('USER_JOINED', {
            userId: this.userId,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
          });
          
          this.emit('connected', { sessionId, userId, encounterId });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.isConnected = false;
          console.log('🔌 WebSocket: Conexión cerrada', event.code, event.reason);
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
          
          this.emit('disconnected', { code: event.code, reason: event.reason });
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket Error:', error);
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.sessionId = null;
    this.userId = null;
    this.encounterId = null;
    this.listeners.clear();
    
    console.log('🔌 WebSocket: Desconectado');
  }

  attemptReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 WebSocket: Intentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts}) en ${delay}ms`);
    
    setTimeout(() => {
      if (this.sessionId && this.userId && this.encounterId) {
        this.connect(this.sessionId, this.userId, this.encounterId)
          .catch(() => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.attemptReconnect();
            }
          });
      }
    }, delay);
  }

  // ========================================
  // MESSAGE HANDLING
  // ========================================
  send(type, data) {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket: No conectado, no se puede enviar mensaje');
      return false;
    }

    const message = {
      type,
      data,
      userId: this.userId,
      timestamp: new Date().toISOString()
    };

    try {
      this.ws.send(JSON.stringify(message));
      console.log('📤 WebSocket: Mensaje enviado', message);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  handleMessage(message) {
    console.log('📥 WebSocket: Mensaje recibido', message);
    
    switch (message.type) {
      case 'INITIAL_STATE':
        this.emit('initial_state', message.encounter);
        break;
        
      case 'ACTION_PERFORMED':
        this.emit('action_performed', message.data);
        break;
        
      case 'TURN_CHANGED':
        this.emit('turn_changed', message.data);
        break;
        
      case 'COMBAT_STARTED':
        this.emit('combat_started', message.data);
        break;
        
      case 'COMBAT_ENDED':
        this.emit('combat_ended', message.data);
        break;
        
      case 'PARTICIPANT_ADDED':
        this.emit('participant_added', message.data);
        break;
        
      case 'HEALTH_UPDATE':
        this.emit('health_update', message.data);
        break;
        
      case 'USER_JOINED':
        this.emit('user_joined', message.data);
        break;
        
      case 'USER_LEFT':
        this.emit('user_left', message.data);
        break;
        
      default:
        console.warn('Tipo de mensaje no reconocido:', message.type);
        this.emit('unknown_message', message);
    }
  }

  // ========================================
  // EVENT HANDLING
  // ========================================
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`WebSocket event handler error for ${event}:`, error);
        }
      });
    }
  }

  // ========================================
  // SPECIFIC GAME ACTIONS
  // ========================================
  performCombatAction(actionData) {
    return this.send('PERFORM_ACTION', actionData);
  }

  rollDice(diceData) {
    return this.send('DICE_ROLL', diceData);
  }

  addNPCToEncounter(npcData) {
    return this.send('ADD_NPC', npcData);
  }

  updatePlayerPosition(playerId, position) {
    return this.send('PLAYER_POSITION_UPDATE', {
      playerId,
      position
    });
  }

  sendMessage(messageText) {
    return this.send('CHAT_MESSAGE', {
      message: messageText,
      timestamp: new Date().toISOString()
    });
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  isConnectedToEncounter() {
    return this.isConnected && this.encounterId !== null;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      sessionId: this.sessionId,
      userId: this.userId,
      encounterId: this.encounterId,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

// React Hook for WebSocket
export function useWebSocket(sessionId, userId, encounterId) {
  const [isConnected, setIsConnected] = useState(false);
  const [encounter, setEncounter] = useState(null);
  const [combatState, setCombatState] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId || !userId || !encounterId) return;

    const connect = async () => {
      try {
        await webSocketService.connect(sessionId, userId, encounterId);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError('Error conectando a la sesión');
        console.error('WebSocket connection error:', err);
      }
    };

    connect();

    // Set up event listeners
    const handleConnected = () => {
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
    };

    const handleError = (error) => {
      setError('Error de conexión WebSocket');
    };

    const handleInitialState = (encounterData) => {
      setEncounter(encounterData);
      if (encounterData.participantIds) {
        setParticipants(Array.from(encounterData.participantIds));
      }
      if (encounterData.combatState) {
        setCombatState(encounterData.combatState);
      }
    };

    const handleActionPerformed = (action) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'action',
        message: action.result?.description || 'Acción realizada',
        character: action.character?.name || 'Personaje',
        timestamp: new Date().toISOString()
      }]);
    };

    const handleTurnChanged = (turnData) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'turn_change',
        message: `Es el turno de ${turnData.character?.name || 'Siguiente jugador'}`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleCombatStarted = (combatData) => {
      setCombatState(combatData);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'combat',
        message: '¡Combate iniciado!',
        timestamp: new Date().toISOString()
      }]);
    };

    const handleCombatEnded = () => {
      setCombatState(null);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'combat',
        message: 'Combate finalizado',
        timestamp: new Date().toISOString()
      }]);
    };

    const handleParticipantAdded = (data) => {
      setParticipants(prev => [...prev, data.characterId]);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'participant',
        message: `Nuevo participante agregado al encuentro`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleHealthUpdate = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'health',
        message: `Salud actualizada: ${data.health} HP`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleUserJoined = (data) => {
      setConnectedUsers(prev => {
        if (!prev.find(u => u.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    };

    const handleUserLeft = (data) => {
      setConnectedUsers(prev => prev.filter(u => u.userId !== data.userId));
    };

    // Register event listeners
    webSocketService.on('connected', handleConnected);
    webSocketService.on('disconnected', handleDisconnected);
    webSocketService.on('error', handleError);
    webSocketService.on('initial_state', handleInitialState);
    webSocketService.on('action_performed', handleActionPerformed);
    webSocketService.on('turn_changed', handleTurnChanged);
    webSocketService.on('combat_started', handleCombatStarted);
    webSocketService.on('combat_ended', handleCombatEnded);
    webSocketService.on('participant_added', handleParticipantAdded);
    webSocketService.on('health_update', handleHealthUpdate);
    webSocketService.on('user_joined', handleUserJoined);
    webSocketService.on('user_left', handleUserLeft);

    // Cleanup
    return () => {
      webSocketService.off('connected', handleConnected);
      webSocketService.off('disconnected', handleDisconnected);
      webSocketService.off('error', handleError);
      webSocketService.off('initial_state', handleInitialState);
      webSocketService.off('action_performed', handleActionPerformed);
      webSocketService.off('turn_changed', handleTurnChanged);
      webSocketService.off('combat_started', handleCombatStarted);
      webSocketService.off('combat_ended', handleCombatEnded);
      webSocketService.off('participant_added', handleParticipantAdded);
      webSocketService.off('health_update', handleHealthUpdate);
      webSocketService.off('user_joined', handleUserJoined);
      webSocketService.off('user_left', handleUserLeft);
      
      webSocketService.disconnect();
      setIsConnected(false);
    };
  }, [sessionId, userId, encounterId]);

  // WebSocket actions
  const performAction = useCallback((actionData) => {
    return webSocketService.performCombatAction(actionData);
  }, []);

  const rollDice = useCallback((diceData) => {
    return webSocketService.rollDice(diceData);
  }, []);

  const addNPCToEncounter = useCallback((npcData) => {
    return webSocketService.addNPCToEncounter(npcData);
  }, []);

  const updatePlayerPosition = useCallback((playerId, position) => {
    return webSocketService.updatePlayerPosition(playerId, position);
  }, []);

  const sendMessage = useCallback((message) => {
    return webSocketService.sendMessage(message);
  }, []);

  return {
    isConnected,
    encounter,
    combatState,
    participants,
    connectedUsers,
    messages,
    error,
    performAction,
    rollDice,
    addNPCToEncounter,
    updatePlayerPosition,
    sendMessage
  };
}