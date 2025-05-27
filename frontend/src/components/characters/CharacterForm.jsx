import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCharacterForm from '../../hooks/characters/useCharacterForm';
import { characterTemplates, getTemplateById, applyCharacterTemplate, templateCategories } from '../../data/characterTemplates';

export default function CharacterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para templates
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(!id); // Mostrar templates solo si es nuevo personaje

  const {
    character,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    handleAbilityChange,
    setCharacter
  } = useCharacterForm(id, () => {
    // Esta función se ejecuta después del éxito
  });

  // Aplicar template seleccionado
  const applyTemplate = (templateId) => {
    const template = getTemplateById(templateId);
    if (template) {
      const appliedTemplate = applyCharacterTemplate(template, character);
      // Asegurar que characterClass esté establecido
      appliedTemplate.characterClass = appliedTemplate.characterClass || 'FIGHTER';
      setCharacter(appliedTemplate);
      setSelectedTemplate(templateId);
      setShowTemplates(false);
    }
  };

  // Filtrar templates por categoría
  const filteredTemplates = selectedCategory === 'all' 
    ? characterTemplates 
    : characterTemplates.filter(t => t.category === selectedCategory);

  // Si fue exitoso, mostrar página de éxito
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {id ? 'Editar Personaje' : 'Crear Nuevo Personaje'}
                </h1>
                <p className="text-blue-100">
                  {showTemplates 
                    ? 'Selecciona un template para empezar rápido, o continúa con un personaje personalizado'
                    : 'Completa la información de tu personaje'
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                {!id && (
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {showTemplates ? 'Crear Sin Template' : 'Ver Templates'}
                  </button>
                )}
                <button 
                  onClick={() => navigate('/characters')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Sección de Templates */}
            {showTemplates && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Templates de Personajes</h2>
                
                {/* Filtros por categoría */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {templateCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>

                {/* Grid de templates */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredTemplates.map(template => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      onClick={() => applyTemplate(template.id)}
                    >
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{template.icon}</div>
                        <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Raza:</span>
                          <span className="font-medium">{template.template.race}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nivel:</span>
                          <span className="font-medium">{template.template.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PV:</span>
                          <span className="font-medium">{template.template.maxHitPoints}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">CA:</span>
                          <span className="font-medium">{template.template.armorClass}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
                  >
                    Continuar Sin Template
                  </button>
                </div>
              </div>
            )}

            {/* Formulario Principal */}
            {!showTemplates && (
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Información Básica del GameCharacter */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                    
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
                  </div>

                  {/* Estadísticas del GameCharacter */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
                    
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
                  </div>

                  {/* Habilidades del GameCharacter */}
                  <div className="bg-gray-50 rounded-lg p-6">
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

                  {/* Campos Específicos de PlayerCharacter */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Jugador</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subclase
                        </label>
                        <input
                          type="text"
                          name="subclass"
                          value={character.subclass || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Campeón, Escuela de Evocación..."
                        />
                      </div>
                    </div>

                    <div className="mt-6">
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
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/characters')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear Personaje')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}