import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function CharacterSelectionModal({ 
  isOpen, 
  onClose, 
  characters, 
  onCharacterSelect,
  loading = false 
}) {
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [joinLoading, setJoinLoading] = useState(false);

  const handleJoinEncounter = async () => {
    if (!selectedCharacterId) return;
    
    setJoinLoading(true);
    try {
      await onCharacterSelect(selectedCharacterId);
      onClose();
    } catch (error) {
      console.error('Error joining encounter:', error);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleClose = () => {
    if (!joinLoading) {
      setSelectedCharacterId(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Seleccionar Personaje
          </h3>
          <button
            onClick={handleClose}
            disabled={joinLoading}
            className="text-gray-400 hover:text-gray-600 text-xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          Selecciona el personaje que participará en este encuentro
        </p>

        {loading ? (
          <div className="py-8">
            <LoadingSpinner message="Cargando personajes..." />
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">👤</div>
            <p className="text-gray-500 mb-4">No tienes personajes disponibles</p>
            <button
              onClick={() => window.open('/characters/new', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Crear Personaje
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {characters.map(character => (
                <div
                  key={character.characterId}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCharacterId === character.characterId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCharacterId(character.characterId)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {character.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{character.name}</h4>
                      <p className="text-sm text-gray-600">
                        {character.race} {character.characterClass} - Nivel {character.level}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        HP: {character.hitPoints}/{character.maxHitPoints} | 
                        AC: {character.armorClass} | 
                        XP: {character.experiencePoints}
                      </div>
                    </div>
                    {selectedCharacterId === character.characterId && (
                      <div className="text-blue-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                disabled={joinLoading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleJoinEncounter}
                disabled={!selectedCharacterId || joinLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center"
              >
                {joinLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uniéndose...
                  </>
                ) : (
                  'Unirse al Encuentro'
                )}
              </button>
            </div>
          </>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="text-blue-500 text-sm mr-2">💡</div>
            <p className="text-blue-700 text-xs">
              Al unirte al encuentro, tu personaje aparecerá en el tablero y podrás participar en las acciones de combate y roleplay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}