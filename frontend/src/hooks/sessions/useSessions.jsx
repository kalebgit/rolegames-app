import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useSessions  ()  {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sessions');
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
      await axios.delete(`/api/sessions/${sessionId}`);
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