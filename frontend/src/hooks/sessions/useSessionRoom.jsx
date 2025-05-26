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
  
  // Polling for updates (simplificado sin WebSocket polling constante)
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
        const encounters = encountersResponse.data || [];
        const activeEncounter = encounters.find(enc => !enc.isCompleted);
        
        if (activeEncounter) {
          setEncounter(activeEncounter);
          setParticipants(activeEncounter.participantIds || []);
        } else {
          setEncounter(null);
          setParticipants([]);
        }
      } catch (encErr) {
        // No active encounters, that's okay
        console.log('No active encounters found');
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

    } catch (err) {
      console.error('Error fetching session data:', err);
      setError('Error al cargar la sala de sesión');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // ========================================
  // SESSION ACTIONS
  // ========================================
  const joinSession = async () => {
    try {
      // En una implementación real, esto registraría al usuario como conectado
      toast.success('Te has unido a la sesión');
      return true;
    } catch (err) {
      setError('Error al unirse a la sesión');
      return false;
    }
  };

  const leaveSession = async () => {
    try {
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
      
      // Refetch session data to get updated state
      await fetchSessionData();
      
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
      setParticipants(Array.from(response.data.participantIds || []));
      
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
      setParticipants(Array.from(response.data.participantIds || []));
      
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
      
      // Generar tiradas de iniciativa automáticas si no se proporcionan
      const rolls = Object.keys(initiativeRolls).length > 0 
        ? initiativeRolls 
        : generateAutomaticInitiativeRolls();
      
      const response = await api.post(`/api/encounters/${encounter.encounterId}/start-combat`, rolls);
      
      setEncounter(response.data);
      
      // Fetch the created combat state
      try {
        const combatResponse = await api.get('/api/combat/current');
        setCombatState(combatResponse.data);
      } catch (combatErr) {
        console.warn('Could not fetch combat state after starting combat');
      }
      
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
      try {
        const combatResponse = await api.get('/api/combat/current');
        setCombatState(combatResponse.data);
      } catch (combatErr) {
        console.warn('Could not fetch updated combat state');
      }
      
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
      try {
        const combatResponse = await api.get('/api/combat/current');
        setCombatState(combatResponse.data);
      } catch (combatErr) {
        console.warn('Could not fetch updated combat state after action');
      }
      
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
      diceResult: spellData.diceResult || true
    });
  };

  const performAttack = async (attackData) => {
    return performCombatAction({
      actionType: 'ATTACK',
      characterId: attackData.attackerId,
      targetId: attackData.targetId,
      itemId: attackData.weaponId,
      diceResult: attackData.diceResult || true
    });
  };

  const useItem = async (itemData) => {
    return performCombatAction({
      actionType: 'USE_ITEM',
      characterId: itemData.userId,
      targetId: itemData.targetId,
      itemId: itemData.itemId,
      diceResult: itemData.diceResult || true
    });
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  const refreshSession = useCallback(() => {
    fetchSessionData();
  }, [fetchSessionData]);

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

  const generateAutomaticInitiativeRolls = () => {
    const rolls = {};
    participants.forEach(participantId => {
      rolls[participantId] = Math.floor(Math.random() * 20) + 1;
    });
    return rolls;
  };

  const hasActiveEncounter = () => {
    return encounter && !encounter.isCompleted;
  };

  const hasActiveCombat = () => {
    return combatState && combatState.isActive;
  };

  const canPerformActions = () => {
    return hasActiveEncounter() && hasActiveCombat();
  };

  // ========================================
  // EFFECTS
  // ========================================
  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  // Periodic refresh for real-time updates (más conservador que antes)
  useEffect(() => {
    if (encounter && combatState?.isActive) {
      const interval = setInterval(() => {
        // Solo actualizar combat state si hay combate activo
        fetchSessionData();
      }, 5000); // Cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [encounter, combatState?.isActive, fetchSessionData]);

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
    hasActiveEncounter,
    hasActiveCombat,
    canPerformActions,
    
    // State checks
    isEncounterActive: hasActiveEncounter(),
    isCombatActive: hasActiveCombat(),
    canAct: canPerformActions()
  };
}