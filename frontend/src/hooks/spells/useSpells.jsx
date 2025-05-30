import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useSpells  ()  {
  const [spells, setSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSpells = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/spells');
      setSpells(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los hechizos');
      console.error('Error fetching spells:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpells();
  }, []);

  const deleteSpell = async (spellId) => {
    try {
      await api.delete(`/api/spells/${spellId}`);
      setSpells(prev => prev.filter(spell => spell.spellId !== spellId));
      return true;
    } catch (err) {
      setError('Error al eliminar el hechizo');
      return false;
    }
  };

  return {
    spells,
    loading,
    error,
    fetchSpells,
    deleteSpell,
    setError
  };
};
