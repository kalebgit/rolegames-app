import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useSessionForm  (sessionId, onSuccess)  {
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
    }
  }, [sessionId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (sessionId) {
        await api.put(`/api/sessions/${sessionId}`, session);
        setSuccess('Sesión actualizada exitosamente');
      } else {
        await api.post('/api/sessions', session);
        setSuccess('Sesión creada exitosamente');
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
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
    handleChange,
    setError,
    setSuccess
  };
};
