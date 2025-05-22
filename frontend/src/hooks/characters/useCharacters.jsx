import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useCharacters(){
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCharacters = async () => {
        try {
        setLoading(true);
        const response = await api.get('/api/characters');
        if (response.data && Array.isArray(response.data)) {
            setCharacters(response.data);
            setError('');
        } else {
            console.error('Characters data is not an array:', response.data);
            setCharacters([]);  // Set to empty array if data is invalid
            setError('Error: Formato de datos inválido');
        }
        } catch (err) {
        setError('Error al cargar los personajes');
        console.error('Error fetching characters:', err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const deleteCharacter = async (characterId) => {
        try {
        await api.delete(`/api/characters/${characterId}`);
        setCharacters(prev => prev.filter(char => char.characterId !== characterId));
        return true;
        } catch (err) {
        setError('Error al eliminar el personaje');
        return false;
        }
    };

    return {
        characters,
        loading,
        error,
        fetchCharacters,
        deleteCharacter,
        setError
    };
};