// src/hooks/useEncounterForm.js
import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useEncounterForm  (encounterId, onSuccess)  {
  const [encounter, setEncounter] = useState({
    name: '',
    description: '',
    encounterType: 'COMBAT',
    difficulty: 'MEDIUM',
    isCompleted: false,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (encounterId) {
      fetchEncounter();
    }
  }, [encounterId]);

  const fetchEncounter = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/encounters/${encounterId}`);
      setEncounter(response.data);
    } catch (err) {
      setError('Error al cargar el encuentro');
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
      if (encounterId) {
        await api.put(`/api/encounters/${encounterId}`, encounter);
        setSuccess('Encuentro actualizado exitosamente');
      } else {
        await api.post('/api/encounters', encounter);
        setSuccess('Encuentro creado exitosamente');
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el encuentro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEncounter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return {
    encounter,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    setError,
    setSuccess
  };
};
