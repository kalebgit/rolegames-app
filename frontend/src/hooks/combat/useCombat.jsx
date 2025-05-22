import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCombat  ()  {
  const [combatState, setCombatState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCombatState = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/combat/current');
      setCombatState(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setCombatState(null);
      } else {
        setError('Error al cargar el estado del combate');
      }
      console.error('Error fetching combat state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombatState();
  }, []);

  const startCombat = async (encounterData) => {
    try {
      const response = await axios.post('/api/combat/start', encounterData);
      setCombatState(response.data);
      return true;
    } catch (err) {
      setError('Error al iniciar el combate');
      return false;
    }
  };

  const nextTurn = async () => {
    try {
      await axios.post('/api/combat/next-turn');
      await fetchCombatState();
      return true;
    } catch (err) {
      setError('Error al avanzar turno');
      return false;
    }
  };

  const endCombat = async () => {
    try {
      await axios.post('/api/combat/end');
      setCombatState(null);
      return true;
    } catch (err) {
      setError('Error al finalizar combate');
      return false;
    }
  };

  const addParticipant = async (characterId, initiative) => {
    try {
      await axios.post('/api/combat/add-participant', {
        characterId,
        initiative
      });
      await fetchCombatState();
      return true;
    } catch (err) {
      setError('Error al agregar participante');
      return false;
    }
  };

  return {
    combatState,
    loading,
    error,
    fetchCombatState,
    startCombat,
    nextTurn,
    endCombat,
    addParticipant,
    setError
  };
};
