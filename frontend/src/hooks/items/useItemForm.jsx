import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useItemForm (itemId, onSuccess){
    const [item, setItem] = useState({
        name: '',
        description: '',
        weight: '',
        value: '',
        rarity: 'COMMON',
        requiresAttunement: false,
        isAttuned: false,
        tags: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (itemId) {
        fetchItem();
        }
    }, [itemId]);

    const fetchItem = async () => {
        try {
        setLoading(true);
        const response = await axios.get(`/api/items/${itemId}`);
        setItem(response.data);
        } catch (err) {
        setError('Error al cargar el objeto');
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
        if (itemId) {
            await axios.put(`/api/items/${itemId}`, item);
            setSuccess('Objeto actualizado exitosamente');
        } else {
            await axios.post('/api/items', item);
            setSuccess('Objeto creado exitosamente');
        }
        
        if (onSuccess) {
            setTimeout(() => onSuccess(), 1500);
        }
        } catch (err) {
        setError(err.response?.data?.message || 'Error al guardar el objeto');
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItem(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    return {
        item,
        loading,
        error,
        success,
        handleSubmit,
        handleChange,
        setError,
        setSuccess
    };
};
