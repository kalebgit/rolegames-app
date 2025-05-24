import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  useSpells  from '../../hooks/spells/useSpells';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function SpellList() {
  const navigate = useNavigate();
  const { spells, loading, error, deleteSpell } = useSpells();
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');

  // Mostrar errores como toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const schoolColors = {
    ABJURATION: 'bg-blue-100 text-blue-800',
    CONJURATION: 'bg-green-100 text-green-800',
    DIVINATION: 'bg-purple-100 text-purple-800',
    ENCHANTMENT: 'bg-pink-100 text-pink-800',
    EVOCATION: 'bg-red-100 text-red-800',
    ILLUSION: 'bg-yellow-100 text-yellow-800',
    NECROMANCY: 'bg-gray-100 text-gray-800',
    TRANSMUTATION: 'bg-orange-100 text-orange-800'
  };

  const filteredSpells = spells.filter(spell => {
    const matchesName = spell.name.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = !levelFilter || spell.level.toString() === levelFilter;
    const matchesSchool = !schoolFilter || spell.school === schoolFilter;
    return matchesName && matchesLevel && matchesSchool;
  });

  const handleDelete = async (spellId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hechizo?')) {
      try {
        await deleteSpell(spellId);
        toast.success('Hechizo eliminado exitosamente', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        toast.error('Error al eliminar el hechizo', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const handleSpellSelect = (spellId, mode = 'view') => {
    if (mode === 'edit') {
      navigate(`/spells/${spellId}/edit`);
    } else {
      navigate(`/spells/${spellId}`);
    }
  };

  const handleCreateSpell = () => {
    navigate('/spells/new');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando hechizos..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Libro de Hechizos</h1>
            <button 
              onClick={handleCreateSpell}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Crear Hechizo
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar hechizos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los niveles</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                <option key={level} value={level}>
                  {level === 0 ? 'Truco' : `Nivel ${level}`}
                </option>
              ))}
            </select>
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las escuelas</option>
              <option value="ABJURATION">Abjuración</option>
              <option value="CONJURATION">Conjuración</option>
              <option value="DIVINATION">Adivinación</option>
              <option value="ENCHANTMENT">Encantamiento</option>
              <option value="EVOCATION">Evocación</option>
              <option value="ILLUSION">Ilusión</option>
              <option value="NECROMANCY">Nigromancia</option>
              <option value="TRANSMUTATION">Transmutación</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpells.map(spell => (
              <div key={spell.spellId} className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{spell.name}</h3>
                    <p className="text-sm text-gray-600">
                      {spell.level === 0 ? 'Truco' : `Nivel ${spell.level}`}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    schoolColors[spell.school] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {spell.school}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tiempo de lanzamiento:</span>
                    <span>{spell.castingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Alcance:</span>
                    <span>{spell.range}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duración:</span>
                    <span>{spell.duration}</span>
                  </div>
                  {spell.concentration && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Concentración:</span>
                      <span className="text-blue-600">Sí</span>
                    </div>
                  )}
                  {spell.ritual && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ritual:</span>
                      <span className="text-green-600">Sí</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                  {spell.description}
                </p>

                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => handleSpellSelect(spell.spellId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                  >
                    Ver Detalles
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleSpellSelect(spell.spellId, 'edit')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(spell.spellId)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSpells.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron hechizos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}