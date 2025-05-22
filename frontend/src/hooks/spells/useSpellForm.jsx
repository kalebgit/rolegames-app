import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useSpellForm  (spellId, onSuccess) {
  const [spell, setSpell] = useState({
    name: '',
    level: 0,
    school: 'EVOCATION',
    castingTime: '',
    range: '',
    components: [],
    duration: '',
    description: '',
    higherLevelEffects: '',
    damageType: '',
    damageDice: '',
    savingThrow: '',
    ritual: false,
    concentration: false,
    materialComponents: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (spellId) {
      fetchSpell();
    }
  }, [spellId]);

  const fetchSpell = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/spells/${spellId}`);
      setSpell(response.data);
    } catch (err) {
      setError('Error al cargar el hechizo');
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
      if (spellId) {
        await axios.put(`/api/spells/${spellId}`, spell);
        setSuccess('Hechizo actualizado exitosamente');
      } else {
        await axios.post('/api/spells', spell);
        setSuccess('Hechizo creado exitosamente');
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el hechizo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSpell(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleComponentChange = (component, isChecked) => {
    setSpell(prev => ({
      ...prev,
      components: isChecked 
        ? [...prev.components, component]
        : prev.components.filter(c => c !== component)
    }));
  };

  return {
    spell,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    handleComponentChange,
    setError,
    setSuccess
  };
};
