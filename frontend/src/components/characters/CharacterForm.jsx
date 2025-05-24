import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCharacterForm from '../../hooks/characters/useCharacterForm';

export default function CharacterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    character,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    handleAbilityChange
  } = useCharacterForm(id, () => {
    // Esta función se ejecuta después del éxito
    // No necesitamos hacer nada aquí porque el estado success manejará todo
  });

  // Si fue exitoso, mostrar página de éxito
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Ícono de éxito */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {id ? '¡Personaje actualizado!' : '¡Personaje creado exitosamente!'}
            </h1>
            
            <p className="text-gray-600 mb-8">
              {id 
                ? `Los cambios en "${character.name}" han sido guardados correctamente.`
                : `"${character.name}" ha sido añadido a tu lista de personajes.`
              }
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/characters')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Ver Lista de Personajes
              </button>
              
              <button
                onClick={() => navigate('/characters/new')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Crear Otro Personaje
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Editar Personaje' : 'Crear Personaje'}
            </h1>
            <button 
              onClick={() => navigate('/characters')}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={character.name || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raza *
                </label>
                <select
                  name="race"
                  value={character.race || 'HUMAN'}
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
                  Clase *
                </label>
                <select
                  name="characterClass"
                  value={character.characterClass || 'FIGHTER'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BARBARIAN">Bárbaro</option>
                  <option value="BARD">Bardo</option>
                  <option value="CLERIC">Clérigo</option>
                  <option value="DRUID">Druida</option>
                  <option value="FIGHTER">Guerrero</option>
                  <option value="MONK">Monje</option>
                  <option value="PALADIN">Paladín</option>
                  <option value="RANGER">Explorador</option>
                  <option value="ROGUE">Pícaro</option>
                  <option value="SORCERER">Hechicero</option>
                  <option value="WARLOCK">Brujo</option>
                  <option value="WIZARD">Mago</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel *
                </label>
                <input
                  type="number"
                  name="level"
                  value={character.level || 1}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alineamiento
                </label>
                <select
                  name="alignment"
                  value={character.alignment || 'TRUE_NEUTRAL'}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trasfondo
                </label>
                <input
                  type="text"
                  name="background"
                  value={character.background || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Estadísticas del personaje */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos de Vida Actuales
                </label>
                <input
                  type="number"
                  name="hitPoints"
                  value={character.hitPoints || 10}
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
                  value={character.maxHitPoints || 10}
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
                  value={character.armorClass || 10}
                  onChange={handleChange}
                  min="1"
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
                  value={character.experiencePoints || 0}
                  onChange={handleChange}
                  min="0"
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
                  value={character.speed || 30}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bonificador de Competencia
                </label>
                <input
                  type="number"
                  name="proficiencyBonus"
                  value={character.proficiencyBonus || 2}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Habilidades */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(character.abilities || {}).map(([ability, value]) => (
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
                      Modificador: {Math.floor(((value || 10) - 10) / 2) >= 0 ? '+' : ''}{Math.floor(((value || 10) - 10) / 2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Historia del personaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Historia del Personaje
              </label>
              <textarea
                name="backstory"
                value={character.backstory || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe la historia y motivaciones de tu personaje..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/characters')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear Personaje')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}