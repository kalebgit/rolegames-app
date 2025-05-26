import { useState, useEffect } from 'react';

class WebSocketService {
  constructor() {
    this.listeners = new Map();
    this.isConnected = false;
    this.sessionId = null;
    this.userId = null;
    this.simulatedPlayers = [];
  }

  // ========================================
  // CONNECTION MANAGEMENT
  // ========================================
  connect(sessionId, userId) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.isConnected = true;
    
    // Simulate connection
    console.log(`🔌 WebSocket: Connected to session ${sessionId} as user ${userId}`);
    
    // Emit connection event
    this.emit('connected', { sessionId, userId });
    
    // Simulate other players in the session
    this.simulateInitialState();
    
    return Promise.resolve();
  }

  disconnect() {
    this.isConnected = false;
    this.sessionId = null;
    this.userId = null;
    this.listeners.clear();
    
    console.log('🔌 WebSocket: Disconnected');
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
  // SESSION EVENTS
  // ========================================
  sendMessage(type, data) {
    if (!this.isConnected) {
      console.warn('WebSocket: Not connected, cannot send message');
      return;
    }

    const message = {
      type,
      data,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString()
    };

    console.log('📤 WebSocket: Sending message', message);

    // Simulate server processing and broadcast to other clients
    setTimeout(() => {
      this.simulateServerResponse(message);
    }, 100);
  }

  // ========================================
  // SPECIFIC GAME ACTIONS
  // ========================================
  addNPCToEncounter(npcData) {
    this.sendMessage('ADD_NPC_TO_ENCOUNTER', {
      npc: npcData,
      encounterId: this.getCurrentEncounterId()
    });
  }

  updatePlayerPosition(playerId, position) {
    this.sendMessage('PLAYER_POSITION_UPDATE', {
      playerId,
      position
    });
  }

  performAction(actionData) {
    this.sendMessage('COMBAT_ACTION', actionData);
  }

  rollDice(diceData) {
    this.sendMessage('DICE_ROLL', diceData);
  }

  updateCharacterStatus(characterId, status) {
    this.sendMessage('CHARACTER_STATUS_UPDATE', {
      characterId,
      status
    });
  }

  // ========================================
  // SIMULATION METHODS
  // ========================================
  simulateInitialState() {
    // Simulate existing players in the session
    this.simulatedPlayers = [
      { 
        id: 1, 
        userId: 'user1', 
        name: 'Jugador 1', 
        avatar: '🧙‍♂️', 
        isReady: true, 
        position: { x: 20, y: 50 },
        isOnline: true 
      },
      { 
        id: 2, 
        userId: 'user2', 
        name: 'Jugador 2', 
        avatar: '⚔️', 
        isReady: false, 
        position: { x: 80, y: 30 },
        isOnline: true 
      },
      { 
        id: 3, 
        userId: 'user3', 
        name: 'Jugador 3', 
        avatar: '🏹', 
        isReady: true, 
        position: { x: 80, y: 70 },
        isOnline: false 
      }
    ];

    // Emit initial player list
    setTimeout(() => {
      this.emit('players_updated', this.simulatedPlayers);
    }, 500);

    // Simulate periodic updates
    this.startSimulatedUpdates();
  }

  simulateServerResponse(message) {
    switch (message.type) {
      case 'ADD_NPC_TO_ENCOUNTER':
        // Simulate NPC being added
        this.emit('npc_added_to_encounter', {
          npc: message.data.npc,
          encounterId: message.data.encounterId,
          addedBy: message.userId
        });
        
        // Simulate encounter update
        setTimeout(() => {
          this.emit('encounter_updated', {
            encounterId: message.data.encounterId,
            participants: [...this.getCurrentParticipants(), message.data.npc.id]
          });
        }, 200);
        break;

      case 'PLAYER_POSITION_UPDATE':
        // Update player position in simulated state
        const playerIndex = this.simulatedPlayers.findIndex(p => p.id === message.data.playerId);
        if (playerIndex > -1) {
          this.simulatedPlayers[playerIndex].position = message.data.position;
        }
        
        // Broadcast to other clients
        this.emit('player_position_updated', {
          playerId: message.data.playerId,
          position: message.data.position,
          updatedBy: message.userId
        });
        break;

      case 'COMBAT_ACTION':
        // Simulate combat action result
        this.emit('combat_action_performed', {
          action: message.data,
          result: this.simulateCombatResult(message.data),
          performedBy: message.userId
        });
        break;

      case 'DICE_ROLL':
        // Broadcast dice roll to all players
        this.emit('dice_rolled', {
          ...message.data,
          rolledBy: message.userId
        });
        break;

      case 'CHARACTER_STATUS_UPDATE':
        // Broadcast character status change
        this.emit('character_status_updated', {
          characterId: message.data.characterId,
          status: message.data.status,
          updatedBy: message.userId
        });
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  simulateCombatResult(actionData) {
    // Simple combat result simulation
    const success = Math.random() > 0.3; // 70% success rate
    const damage = success ? Math.floor(Math.random() * 10) + 1 : 0;
    
    return {
      success,
      damage,
      description: success 
        ? `Acción exitosa causando ${damage} puntos de daño`
        : 'La acción falló'
    };
  }

  startSimulatedUpdates() {
    // Simulate periodic player updates
    setInterval(() => {
      if (this.isConnected && Math.random() > 0.7) {
        // Randomly update a player's ready status
        const randomPlayer = this.simulatedPlayers[Math.floor(Math.random() * this.simulatedPlayers.length)];
        if (randomPlayer) {
          randomPlayer.isReady = !randomPlayer.isReady;
          this.emit('player_ready_status_changed', {
            playerId: randomPlayer.id,
            isReady: randomPlayer.isReady
          });
        }
      }
    }, 5000);

    // Simulate occasional new messages
    setInterval(() => {
      if (this.isConnected && Math.random() > 0.8) {
        this.emit('system_message', {
          message: 'El DM está preparando el siguiente encuentro...',
          type: 'info',
          timestamp: new Date().toISOString()
        });
      }
    }, 15000);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  getCurrentEncounterId() {
    // In a real implementation, this would be tracked properly
    return 'encounter_123';
  }

  getCurrentParticipants() {
    // In a real implementation, this would return actual participant IDs
    return [1, 2, 3];
  }

  getConnectedPlayers() {
    return this.simulatedPlayers.filter(player => player.isOnline);
  }

  isConnectedToSession() {
    return this.isConnected && this.sessionId !== null;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

// React Hook for WebSocket
export function useWebSocket(sessionId, userId) {
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId || !userId) return;

    const connect = async () => {
      try {
        await webSocketService.connect(sessionId, userId);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError('Error connecting to session');
        console.error('WebSocket connection error:', err);
      }
    };

    connect();

    // Set up event listeners
    const handleConnected = () => {
      setIsConnected(true);
    };

    const handlePlayersUpdated = (updatedPlayers) => {
      setPlayers(updatedPlayers);
    };

    const handlePlayerPositionUpdated = (data) => {
      setPlayers(prev => prev.map(player => 
        player.id === data.playerId 
          ? { ...player, position: data.position }
          : player
      ));
    };

    const handlePlayerReadyStatusChanged = (data) => {
      setPlayers(prev => prev.map(player => 
        player.id === data.playerId 
          ? { ...player, isReady: data.isReady }
          : player
      ));
    };

    const handleNPCAddedToEncounter = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'npc_added',
        message: `${data.npc.name} ha sido agregado al encuentro`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleCombatActionPerformed = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'combat_action',
        message: `Acción de combate: ${data.result.description}`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleDiceRolled = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'dice_roll',
        message: `🎲 Tirada de dados: ${data.total}`,
        timestamp: new Date().toISOString()
      }]);
    };

    const handleSystemMessage = (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        message: data.message,
        timestamp: data.timestamp
      }]);
    };

    // Register event listeners
    webSocketService.on('connected', handleConnected);
    webSocketService.on('players_updated', handlePlayersUpdated);
    webSocketService.on('player_position_updated', handlePlayerPositionUpdated);
    webSocketService.on('player_ready_status_changed', handlePlayerReadyStatusChanged);
    webSocketService.on('npc_added_to_encounter', handleNPCAddedToEncounter);
    webSocketService.on('combat_action_performed', handleCombatActionPerformed);
    webSocketService.on('dice_rolled', handleDiceRolled);
    webSocketService.on('system_message', handleSystemMessage);

    // Cleanup
    return () => {
      webSocketService.off('connected', handleConnected);
      webSocketService.off('players_updated', handlePlayersUpdated);
      webSocketService.off('player_position_updated', handlePlayerPositionUpdated);
      webSocketService.off('player_ready_status_changed', handlePlayerReadyStatusChanged);
      webSocketService.off('npc_added_to_encounter', handleNPCAddedToEncounter);
      webSocketService.off('combat_action_performed', handleCombatActionPerformed);
      webSocketService.off('dice_rolled', handleDiceRolled);
      webSocketService.off('system_message', handleSystemMessage);
      
      webSocketService.disconnect();
      setIsConnected(false);
    };
  }, [sessionId, userId]);

  // WebSocket actions
  const sendMessage = (type, data) => {
    webSocketService.sendMessage(type, data);
  };

  const addNPCToEncounter = (npcData) => {
    webSocketService.addNPCToEncounter(npcData);
  };

  const updatePlayerPosition = (playerId, position) => {
    webSocketService.updatePlayerPosition(playerId, position);
  };

  const performAction = (actionData) => {
    webSocketService.performAction(actionData);
  };

  const rollDice = (diceData) => {
    webSocketService.rollDice(diceData);
  };

  const updateCharacterStatus = (characterId, status) => {
    webSocketService.updateCharacterStatus(characterId, status);
  };

  return {
    isConnected,
    players,
    messages,
    error,
    sendMessage,
    addNPCToEncounter,
    updatePlayerPosition,
    performAction,
    rollDice,
    updateCharacterStatus
  };
}