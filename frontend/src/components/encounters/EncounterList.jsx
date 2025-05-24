import React, { useState } from 'react';
import  useEncounters  from '../../hooks/encounters/useEncounters';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';


export default function EncounterList({ onEncounterSelect, onCreateEncounter, onStartCombat }) {

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const { encounters, loading, error, deleteEncounter, completeEncounter } = useEncounters();
  const [typeFilter, setTypeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const difficultyColors = {
    TRIVIAL: 'bg-green-100 text-green-800',
    EASY: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HARD: 'bg-orange-100 text-orange-800',
    DEADLY: 'bg-red-100 text-red-800'
  };

  const typeColors = {
    COMBAT: 'bg-red-100 text-red-800',
    SOCIAL: 'bg-blue-100 text-blue-800',
    PUZZLE: 'bg-purple-100 text-purple-800',
    TRAP: 'bg-orange-100 text-orange-800',
    EXPLORATION: 'bg-green-100 text-green-800'
  };

  const filteredEncounters = encounters.filter(encounter => {
    const matchesType = !typeFilter || encounter.encounterType === typeFilter;
    const matchesDifficulty = !difficultyFilter || encounter.difficulty === difficultyFilter;
    return matchesType && matchesDifficulty;
  });


  const handleDelete = async (encounterId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este encuentro?')) {
      try {
        await deleteEncounter(encounterId);
        toast.success('Encuentro eliminado exitosamente', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        toast.error('Error al eliminar el encuentro', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };
  

  const handleComplete = async (encounterId) => {
    if (window.confirm('¿Marcar este encuentro como completado?')) {
      try {
        await completeEncounter(encounterId);
        toast.success('Encuentro marcado como completado', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        toast.error('Error al completar el encuentro', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const handleStartCombat = (encounter) => {
    if (encounter.encounterType === 'COMBAT' && onStartCombat) {
      onStartCombat(encounter);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando encuentros..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Encuentros</h1>
            <button 
              onClick={onCreateEncounter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Crear Encuentro
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="COMBAT">Combate</option>
              <option value="SOCIAL">Social</option>
              <option value="PUZZLE">Acertijo</option>
              <option value="TRAP">Trampa</option>
              <option value="EXPLORATION">Exploración</option>
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las dificultades</option>
              <option value="TRIVIAL">Trivial</option>
              <option value="EASY">Fácil</option>
              <option value="MEDIUM">Medio</option>
              <option value="HARD">Difícil</option>
              <option value="DEADLY">Mortal</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEncounters.map(encounter => (
              <div key={encounter.encounterId} className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{encounter.name}</h3>
                  <div className="flex flex-col space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      typeColors[encounter.encounterType] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {encounter.encounterType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      difficultyColors[encounter.difficulty] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {encounter.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {encounter.description || 'Sin descripción'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className={encounter.isCompleted ? 'text-green-600' : 'text-orange-600'}>
                      {encounter.isCompleted ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                  {encounter.participants?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Participantes:</span>
                      <span>{encounter.participants.length}</span>
                    </div>
                  )}
                  {encounter.rewards?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Recompensas:</span>
                      <span>{encounter.rewards.length}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => onEncounterSelect(encounter.encounterId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                  >
                    Ver Detalles
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onEncounterSelect(encounter.encounterId, 'edit')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    {encounter.encounterType === 'COMBAT' && !encounter.isCompleted && (
                      <button 
                        onClick={() => handleStartCombat(encounter)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md text-sm"
                      >
                        Iniciar Combate
                      </button>
                    )}
                  </div>
                  {!encounter.isCompleted && (
                    <button 
                      onClick={() => handleComplete(encounter.encounterId)}
                      className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-md text-sm"
                    >
                      Marcar Completado
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(encounter.encounterId)}
                    className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEncounters.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron encuentros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}