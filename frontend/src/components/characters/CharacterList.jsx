// src/components/characters/CharacterList.jsx (con React Router)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCharacters from '../../hooks/characters/useCharacters';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CharacterList() {
  const navigate = useNavigate();
  const { characters, loading, error, deleteCharacter } = useCharacters();
  const [filter, setFilter] = useState('');

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (characterId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este personaje?')) {
      await deleteCharacter(characterId);
    }
  };

  const handleCharacterSelect = (characterId, mode = 'view') => {
    if (mode === 'edit') {
      navigate(`/characters/${characterId}/edit`);
    } else {
      navigate(`/characters/${characterId}`);
    }
  };

  const handleCreateCharacter = () => {
    navigate('/characters/new');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando personajes..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Personajes</h1>
            <button 
              onClick={handleCreateCharacter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Crear Personaje
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar personajes..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map(character => (
              <div key={character.characterId} className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {character.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{character.name}</h3>
                    <p className="text-sm text-gray-600">Nivel {character.level} {character.race}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">PV:</span>
                    <span className="font-medium">{character.hitPoints}/{character.maxHitPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CA:</span>
                    <span className="font-medium">{character.armorClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Experiencia:</span>
                    <span className="font-medium">{character.experiencePoints} XP</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => handleCharacterSelect(character.characterId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                  >
                    Ver Detalles
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleCharacterSelect(character.characterId, 'edit')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(character.characterId)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCharacters.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron personajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}