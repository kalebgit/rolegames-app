import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig";

export default function useSessionRoom(sessionId) {
  const [session, setSession] = useState(null);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [combatState, setCombatState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSessionData = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError('');

      // Obtener datos de la sesión
      const sessionResponse = await api.get(`/api/sessions/${sessionId}`);
      setSession(sessionResponse.data);

      // Simular jugadores conectados (en una implementación real usarías WebSockets)
      setConnectedPlayers([
        { id: 1, name: 'Jugador 1', avatar: '🧙‍♂️', isReady: true },
        { id: 2, name: 'Jugador 2', avatar: '⚔️', isReady: false },
        { id: 3, name: 'Jugador 3', avatar: '🏹', isReady: true },
      ]);

      // Verificar si hay combate activo
      try {
        const combatResponse = await api.get('/api/combat/current');
        setCombatState(combatResponse.data);
      } catch (combatErr) {
        // No hay combate activo, no es un error
        setCombatState(null);
      }

    } catch (err) {
      setError('Error al cargar la sala de sesión');
      console.error('Error fetching session room:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
    
    // Simular actualizaciones en tiempo real
    const interval = setInterval(fetchSessionData, 30000); // Actualizar cada 30 segundos
    
    return () => clearInterval(interval);
  }, [sessionId]);

  const joinSession = async () => {
    try {
      // TODO: Implementar lógica para unirse a la sesión
      toast.success('Te has unido a la sesión');
    } catch (err) {
      setError('Error al unirse a la sesión');
    }
  };

  const startCombat = async (encounterId) => {
    try {
      const response = await api.post('/api/combat/start', { encounterId });
      setCombatState(response.data);
      return response.data;
    } catch (err) {
      setError('Error al iniciar combate');
      throw err;
    }
  };

  const nextTurn = async () => {
    try {
      await api.post('/api/combat/next-turn');
      // Recargar estado del combate
      const combatResponse = await api.get('/api/combat/current');
      setCombatState(combatResponse.data);
    } catch (err) {
      setError('Error al avanzar turno');
      throw err;
    }
  };

  const endCombat = async () => {
    try {
      await api.post('/api/combat/end');
      setCombatState(null);
    } catch (err) {
      setError('Error al finalizar combate');
      throw err;
    }
  };

  const castSpell = async (spellData) => {
    try {
      // TODO: Implementar lógica de lanzamiento de hechizos
      console.log('Casting spell:', spellData);
    } catch (err) {
      setError('Error al lanzar hechizo');
      throw err;
    }
  };

  const performAttack = async (attackData) => {
    try {
      // TODO: Implementar lógica de ataque
      console.log('Performing attack:', attackData);
    } catch (err) {
      setError('Error al realizar ataque');
      throw err;
    }
  };

  return {
    session,
    connectedPlayers,
    combatState,
    loading,
    error,
    joinSession,
    startCombat,
    nextTurn,
    endCombat,
    castSpell,
    performAttack,
    refreshSession: fetchSessionData,
    setError
  };
}