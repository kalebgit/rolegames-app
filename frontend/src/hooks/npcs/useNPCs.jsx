import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useNPCs  () {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNPCs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/npcs');
      setNpcs(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los NPCs');
      console.error('Error fetching NPCs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNPCs();
  }, []);

  const deleteNPC = async (npcId) => {
    try {
      await axios.delete(`/api/npcs/${npcId}`);
      setNpcs(prev => prev.filter(npc => npc.characterId !== npcId));
      return true;
    } catch (err) {
      setError('Error al eliminar el NPC');
      return false;
    }
  };

  return {
    npcs,
    loading,
    error,
    fetchNPCs,
    deleteNPC,
    setError
  };
};
