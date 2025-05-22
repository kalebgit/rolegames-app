import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCharacters(){
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCharacters = async () => {
        try {
        setLoading(true);
        const response = await axios.get('/api/characters');
        setCharacters(response.data);
        setError('');
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
        await axios.delete(`/api/characters/${characterId}`);
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