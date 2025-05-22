import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import  useSpellForm  from '../../hooks/spells/useSpellForm';

export default function SpellForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    spell,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    handleComponentChange
  } = useSpellForm(id, () => navigate('/spells'));

  const spellComponents = ['VERBAL', 'SOMATIC', 'MATERIAL'];
  const abilityTypes = ['STRENGTH', 'DEXTERITY', 'CONSTITUTION', 'INTELLIGENCE', 'WISDOM', 'CHARISMA'];
  const damageTypes = ['SLASHING', 'PIERCING', 'BLUDGEONING', 'ACID', 'COLD', 'FIRE', 'FORCE', 'LIGHTNING', 'NECROTIC', 'POISON', 'PSYCHIC', 'RADIANT', 'THUNDER'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Editar Hechizo' : 'Crear Hechizo'}
            </h1>
            <button 
              onClick={() => navigate('/spells')}
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
                  Nombre del Hechizo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={spell.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa el nombre del hechizo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel *
                </label>
                <select
                  name="level"
                  value={spell.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                    <option key={level} value={level}>
                      {level === 0 ? 'Truco' : `Nivel ${level}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escuela de Magia *
                </label>
                <select
                  name="school"
                  value={spell.school}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ABJURATION">Abjuración</option>
                  <option value="CONJURATION">Conjuración</option>
                  <option value="DIVINATION">Adivinación</option>
                  <option value="ENCHANTMENT">Encantamiento</option>
                  <option value="EVOCATION">Evocación</option>
                  <option value="ILLUSION">Ilusión</option>
                  <option value="NECROMANCY">Nigromancia</option>
                  <option value="TRANSMUTATION">Transmutación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de Lanzamiento *
                </label>
                <input
                  type="text"
                  name="castingTime"
                  value={spell.castingTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. 1 acción, 1 minuto, 10 minutos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alcance *
                </label>
                <input
                  type="text"
                  name="range"
                  value={spell.range}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Personal, Toque, 30 pies, 1 milla"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={spell.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Instantáneo, 1 minuto, 24 horas"
                />
              </div>
            </div>

            {/* Componentes del hechizo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Componentes *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {spellComponents.map(component => (
                  <div key={component} className="flex items-center">
                    <input
                      type="checkbox"
                      id={component}
                      checked={spell.components?.includes(component) || false}
                      onChange={(e) => handleComponentChange(component, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={component} className="ml-2 block text-sm text-gray-900">
                      {component === 'VERBAL' && 'Verbal (V)'}
                      {component === 'SOMATIC' && 'Somático (S)'}
                      {component === 'MATERIAL' && 'Material (M)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Componentes materiales específicos */}
            {spell.components?.includes('MATERIAL') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Componentes Materiales
                </label>
                <input
                  type="text"
                  name="materialComponents"
                  value={spell.materialComponents}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe los componentes materiales específicos"
                />
              </div>
            )}

            {/* Descripción del hechizo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={spell.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe los efectos del hechizo, cómo funciona, etc..."
              />
            </div>

            {/* Efectos a nivel superior */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efectos a Nivel Superior
              </label>
              <textarea
                name="higherLevelEffects"
                value={spell.higherLevelEffects}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe cómo cambia el hechizo cuando se lanza a un nivel superior..."
              />
            </div>

            {/* Información de daño y salvación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Daño
                </label>
                <select
                  name="damageType"
                  value={spell.damageType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin daño</option>
                  {damageTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dados de Daño
                </label>
                <input
                  type="text"
                  name="damageDice"
                  value={spell.damageDice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. 1d4, 3d6, 8d8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tirada de Salvación
                </label>
                <select
                  name="savingThrow"
                  value={spell.savingThrow}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin salvación</option>
                  {abilityTypes.map(ability => (
                    <option key={ability} value={ability}>
                      {ability === 'STRENGTH' && 'Fuerza'}
                      {ability === 'DEXTERITY' && 'Destreza'}
                      {ability === 'CONSTITUTION' && 'Constitución'}
                      {ability === 'INTELLIGENCE' && 'Inteligencia'}
                      {ability === 'WISDOM' && 'Sabiduría'}
                      {ability === 'CHARISMA' && 'Carisma'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Propiedades especiales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="ritual"
                  checked={spell.ritual}
                  onChange={handleChange}
                  id="ritual"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="ritual" className="ml-2 block text-sm text-gray-900">
                  Puede lanzarse como ritual
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="concentration"
                  checked={spell.concentration}
                  onChange={handleChange}
                  id="concentration"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="concentration" className="ml-2 block text-sm text-gray-900">
                  Requiere concentración
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/spells')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear Hechizo')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}