import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';

export default function EncounterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const encounterId = parseInt(id);
  
  // Role management
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  
  // Local state
  const [encounter, setEncounter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEncounter();
  }, [encounterId]);

  const fetchEncounter = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/api/encounters/${encounterId}`);
      setEncounter(response.data);

    } catch (err) {
      setError('Error al cargar el encuentro');
      console.error('Error fetching encounter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCombat = async () => {
    if (!isInDMMode) {
      toast.error('Solo el DM puede iniciar combate');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/api/encounters/${encounterId}/start-combat`);
      toast.success('Combate iniciado');
      navigate('/combat');
    } catch (err) {
      toast.error('Error al iniciar combate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteEncounter = async () => {
    if (!isInDMMode) {
      toast.error('Solo el DM puede completar encuentros');
      return;
    }

    if (!window.confirm('¿Marcar este encuentro como completado?')) {
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/api/encounters/${encounterId}/complete`);
      toast.success('Encuentro completado');
      fetchEncounter();
    } catch (err) {
      toast.error('Error al completar encuentro');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditEncounter = () => {
    navigate(`/encounters/${encounterId}/edit`);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      TRIVIAL: 'bg-green-100 text-green-800',
      EASY: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HARD: 'bg-orange-100 text-orange-800',
      DEADLY: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getEncounterTypeColor = (type) => {
    const colors = {
      COMBAT: 'bg-red-100 text-red-800',
      SOCIAL: 'bg-blue-100 text-blue-800',
      PUZZLE: 'bg-purple-100 text-purple-800',
      TRAP: 'bg-orange-100 text-orange-800',
      EXPLORATION: 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getEncounterTypeIcon = (type) => {
    const icons = {
      COMBAT: '⚔️',
      SOCIAL: '💬',
      PUZZLE: '🧩',
      TRAP: '🕳️',
      EXPLORATION: '🗺️'
    };
    return icons[type] || '❓';
  };

  const getRewardTypeIcon = (type) => {
    const icons = {
      EXPERIENCE: '✨',
      GOLD: '💰',
      ITEM: '📦'
    };
    return icons[type] || '🎁';
  };

  if (loading) {
    return <LoadingSpinner message="Cargando encuentro..." />;
  }

  if (error || !encounter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Encuentro no encontrado'}</p>
            <button
              onClick={() => navigate('/encounters')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Volver a Encuentros
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl">{getEncounterTypeIcon(encounter.encounterType)}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{encounter.name}</h1>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEncounterTypeColor(encounter.encounterType)}`}>
                      {encounter.encounterType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(encounter.difficulty)}`}>
                      {encounter.difficulty}
                    </span>
                    {encounter.isCompleted && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        ✓ Completado
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {encounter.description && (
                <p className="text-gray-700 leading-relaxed max-w-3xl">
                  {encounter.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col space-y-3">
              {isInDMMode && !encounter.isCompleted && encounter.encounterType === 'COMBAT' && (
                <button
                  onClick={handleStartCombat}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Iniciando...' : 'Iniciar Combate'}
                </button>
              )}
              
              {isInDMMode && !encounter.isCompleted && (
                <button
                  onClick={handleCompleteEncounter}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Completando...' : 'Completar'}
                </button>
              )}
              
              {isInDMMode && (
                <button
                  onClick={handleEditEncounter}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Editar
                </button>
              )}
              
              <button
                onClick={() => navigate('/encounters')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                ← Volver
              </button>
            </div>
          </div>
        </div>

        {/* Información del encuentro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo:</span>
                <span className="font-medium">{encounter.encounterType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dificultad:</span>
                <span className="font-medium">{encounter.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Participantes:</span>
                <span className="font-medium">{encounter.participantIds?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Recompensas:</span>
                <span className="font-medium">{encounter.rewards?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado:</span>
                <span className={encounter.isCompleted ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                  {encounter.isCompleted ? 'Completado' : 'Pendiente'}
                </span>
              </div>
              {encounter.hasCombatState && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Combate:</span>
                  <span className="text-red-600 font-medium">Activo</span>
                </div>
              )}
            </div>
          </div>

          {/* Participantes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Participantes</h2>
            {encounter.participantIds && encounter.participantIds.length > 0 ? (
              <div className="space-y-2">
                {encounter.participantIds.map((participantId, index) => (
                  <div key={participantId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-700">Participante #{participantId}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">👥</div>
                <p className="text-gray-500">No hay participantes</p>
                {isInDMMode && (
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                    Agregar Participantes
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Estado del combate */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado del Combate</h2>
            {encounter.hasCombatState ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium">Combate Activo</span>
                </div>
                <button
                  onClick={() => navigate('/combat')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  Ir al Combate
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">⚔️</div>
                <p className="text-gray-500">Sin combate activo</p>
                {isInDMMode && encounter.encounterType === 'COMBAT' && !encounter.isCompleted && (
                  <button
                    onClick={handleStartCombat}
                    disabled={actionLoading}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                  >
                    Iniciar Combate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recompensas */}
        {encounter.rewards && encounter.rewards.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recompensas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {encounter.rewards.map(reward => (
                <div key={reward.rewardId} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getRewardTypeIcon(reward.rewardType)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        reward.claimed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reward.claimed ? 'Reclamada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {reward.experienceAmount && (
                      <div className="flex justify-between">
                        <span>Experiencia:</span>
                        <span className="font-medium">{reward.experienceAmount} XP</span>
                      </div>
                    )}
                    {reward.goldAmount && (
                      <div className="flex justify-between">
                        <span>Oro:</span>
                        <span className="font-medium">{reward.goldAmount} mo</span>
                      </div>
                    )}
                    {reward.itemName && (
                      <div className="flex justify-between">
                        <span>Objeto:</span>
                        <span className="font-medium">{reward.itemName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notas del encuentro */}
        {encounter.notes && isInDMMode && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notas del DM</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{encounter.notes}</p>
            </div>
          </div>
        )}

        {/* Acciones rápidas para el DM */}
        {isInDMMode && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Acciones del DM</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {!encounter.isCompleted && (
                <>
                  <button
                    onClick={handleCompleteEncounter}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
                  >
                    ✓ Completar Encuentro
                  </button>
                  
                  {encounter.encounterType === 'COMBAT' && !encounter.hasCombatState && (
                    <button
                      onClick={handleStartCombat}
                      disabled={actionLoading}
                      className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
                    >
                      ⚔️ Iniciar Combate
                    </button>
                  )}
                </>
              )}
              
              <button
                onClick={handleEditEncounter}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
              >
                ✏️ Editar Encuentro
              </button>
              
              <button
                onClick={() => navigate(`/encounters/new?copyFrom=${encounterId}`)}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium"
              >
                📋 Duplicar Encuentro
              </button>
            </div>
            
            {encounter.hasCombatState && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-red-800">Combate en curso</span>
                </div>
                <p className="text-red-700 text-sm mb-3">
                  Este encuentro tiene un combate activo. Puedes monitorearlo o controlarlo desde el rastreador de combate.
                </p>
                <button
                  onClick={() => navigate('/combat')}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  Ir al Rastreador de Combate
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}