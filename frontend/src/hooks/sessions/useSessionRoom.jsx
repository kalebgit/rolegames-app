import { useState, useEffect, useCallback, useRef } from 'react';
import api from "../../api/axiosConfig";
import { toast } from 'react-toastify';

export default function useSessionRoom(sessionId) {
  // Core session data
  const [session, setSession] = useState(null);
  const [encounter, setEncounter] = useState(null);
  const [combatState, setCombatState] = useState(null);
  
  // Player/participant data
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [participants, setParticipants] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // WebSocket simulation (polling for real-time updates)
  const pollIntervalRef = useRef(null);
  const [isPolling, setIsPolling] = useState(false);

  // ========================================
  // FETCH SESSION DATA
  // ========================================
  const fetchSessionData = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError('');

      // Fetch basic session info
      const sessionResponse = await api.get(`/api/sessions/${sessionId}`);
      setSession(sessionResponse.data);

      // Fetch current encounter for this session (if any)
      try {
        const encountersResponse = await api.get(`/api/encounters/session/${sessionId}`);
        const activeEncounter = encountersResponse.data.find(enc => !enc.isCompleted);
        if (activeEncounter) {
          setEncounter(activeEncounter);
          setParticipants(activeEncounter.participantIds || []);
        }
      } catch (encErr) {
        // No active encounters, that's okay
        setEncounter(null);
        setParticipants([]);
      }

      // Fetch combat state if there's an active encounter
      try {
        const combatResponse = await api.get('/api/combat/current');
        setCombatState(combatResponse.data);
      } catch (combatErr) {
        // No active combat
        setCombatState(null);
      }

      // Simulate connected players (in real implementation, this would come from WebSocket)
      setConnectedPlayers([
        { id: 1, name: 'Jugador 1', avatar: '🧙‍♂️', isReady: true, isOnline: true },
        { id: 2, name: 'Jugador 2', avatar: '⚔️', isReady: false, isOnline: true },
        { id: 3, name: 'Jugador 3', avatar: '🏹', isReady: true, isOnline: false },
      ]);

    } catch (err) {
      console.error('Error fetching session data:', err);
      setError('Error al cargar la sala de sesión');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // ========================================
  // REAL-TIME UPDATES (Polling simulation)
  // ========================================
  const startPolling = useCallback(() => {
    if (isPolling) return;
    
    setIsPolling(true);
    pollIntervalRef.current = setInterval(async () => {
      try {
        // Only poll for combat state and encounter updates
        if (encounter) {
          const encounterResponse = await api.get(`/api/encounters/${encounter.encounterId}`);
          setEncounter(encounterResponse.data);
        }

        if (combatState) {
          try {
            const combatResponse = await api.get('/api/combat/current');
            setCombatState(combatResponse.data);
          } catch {
            // Combat ended
            setCombatState(null);
          }
        }
      } catch (err) {
        console.warn('Polling error:', err);
      }
    }, 3000); // Poll every 3 seconds
  }, [encounter, combatState, isPolling]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      setIsPolling(false);
    }
  }, []);

  // ========================================
  // SESSION ACTIONS
  // ========================================
  const joinSession = async () => {
    try {
      // In a real implementation, this would register the user as connected
      toast.success('Te has unido a la sesión');
      return true;
    } catch (err) {
      setError('Error al unirse a la sesión');
      return false;
    }
  };

  const leaveSession = async () => {
    try {
      stopPolling();
      toast.info('Has salido de la sesión');
      return true;
    } catch (err) {
      setError('Error al salir de la sesión');
      return false;
    }
  };

  // ========================================
  // ENCOUNTER MANAGEMENT
  // ========================================
  const createEncounter = async (encounterData) => {
    try {
      setActionLoading(true);
      const response = await api.post('/api/encounters', {
        encounterDTO: encounterData,
        sessionId: sessionId
      });
      
      setEncounter(response.data);
      toast.success('Encuentro creado exitosamente');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al crear encuentro';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const addParticipantToEncounter = async (characterId, initiativeRoll = null) => {
    if (!encounter) {
      throw new Error('No hay encuentro activo');
    }

    try {
      setActionLoading(true);
      const url = `/api/encounters/${encounter.encounterId}/participants/${characterId}`;
      const params = initiativeRoll ? `?initiativeRoll=${initiativeRoll}` : '';
      
      const response = await api.post(url + params);
      setEncounter(response.data);
      setParticipants(response.data.participantIds || []);
      
      toast.success('Participante agregado al encuentro');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al agregar participante';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeParticipantFromEncounter = async (characterId) => {
    if (!encounter) {
      throw new Error('No hay encuentro activo');
    }

    try {
      setActionLoading(true);
      const response = await api.delete(`/api/encounters/${encounter.encounterId}/participants/${characterId}`);
      setEncounter(response.data);
      setParticipants(response.data.participantIds || []);
      
      toast.success('Participante removido del encuentro');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al remover participante';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================
  // COMBAT MANAGEMENT
  // ========================================
  const startCombat = async (initiativeRolls = {}) => {
    if (!encounter) {
      throw new Error('No hay encuentro activo para iniciar combate');
    }

    if (encounter.encounterType !== 'COMBAT') {
      throw new Error('El encuentro no es de tipo combate');
    }

    try {
      setActionLoading(true);
      const response = await api.post(`/api/encounters/${encounter.encounterId}/start-combat`, initiativeRolls);
      
      setEncounter(response.data);
      
      // Fetch the created combat state
      const combatResponse = await api.get('/api/combat/current');
      setCombatState(combatResponse.data);
      
      // Start real-time polling
      startPolling();
      
      toast.success('Combate iniciado');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar combate';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const nextTurn = async () => {
    if (!encounter) {
      throw new Error('No hay encuentro activo');
    }

    try {
      setActionLoading(true);
      const response = await api.post(`/api/encounters/${encounter.encounterId}/next-turn`);
      
      setEncounter(response.data);
      
      // Update combat state
      const combatResponse = await api.get('/api/combat/current');
      setCombatState(combatResponse.data);
      
      toast.success('Turno avanzado');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al avanzar turno';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const endCombat = async () => {
    if (!encounter) {
      throw new Error('No hay encuentro activo');
    }

    try {
      setActionLoading(true);
      const response = await api.post(`/api/encounters/${encounter.encounterId}/end-combat`);
      
      setEncounter(response.data);
      setCombatState(null);
      
      // Stop polling since combat ended
      stopPolling();
      
      toast.success('Combate finalizado');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al finalizar combate';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ========================================
  // COMBAT ACTIONS
  // ========================================
  const performCombatAction = async (actionData) => {
    if (!encounter || !combatState) {
      throw new Error('No hay combate activo');
    }

    try {
      setActionLoading(true);
      const response = await api.post(`/api/encounters/${encounter.encounterId}/perform-action`, actionData);
      
      // Refresh combat state after action
      const combatResponse = await api.get('/api/combat/current');
      setCombatState(combatResponse.data);
      
      toast.success('Acción realizada exitosamente');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al realizar acción';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const castSpell = async (spellData) => {
    return performCombatAction({
      actionType: 'CAST_SPELL',
      characterId: spellData.casterId,
      targetId: spellData.targetId,
      spellId: spellData.spellId,
      diceResult: spellData.diceResult
    });
  };

  const performAttack = async (attackData) => {
    return performCombatAction({
      actionType: 'ATTACK',
      characterId: attackData.attackerId,
      targetId: attackData.targetId,
      itemId: attackData.weaponId,
      diceResult: attackData.diceResult
    });
  };

  const useItem = async (itemData) => {
    return performCombatAction({
      actionType: 'USE_ITEM',
      characterId: itemData.userId,
      targetId: itemData.targetId,
      itemId: itemData.itemId,
      diceResult: itemData.diceResult
    });
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  const refreshSession = () => {
    fetchSessionData();
  };

  const clearError = () => {
    setError('');
  };

  const getCurrentTurnPlayer = () => {
    if (!combatState?.initiativeOrder) return null;
    return combatState.initiativeOrder.find(init => init.currentTurn);
  };

  const isPlayerTurn = (playerId) => {
    const currentTurn = getCurrentTurnPlayer();
    return currentTurn?.character?.playerId === playerId;
  };

  // ========================================
  // EFFECTS
  // ========================================
  useEffect(() => {
    fetchSessionData();
    
    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [fetchSessionData, stopPolling]);

  // Auto-start polling when combat begins
  useEffect(() => {
    if (combatState?.isActive && !isPolling) {
      startPolling();
    } else if (!combatState?.isActive && isPolling) {
      stopPolling();
    }
  }, [combatState?.isActive, isPolling, startPolling, stopPolling]);

  // ========================================
  // RETURN HOOK API
  // ========================================
  return {
    // Core data
    session,
    encounter,
    combatState,
    connectedPlayers,
    participants,
    
    // UI states
    loading,
    error,
    actionLoading,
    
    // Session actions
    joinSession,
    leaveSession,
    refreshSession,
    
    // Encounter management
    createEncounter,
    addParticipantToEncounter,
    removeParticipantFromEncounter,
    
    // Combat management
    startCombat,
    nextTurn,
    endCombat,
    
    // Combat actions
    performCombatAction,
    castSpell,
    performAttack,
    useItem,
    
    // Utility
    clearError,
    getCurrentTurnPlayer,
    isPlayerTurn,
    
    // Real-time
    isPolling,
    startPolling,
    stopPolling
  };
}