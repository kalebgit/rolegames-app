import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig";

export default function useSessionForm(sessionId, campaignId, onSuccess) {
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
      // Obtener el siguiente número de sesión automáticamente
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
      console.error('Error fetching session:', err);
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
        // Actualizar sesión existente usando el endpoint estándar
        response = await api.post(`/api/sessions/${sessionId}`);
        setSuccess('Sesión actualizada exitosamente');
      } else if (campaignId) {
        // Crear nueva sesión para campaña específica
        response = await api.post(`/api/sessions/campaign/${campaignId}`, session);
        setSuccess('Sesión creada exitosamente');
      } else {
        // Crear sesión sin campaña específica (fallback)
        console.error("No se identifico id para esa campania")
        setError('No se especifico una campania')
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(response.data), 1500);
      } else if (campaignId) {
        // Redirigir automáticamente a la campaña después de crear
        setTimeout(() => {
          // Usar navigate del hook useNavigate()
          navigate(`/campaigns/${campaignId}`);
        }, 1500);
      } else if (response.data?.campaignId) {
        // Si la respuesta incluye campaignId, usarlo
        setTimeout(() => {
          navigate(`/campaigns/${response.data.campaignId}`);
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al guardar la sesión';
      setError(errorMessage);
      console.error('Error saving session:', err);
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

  // Función para aplicar un template
  const applyTemplate = (templateData) => {
    setSession(prev => ({
      ...prev,
      ...templateData,
      // Mantener sessionNumber y campaignId si ya están establecidos
      sessionNumber: prev.sessionNumber,
    }));
  };

  // Función para limpiar el formulario
  const resetForm = () => {
    setSession({
      sessionNumber: 1,
      date: '',
      duration: '',
      summary: '',
      dmNotes: '',
      nextSessionObjectives: ''
    });
    setError('');
    setSuccess('');
    
    // Volver a obtener el siguiente número de sesión si hay campaignId
    if (campaignId) {
      fetchNextSessionNumber();
    }
  };

  // Función para validar el formulario
  const validateForm = () => {
    const errors = [];
    
    if (!session.sessionNumber || session.sessionNumber < 1) {
      errors.push('El número de sesión es requerido y debe ser mayor a 0');
    }
    
    if (!session.date) {
      errors.push('La fecha de la sesión es requerida');
    }
    
    if (session.duration && (session.duration < 0 || session.duration > 720)) {
      errors.push('La duración debe estar entre 0 y 720 minutos (12 horas)');
    }
    
    return errors;
  };

  // Función para verificar si el formulario tiene cambios
  const hasChanges = () => {
    if (sessionId) {
      // Comparar con los datos originales cargados
      return JSON.stringify(session) !== JSON.stringify(originalSession);
    }
    // Para nuevas sesiones, verificar si hay algún campo llenado
    return session.date || session.duration || session.summary || session.dmNotes || session.nextSessionObjectives;
  };

  // Guardar datos originales para comparación
  const [originalSession, setOriginalSession] = useState({});
  
  useEffect(() => {
    if (sessionId && session.sessionId) {
      setOriginalSession({ ...session });
    }
  }, [sessionId, session.sessionId]);

  return {
    session,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    applyTemplate,
    resetForm,
    validateForm,
    hasChanges,
    setError,
    setSuccess,
    setSession,
    // Información adicional
    isEditing: !!sessionId,
    isCreating: !sessionId,
    hasCampaign: !!campaignId
  };
}