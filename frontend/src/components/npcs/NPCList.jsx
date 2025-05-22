import React, { useState } from 'react';
import  useNPCs  from '../../hooks/npcs/useNPCs';
import LoadingSpinner from '../common/LoadingSpinner';

export default function NPCList({ onNPCSelect, onCreateNPC }) {
  const { npcs, loading, error, deleteNPC } = useNPCs();
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const typeColors = {
    MERCHANT: 'bg-green-100 text-green-800',
    QUEST_GIVER: 'bg-blue-100 text-blue-800',
    ENEMY: 'bg-red-100 text-red-800',
    ALLY: 'bg-purple-100 text-purple-800',
    NEUTRAL: 'bg-gray-100 text-gray-800',
    BOSS: 'bg-orange-100 text-orange-800'
  };

  console.log("NPCS: ", npcs)

  const filteredNPCs = Array.isArray(npcs) ? npcs.filter(npc => {
    const matchesName = npc.name.toLowerCase().includes(filter.toLowerCase());
    const matchesType = !typeFilter || npc.npcType === typeFilter;
    return matchesName && matchesType;
  }) : [];


  const handleDelete = async (npcId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este NPC?')) {
      await deleteNPC(npcId);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando NPCs..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Galería de NPCs</h1>
            <button 
              onClick={onCreateNPC}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Crear NPC
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Buscar NPCs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="MERCHANT">Comerciante</option>
              <option value="QUEST_GIVER">Dador de misiones</option>
              <option value="ENEMY">Enemigo</option>
              <option value="ALLY">Aliado</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="BOSS">Jefe</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNPCs.map(npc => (
              <div key={npc.characterId} className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-lg">
                        {npc.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{npc.name}</h3>
                      <p className="text-sm text-gray-600">
                        {npc.race} - Nivel {npc.level}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    typeColors[npc.npcType] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {npc.npcType}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">PV:</span>
                    <span className="font-medium">{npc.hitPoints}/{npc.maxHitPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CA:</span>
                    <span className="font-medium">{npc.armorClass}</span>
                  </div>
                  {npc.challengeRating && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Desafío:</span>
                      <span className="font-medium">{npc.challengeRating}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className={npc.isHostile ? 'text-red-600' : 'text-green-600'}>
                      {npc.isHostile ? 'Hostil' : 'Pacífico'}
                    </span>
                  </div>
                </div>

                {npc.motivation && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Motivación</p>
                    <p className="text-sm text-gray-700">{npc.motivation}</p>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => onNPCSelect(npc.characterId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                  >
                    Ver Detalles
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onNPCSelect(npc.characterId, 'edit')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(npc.characterId)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNPCs.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron NPCs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}