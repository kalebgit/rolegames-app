import React from 'react';
import  useNPCForm  from '../../hooks/npcs/useNPCForm';
import { useNavigate, useParams } from 'react-router-dom';

export default function NPCForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    npc,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    handleAbilityChange
  } = useNPCForm(id, () => navigate('/npcs'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Editar NPC' : 'Crear NPC'}
            </h1>
            <button 
              onClick={() => navigate('/npcs')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={npc.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de NPC *
                </label>
                <select
                  name="npcType"
                  value={npc.npcType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MERCHANT">Comerciante</option>
                  <option value="QUEST_GIVER">Dador de misiones</option>
                  <option value="ENEMY">Enemigo</option>
                  <option value="ALLY">Aliado</option>
                  <option value="NEUTRAL">Neutral</option>
                  <option value="BOSS">Jefe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raza *
                </label>
                <select
                  name="race"
                  value={npc.race}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HUMAN">Humano</option>
                  <option value="ELF">Elfo</option>
                  <option value="DWARF">Enano</option>
                  <option value="HALFLING">Mediano</option>
                  <option value="GNOME">Gnomo</option>
                  <option value="HALF_ELF">Medio elfo</option>
                  <option value="HALF_ORC">Medio orco</option>
                  <option value="TIEFLING">Tiefling</option>
                  <option value="DRAGONBORN">Dracónido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel *
                </label>
                <input
                  type="number"
                  name="level"
                  value={npc.level}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Factor de Desafío
                </label>
                <input
                  type="number"
                  name="challengeRating"
                  value={npc.challengeRating}
                  onChange={handleChange}
                  min="0"
                  step="0.25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. 0.5, 1, 2, 5..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alineamiento
                </label>
                <select
                  name="alignment"
                  value={npc.alignment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LAWFUL_GOOD">Legal Bueno</option>
                  <option value="NEUTRAL_GOOD">Neutral Bueno</option>
                  <option value="CHAOTIC_GOOD">Caótico Bueno</option>
                  <option value="LAWFUL_NEUTRAL">Legal Neutral</option>
                  <option value="TRUE_NEUTRAL">Neutral Verdadero</option>
                  <option value="CHAOTIC_NEUTRAL">Caótico Neutral</option>
                  <option value="LAWFUL_EVIL">Legal Malvado</option>
                  <option value="NEUTRAL_EVIL">Neutral Malvado</option>
                  <option value="CHAOTIC_EVIL">Caótico Malvado</option>
                </select>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos de Vida Actuales
                </label>
                <input
                  type="number"
                  name="hitPoints"
                  value={npc.hitPoints}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos de Vida Máximos
                </label>
                <input
                  type="number"
                  name="maxHitPoints"
                  value={npc.maxHitPoints}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clase de Armadura
                </label>
                <input
                  type="number"
                  name="armorClass"
                  value={npc.armorClass}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Velocidad (pies)
                </label>
                <input
                  type="number"
                  name="speed"
                  value={npc.speed}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos de Experiencia
                </label>
                <input
                  type="number"
                  name="experiencePoints"
                  value={npc.experiencePoints}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Habilidades */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(npc.abilities).map(([ability, value]) => (
                  <div key={ability}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {ability === 'STRENGTH' && 'Fuerza'}
                      {ability === 'DEXTERITY' && 'Destreza'}
                      {ability === 'CONSTITUTION' && 'Constitución'}
                      {ability === 'INTELLIGENCE' && 'Inteligencia'}
                      {ability === 'WISDOM' && 'Sabiduría'}
                      {ability === 'CHARISMA' && 'Carisma'}
                    </label>
                    <input
                      type="number"
                      value={value || 10}
                      onChange={(e) => handleAbilityChange(ability, e.target.value)}
                      min="1"
                      max="30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Modificador: {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivación y estado hostil */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivación del NPC
                </label>
                <textarea
                  name="motivation"
                  value={npc.motivation}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe qué motiva a este NPC, sus objetivos y deseos..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isHostile"
                  checked={npc.isHostile}
                  onChange={handleChange}
                  id="isHostile"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="isHostile" className="ml-2 block text-sm text-gray-900">
                  NPC hostil (enemigo por defecto)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/npcs')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear NPC')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}