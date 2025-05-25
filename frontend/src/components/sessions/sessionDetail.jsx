import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionId = parseInt(id);
  
  // Role management
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  
  // Local state
  const [session, setSession] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener datos básicos de la sesión
      const sessionResponse = await api.get(`/api/sessions/${sessionId}`);
      setSession(sessionResponse.data);

      // Obtener estadísticas de la sesión
      const statsResponse = await api.get(`/api/stats/sessions/${sessionId}`);
      setSessionStats(statsResponse.data);

      // Obtener encuentros de la sesión
      const encountersResponse = await api.get(`/api/stats/sessions/${sessionId}/encounters`);
      setEncounters(encountersResponse.data);

    } catch (err) {
      setError('Error al cargar los datos de la sesión');
      console.error('Error fetching session data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = () => {
    navigate(`/sessions/${sessionId}/room`);
  };

  const handleEditSession = () => {
    navigate(`/sessions/${sessionId}/edit`);
  };

  const handleCreateEncounter = () => {
    navigate(`/encounters/new?sessionId=${sessionId}`);
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

  if (loading) {
    return <LoadingSpinner message="Cargando detalles de la sesión..." />;
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Sesión no encontrada'}</p>
            <button
              onClick={() => navigate('/sessions')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Volver a Sesiones
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Sesión #{session.sessionNumber}
                </h1>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {session.campaignName}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Fecha:</span>
                  <div>{session.date ? new Date(session.date).toLocaleDateString() : 'No programada'}</div>
                </div>
                <div>
                  <span className="font-medium">Duración:</span>
                  <div>{session.duration ? `${session.duration} min` : 'No registrada'}</div>
                </div>
                <div>
                  <span className="font-medium">Jugadores:</span>
                  <div>{session.attendingPlayerNames?.size || 0} asistentes</div>
                </div>
                <div>
                  <span className="font-medium">Encuentros:</span>
                  <div>{encounters.length} encuentros</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleJoinSession}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Unirse a Sesión
              </button>
              {isInDMMode && (
                <button
                  onClick={handleEditSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Editar Sesión
                </button>
              )}
              <button
                onClick={() => navigate(`/campaigns/${session.campaignId}`)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                ← Volver a Campaña
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas de la sesión */}
        {sessionStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <span className="text-2xl">🎲</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Encuentros</p>
                  <p className="text-2xl font-semibold text-gray-900">{sessionStats.totalEncounters}</p>
                  <p className="text-xs text-gray-500">{sessionStats.completedEncounters} completados</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <span className="text-2xl">✨</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Experiencia</p>
                  <p className="text-2xl font-semibold text-gray-900">{sessionStats.totalExperienceAwarded}</p>
                  <p className="text-xs text-gray-500">XP otorgada</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Oro</p>
                  <p className="text-2xl font-semibold text-gray-900">{sessionStats.totalGoldAwarded}</p>
                  <p className="text-xs text-gray-500">mo otorgadas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Objetos</p>
                  <p className="text-2xl font-semibold text-gray-900">{sessionStats.totalItemsAwarded}</p>
                  <p className="text-xs text-gray-500">otorgados</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de la sesión */}
        {session.summary && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resumen de la Sesión</h2>
            <p className="text-gray-700 leading-relaxed">{session.summary}</p>
          </div>
        )}

        {/* Lista de encuentros */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Encuentros</h2>
            {isInDMMode && (
              <button
                onClick={handleCreateEncounter}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Crear Encuentro
              </button>
            )}
          </div>

          {encounters.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-gray-500">No hay encuentros registrados</p>
              {isInDMMode && (
                <button
                  onClick={handleCreateEncounter}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Crear Primer Encuentro
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {encounters.map(encounter => (
                <div key={encounter.encounterId} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getEncounterTypeIcon(encounter.encounterType)}</span>
                      <h3 className="font-semibold text-gray-900">{encounter.name}</h3>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(encounter.difficulty)}`}>
                        {encounter.difficulty}
                      </span>
                      {encounter.isCompleted && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Completado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Participantes:</span>
                      <span>{encounter.participantCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recompensas:</span>
                      <span>{encounter.rewardCount}</span>
                    </div>
                    {encounter.totalExperienceReward > 0 && (
                      <div className="flex justify-between">
                        <span>XP:</span>
                        <span>{encounter.totalExperienceReward}</span>
                      </div>
                    )}
                    {encounter.totalGoldReward > 0 && (
                      <div className="flex justify-between">
                        <span>Oro:</span>
                        <span>{encounter.totalGoldReward} mo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/encounters/${encounter.encounterId}`)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-md text-sm font-medium"
                    >
                      Ver Detalles
                    </button>
                    {encounter.encounterType === 'COMBAT' && encounter.hasCombatState && (
                      <button
                        onClick={() => navigate('/combat')}
                        className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-md text-sm font-medium"
                      >
                        🗡️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Jugadores asistentes */}
        {session.attendingPlayerNames && session.attendingPlayerNames.size > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Jugadores Asistentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(session.attendingPlayerNames).map((playerName, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {playerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">{playerName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notas del DM */}
        {session.dmNotes && isInDMMode && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notas del DM</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{session.dmNotes}</p>
            </div>
          </div>
        )}

        {/* Objetivos para la próxima sesión */}
        {session.nextSessionObjectives && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Próxima Sesión</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{session.nextSessionObjectives}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}