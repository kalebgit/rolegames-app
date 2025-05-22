import { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"

export default function useCharacterForm(characterId, onSuccess){
    const [character, setCharacter] = useState({
        name: '',
        race: 'HUMAN',
        level: 1,
        characterClass: 'FIGHTER',
        experiencePoints: 0,
        hitPoints: 10,
        maxHitPoints: 10,
        armorClass: 10,
        proficiencyBonus: 2,
        speed: 30,
        alignment: 'TRUE_NEUTRAL',
        background: '',
        backstory: '',
        abilities: {
        STRENGTH: 10,
        DEXTERITY: 10,
        CONSTITUTION: 10,
        INTELLIGENCE: 10,
        WISDOM: 10,
        CHARISMA: 10
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (characterId) {
        fetchCharacter();
        }
    }, [characterId]);

    const fetchCharacter = async () => {
        try {
        setLoading(true);
        const response = await api.get(`/api/characters/${characterId}`);
        setCharacter(response.data);
        } catch (err) {
        setError('Error al cargar el personaje');
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
        if (characterId) {
            await api.put(`/api/characters/${characterId}`, character);
            setSuccess('Personaje actualizado exitosamente');
        } else {
            await api.post('/api/characters', character);
            setSuccess('Personaje creado exitosamente');
        }
        
        if (onSuccess) {
            setTimeout(() => onSuccess(), 1500);
        }
        } catch (err) {
        setError(err.response?.data?.message || 'Error al guardar el personaje');
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCharacter(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleAbilityChange = (ability, value) => {
        setCharacter(prev => ({
        ...prev,
        abilities: {
            ...prev.abilities,
            [ability]: parseInt(value)
        }
        }));
    };

    return {
        character,
        loading,
        error,
        success,
        handleSubmit,
        handleChange,
        handleAbilityChange,
        setError,
        setSuccess
    };
};
