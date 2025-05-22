import React from 'react';
import { useNavigate } from 'react-router-dom';
import  useCampaigns  from '../../hooks/campaigns/useCampaigns';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CampaignList() {
  const navigate = useNavigate();
  const { campaigns, loading, error, deleteCampaign } = useCampaigns();

  const handleDelete = async (campaignId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta campaña?')) {
      await deleteCampaign(campaignId);
    }
  };

  const handleCampaignSelect = (campaignId, mode = 'view') => {
    if (mode === 'edit') {
      navigate(`/campaigns/${campaignId}/edit`);
    } else {
      navigate(`/campaigns/${campaignId}`);
    }
  };

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando campañas..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mis Campañas</h1>
            <button 
              onClick={handleCreateCampaign}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Nueva Campaña
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaigns.map(campaign => (
              <div key={campaign.campaignId} className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">
                      DM: {campaign.dungeonMaster?.username}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.isActive ? 'Activa' : 'Finalizada'}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {campaign.description || 'Sin descripción disponible'}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha de inicio:</span>
                    <span>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'No definida'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jugadores:</span>
                    <span>{campaign.players?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sesiones:</span>
                    <span>{campaign.sessions?.length || 0}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button 
                    onClick={() => handleCampaignSelect(campaign.campaignId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                  >
                    Ver Campaña
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleCampaignSelect(campaign.campaignId, 'edit')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(campaign.campaignId)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {campaigns.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2h0l.5-.5" />
                </svg>
              </div>
              <p className="text-gray-500">No tienes campañas creadas</p>
              <p className="text-gray-400 text-sm mt-2">Crea tu primera campaña para comenzar tu aventura</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}