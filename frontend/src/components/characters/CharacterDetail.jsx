// frontend/src/components/characters/CharacterDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/characters/${id}`);
      setCharacter(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar el personaje');
      console.error('Error fetching character:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAbilityModifier = (score) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  const getRaceDisplayName = (race) => {
    const raceNames = {
      HUMAN: 'Humano',
      ELF: 'Elfo',
      DWARF: 'Enano',
      HALFLING: 'Mediano',
      GNOME: 'Gnomo',
      HALF_ELF: 'Medio elfo',
      HALF_ORC: 'Medio orco',
      TIEFLING: 'Tiefling',
      DRAGONBORN: 'Dracónido'
    };
    return raceNames[race] || race;
  };

  const getClassDisplayName = (characterClass) => {
    const classNames = {
      BARBARIAN: 'Bárbaro',
      BARD: 'Bardo',
      CLERIC: 'Clérigo',
      DRUID: 'Druida',
      FIGHTER: 'Guerrero',
      MONK: 'Monje',
      PALADIN: 'Paladín',
      RANGER: 'Explorador',
      ROGUE: 'Pícaro',
      SORCERER: 'Hechicero',
      WARLOCK: 'Brujo',
      WIZARD: 'Mago'
    };
    return classNames[characterClass] || characterClass;
  };

  const getAlignmentDisplayName = (alignment) => {
    const alignmentNames = {
      LAWFUL_GOOD: 'Legal Bueno',
      NEUTRAL_GOOD: 'Neutral Bueno',
      CHAOTIC_GOOD: 'Caótico Bueno',
      LAWFUL_NEUTRAL: 'Legal Neutral',
      TRUE_NEUTRAL: 'Neutral Verdadero',
      CHAOTIC_NEUTRAL: 'Caótico Neutral',
      LAWFUL_EVIL: 'Legal Malvado',
      NEUTRAL_EVIL: 'Neutral Malvado',
      CHAOTIC_EVIL: 'Caótico Malvado'
    };
    return alignmentNames[alignment] || alignment;
  };

  if (loading) {
    return <LoadingSpinner message="Cargando personaje..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/characters')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Volver a la Lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Personaje no encontrado</h1>
            <button
              onClick={() => navigate('/characters')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Volver a la Lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">{character.name}</h1>
                <p className="text-xl opacity-90">
                  {getRaceDisplayName(character.race)} {getClassDisplayName(character.characterClass)} - Nivel {character.level}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/characters/${id}/edit`)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => navigate('/characters')}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Volver
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{character.hitPoints}</div>
                <div className="text-sm text-gray-600">Puntos de Vida</div>
                <div className="text-xs text-gray-500">de {character.maxHitPoints}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{character.armorClass}</div>
                <div className="text-sm text-gray-600">Clase de Armadura</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{character.speed}</div>
                <div className="text-sm text-gray-600">Velocidad</div>
                <div className="text-xs text-gray-500">pies</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">+{character.proficiencyBonus}</div>
                <div className="text-sm text-gray-600">Competencia</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Habilidades */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Habilidades</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(character.abilities || {}).map(([ability, score]) => (
                    <div key={ability} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold text-gray-900">{score}</div>
                      <div className="text-sm text-gray-600 mb-1">
                        {ability === 'STRENGTH' && 'Fuerza'}
                        {ability === 'DEXTERITY' && 'Destreza'}
                        {ability === 'CONSTITUTION' && 'Constitución'}
                        {ability === 'INTELLIGENCE' && 'Inteligencia'}
                        {ability === 'WISDOM' && 'Sabiduría'}
                        {ability === 'CHARISMA' && 'Carisma'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getAbilityModifier(score)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información del personaje */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Información</h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Alineamiento</div>
                    <div className="font-medium">{getAlignmentDisplayName(character.alignment)}</div>
                  </div>
                  
                  {character.background && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Trasfondo</div>
                      <div className="font-medium">{character.background}</div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Experiencia</div>
                    <div className="font-medium">{character.experiencePoints} XP</div>
                  </div>
                  
                  {character.playerName && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Jugador</div>
                      <div className="font-medium">{character.playerName}</div>
                    </div>
                  )}
                  
                  {character.campaignName && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Campaña</div>
                      <div className="font-medium">{character.campaignName}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Historia del personaje */}
            {character.backstory && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Historia del Personaje</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {character.backstory}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}