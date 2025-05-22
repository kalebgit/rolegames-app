import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useCampaignForm(campaignId, onSuccess){
    const [campaign, setCampaign] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
        globalNotes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (campaignId) {
        fetchCampaign();
        }
    }, [campaignId]);

    const fetchCampaign = async () => {
        try {
        setLoading(true);
        const response = await api.get(`/api/campaigns/${campaignId}`);
        setCampaign(response.data);
        } catch (err) {
        setError('Error al cargar la campaña');
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
        if (campaignId) {
            await api.put(`/api/campaigns/${campaignId}`, campaign);
            setSuccess('Campaña actualizada exitosamente');
        } else {
            await api.post('/api/campaigns', campaign);
            setSuccess('Campaña creada exitosamente');
        }
        
        if (onSuccess) {
            setTimeout(() => onSuccess(), 1500);
        }
        } catch (err) {
        setError(err.response?.data?.message || 'Error al guardar la campaña');
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCampaign(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    return {
        campaign,
        loading,
        error,
        success,
        handleSubmit,
        handleChange,
        setError,
        setSuccess
    };
};
