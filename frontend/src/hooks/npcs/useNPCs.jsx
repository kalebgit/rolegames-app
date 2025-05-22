import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useNPCs  () {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNPCs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/npcs');
      if (response.data && Array.isArray(response.data)) {
        setNpcs(response.data);
        setError('');
      } else {
        console.error('NPCs data is not an array:', response.data);
        setNpcs([]);  // Set to empty array if data is invalid
        setError('Error: Formato de datos inválido');
      }
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
      await api.delete(`/api/npcs/${npcId}`);
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
