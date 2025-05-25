import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig";

export default function useCampaignStats(campaignId) {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCampaignStats = async () => {
    if (!campaignId) return;
    
    try {
      setLoading(true);
      setError('');

      // Obtener estadísticas de la campaña
      const statsResponse = await api.get(`/api/stats/campaigns/${campaignId}`);
      setStats(statsResponse.data);

      // Obtener resumen de sesiones
      const sessionsResponse = await api.get(`/api/stats/campaigns/${campaignId}/sessions`);
      setSessions(sessionsResponse.data);

    } catch (err) {
      setError('Error al cargar las estadísticas de la campaña');
      console.error('Error fetching campaign stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignStats();
  }, [campaignId]);

  const refreshStats = () => {
    fetchCampaignStats();
  };

  return {
    stats,
    sessions,
    loading,
    error,
    refreshStats,
    setError
  };
}