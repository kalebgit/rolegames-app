import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Agregar import
import api from "../../api/axiosConfig";

export default function useEncounterForm(encounterId, onSuccess) {
  const navigate = useNavigate(); // 👈 Agregar navigate
  
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
      console.error('Error fetching encounter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, sessionId = null) => { // 👈 Agregar sessionId parameter
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (encounterId) {
        // Actualizar encuentro existente
        response = await api.put(`/api/encounters/${encounterId}`, encounter);
        setSuccess('Encuentro actualizado exitosamente');
      } else {
        // Crear nuevo encuentro
        if (!sessionId) {
          throw new Error('SessionId es requerido para crear un nuevo encuentro');
        }
        
        response = await api.post('/api/encounters', {
          encounterDTO: encounter,
          sessionId: sessionId
        });
        setSuccess('Encuentro creado exitosamente');
      }
      
      if (onSuccess) {
        // Si hay callback personalizado, usarlo
        setTimeout(() => onSuccess(response.data), 1500);
      } else {
        // Redirección automática según el contexto
        setTimeout(() => {
          if (encounterId) {
            // Si estamos editando, volver al detalle del encuentro
            navigate(`/encounters/${encounterId}`);
          } else if (sessionId) {
            // Si estamos creando, ir a la session room
            navigate(`/sessions/${sessionId}/room`);
          } else if (response.data?.sessionId) {
            // Si el response incluye sessionId, usarlo
            navigate(`/sessions/${response.data.sessionId}/room`);
          } else {
            // Fallback: ir a lista de encuentros
            navigate('/encounters');
          }
        }, 1500);
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar el encuentro';
      setError(errorMessage);
      console.error('Error saving encounter:', err);
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

  // Función para limpiar el formulario
  const resetForm = () => {
    setEncounter({
      name: '',
      description: '',
      encounterType: 'COMBAT',
      difficulty: 'MEDIUM',
      isCompleted: false,
      notes: ''
    });
    setError('');
    setSuccess('');
  };

  // Función para validar el formulario
  const validateForm = () => {
    const errors = [];
    
    if (!encounter.name || encounter.name.trim().length === 0) {
      errors.push('El nombre del encuentro es requerido');
    }
    
    if (encounter.name && encounter.name.length > 100) {
      errors.push('El nombre del encuentro no puede exceder 100 caracteres');
    }
    
    if (encounter.description && encounter.description.length > 1000) {
      errors.push('La descripción no puede exceder 1000 caracteres');
    }
    
    if (!encounter.encounterType) {
      errors.push('El tipo de encuentro es requerido');
    }
    
    if (!encounter.difficulty) {
      errors.push('La dificultad es requerida');
    }
    
    return errors;
  };

  // Función para verificar si el formulario tiene cambios
  const hasChanges = () => {
    if (encounterId) {
      // Comparar con los datos originales cargados
      return JSON.stringify(encounter) !== JSON.stringify(originalEncounter);
    }
    // Para nuevos encuentros, verificar si hay algún campo llenado
    return encounter.name || encounter.description || encounter.notes;
  };

  // Guardar datos originales para comparación
  const [originalEncounter, setOriginalEncounter] = useState({});
  
  useEffect(() => {
    if (encounterId && encounter.encounterId) {
      setOriginalEncounter({ ...encounter });
    }
  }, [encounterId, encounter.encounterId]);

  return {
    encounter,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    resetForm,
    validateForm,
    hasChanges,
    setError,
    setSuccess,
    setEncounter,
    // Información adicional
    isEditing: !!encounterId,
    isCreating: !encounterId
  };
}