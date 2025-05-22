import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useEncounters  () {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEncounters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/encounters');
      setEncounters(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los encuentros');
      console.error('Error fetching encounters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncounters();
  }, []);

  const deleteEncounter = async (encounterId) => {
    try {
      await api.delete(`/api/encounters/${encounterId}`);
      setEncounters(prev => prev.filter(encounter => encounter.encounterId !== encounterId));
      return true;
    } catch (err) {
      setError('Error al eliminar el encuentro');
      return false;
    }
  };

  const completeEncounter = async (encounterId) => {
    try {
      await api.patch(`/api/encounters/${encounterId}/complete`);
      setEncounters(prev => prev.map(encounter => 
        encounter.encounterId === encounterId 
          ? { ...encounter, isCompleted: true }
          : encounter
      ));
      return true;
    } catch (err) {
      setError('Error al completar el encuentro');
      return false;
    }
  };

  return {
    encounters,
    loading,
    error,
    fetchEncounters,
    deleteEncounter,
    completeEncounter,
    setError
  };
};
