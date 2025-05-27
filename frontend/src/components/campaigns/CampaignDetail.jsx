import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';
import useCampaignStats from '../../hooks/campaigns/useCampaignStats';
import LoadingSpinner from '../common/LoadingSpinner';
import CampaignInvitationModal from './CampaignInvitationModal'; // 👈 Agregar esta línea
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';
import { useUserStore } from '../../stores/useUserStore';
import { useRoleAwareData } from '../../hooks/useRoleAwareData';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaignId = parseInt(id);
  
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  const currentRole = useRoleStore(state => state.currentRole);

  const user = useUserStore(state=>state.user)


  const { stats, sessions, loading, error, refreshStats } = useCampaignStats(campaignId);

  useRoleAwareData(refreshStats)
  
  const [campaign, setCampaign] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false); 
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [isIn, setIsIn] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/api/campaigns/${campaignId}`);
        const actualCampaign = response.data
        const responseCampaigns = await api.get("/api/campaigns")
        const campaigns = responseCampaigns.data
        if (campaigns.some(c => c.campaignId === actualCampaign.campaignId)) {
          setIsIn(true);
        }
        setCampaign(actualCampaign);
      } catch (err) {
        toast.error('Error al cargar la campaña');
      } finally {
        setLoadingCampaign(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const handleJoinCampaign = async () => {
    try {
      console.log(user)
      const response = await api.post(`/api/campaigns/${campaignId}/players/${user.userId}`);
      if (response.status === 200) {
        setIsIn(true);
        toast.success('Te has unido a la campaña correctamente');
        refreshStats(); 
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error al unirte a la campaña';
      toast.error(msg);
    }
  };
  

  const handleCreateSession = () => {
    navigate(`/campaigns/${campaignId}/sessions/new`);
  };

  const handleJoinSession = (sessionId) => {
    navigate(`/sessions/${sessionId}/room`);
  };

  // 👈 Agregar estas funciones
  const handleInvitePlayer = () => {
    if (!isInDMMode()) {
      toast.error('Solo el DM puede invitar jugadores');
      return;
    }
    setInviteModalOpen(true);
  };

  const handleInvitationSent = (notification) => {
    toast.success('¡Invitación enviada exitosamente!');
    console.log('Invitación enviada:', notification);
    // se pdorai llamar refreshStats() para actualizar la UI
  };

  const getSessionStatus = (session) => {
    if (session.status === 'COMPLETED') return 'Completada';
    if (session.status === 'IN_PROGRESS') return 'En Progreso';
    if (session.status === 'PLANNED') return 'Programada';
    return 'Pendiente';
  };

  const getSessionStatusColor = (session) => {
    if (session.status === 'COMPLETED') return 'bg-green-100 text-green-800';
    if (session.status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800';
    if (session.status === 'PLANNED') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading || loadingCampaign) {
    return <LoadingSpinner message="Cargando campaña..." />;
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Campaña no encontrada'}</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Volver a Campañas
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
                <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  campaign.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.isActive ? 'Activa' : 'Finalizada'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{campaign.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>DM: {campaign.dungeonMasterName}</span>
                <span>Inicio: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'No definida'}</span>
                <span>Jugadores: {stats?.activePlayerCount || 0}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleInvitePlayer}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Invitar Jugadores
              </button>
              {!isIn && (
                <button
                  onClick={handleJoinCampaign}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Unirse a Campaña
                </button>
              )}
              {isInDMMode() && (
                <button
                  onClick={handleCreateSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Nueva Sesión
                </button>
              )}
              <button
                onClick={() => navigate('/campaigns')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                ← Volver
              </button>
            </div>

          </div>
        </div>

        {/* Estadísticas de la campaña */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Sesiones</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalSessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <span className="text-2xl">⚔️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Encuentros</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalEncounters}</p>
                  <p className="text-xs text-gray-500">{stats.completedEncounters} completados</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalExperienceAwarded}</p>
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
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalGoldAwarded}</p>
                  <p className="text-xs text-gray-500">mo otorgadas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de sesiones */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Sesiones</h2>
            {stats?.averageSessionDuration && (
              <span className="text-sm text-gray-500">
                Duración promedio: {Math.round(stats.averageSessionDuration)} min
              </span>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No hay sesiones registradas</p>
              {isInDMMode() && (
                <button
                  onClick={handleCreateSession}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Crear Primera Sesión
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <div key={session.sessionId} className="border rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Sesión #{session.sessionNumber}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSessionStatusColor(session)}`}>
                          {getSessionStatus(session)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
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
                          <div>{session.playerCount}</div>
                        </div>
                        <div>
                          <span className="font-medium">Encuentros:</span>
                          <div>{session.encounterCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6 flex space-x-2">
                      {session.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleJoinSession(session.sessionId)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Unirse
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/sessions/${session.sessionId}`)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md text-sm"
                      >
                        Ver Detalles
                      </button>
                      {isInDMMode() && (
                        <button
                          onClick={() => navigate(`/sessions/${session.sessionId}/edit`)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <CampaignInvitationModal 
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          campaign={campaign}
          onInvitationSent={handleInvitationSent}
        />
      </div>
    </div>
  );
}