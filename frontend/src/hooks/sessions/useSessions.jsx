import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useSessions  ()  {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/sessions');
      setSessions(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las sesiones');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const deleteSession = async (sessionId) => {
    try {
      await api.delete(`/api/sessions/${sessionId}`);
      setSessions(prev => prev.filter(session => session.sessionId !== sessionId));
      return true;
    } catch (err) {
      setError('Error al eliminar la sesión');
      return false;
    }
  };

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    deleteSession,
    setError
  };
};