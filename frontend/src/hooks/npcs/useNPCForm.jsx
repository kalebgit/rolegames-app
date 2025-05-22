import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useNPCForm  (npcId, onSuccess) {
  const [npc, setNpc] = useState({
    name: '',
    race: 'HUMAN',
    level: 1,
    npcType: 'NEUTRAL',
    challengeRating: 0,
    hitPoints: 10,
    maxHitPoints: 10,
    armorClass: 10,
    experiencePoints: 0,
    speed: 30,
    alignment: 'TRUE_NEUTRAL',
    motivation: '',
    isHostile: false,
    abilities: {
      STRENGTH: 10,
      DEXTERITY: 10,
      CONSTITUTION: 10,
      INTELLIGENCE: 10,
      WISDOM: 10,
      CHARISMA: 10
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (npcId) {
      fetchNPC();
    }
  }, [npcId]);

  const fetchNPC = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/npcs/${npcId}`);
      setNpc(response.data);
    } catch (err) {
      setError('Error al cargar el NPC');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (npcId) {
        await axios.put(`/api/npcs/${npcId}`, npc);
        setSuccess('NPC actualizado exitosamente');
      } else {
        await axios.post('/api/npcs', npc);
        setSuccess('NPC creado exitosamente');
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el NPC');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNpc(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAbilityChange = (ability, value) => {
    setNpc(prev => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [ability]: parseInt(value)
      }
    }));
  };

  return {
    npc,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    handleAbilityChange,
    setError,
    setSuccess
  };
};