import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig";

export default function useCampaignSessionForm(campaignId, sessionId, onSuccess) {
  const [session, setSession] = useState({
    sessionNumber: 1,
    date: '',
    duration: '',
    summary: '',
    dmNotes: '',
    nextSessionObjectives: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    } else if (campaignId) {
      // Obtener el siguiente número de sesión
      fetchNextSessionNumber();
    }
  }, [sessionId, campaignId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/sessions/${sessionId}`);
      setSession(response.data);
    } catch (err) {
      setError('Error al cargar la sesión');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextSessionNumber = async () => {
    try {
      const response = await api.get(`/api/sessions/campaign/${campaignId}`);
      const sessions = response.data;
      const nextNumber = sessions.length > 0 
        ? Math.max(...sessions.map(s => s.sessionNumber)) + 1 
        : 1;
      
      setSession(prev => ({
        ...prev,
        sessionNumber: nextNumber
      }));
    } catch (err) {
      console.error('Error fetching sessions for campaign:', err);
      // No es crítico, mantener número por defecto
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (sessionId) {
        // Actualizar sesión existente
        response = await api.put(`/api/sessions/${sessionId}`, session);
        setSuccess('Sesión actualizada exitosamente');
      } else {
        // Crear nueva sesión para la campaña
        response = await api.post(`/api/sessions/campaign/${campaignId}`, session);
        setSuccess('Sesión creada exitosamente');
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(response.data), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSession(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return {
    session,
    loading,
    error,
    success,
    handleSubmit,
    handrror,
    setSuccess
  };
}