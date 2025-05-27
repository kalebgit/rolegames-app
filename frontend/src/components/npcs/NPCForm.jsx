import React, { useState } from 'react';
import useNPCForm from '../../hooks/npcs/useNPCForm';
import { useNavigate, useParams } from 'react-router-dom';
import { characterTemplates, getTemplateById, applyCharacterTemplate, templateCategories } from '../../data/characterTemplates';

export default function NPCForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados para templates
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(!id); // Mostrar templates solo si es nuevo NPC
  
  const {
    npc,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    handleAbilityChange,
    setNpc
  } = useNPCForm(id, () => navigate('/npcs'));

  // Aplicar template seleccionado (adaptado para NPC)
  const applyTemplate = (templateId) => {
    const template = getTemplateById(templateId);
    if (template) {
      // Adaptar el template del character para NPC
      const npcTemplate = {
        ...template,
        // Campos específicos de NPC con valores por defecto
        npcType: 'NEUTRAL',
        challengeRating: template.level / 4, // Aproximación básica
        motivation: 'Motivación por definir',
        isHostile: false
      };
      
      const appliedTemplate = applyCharacterTemplate(npcTemplate, npc);
      setNpc(appliedTemplate);
      setSelectedTemplate(templateId);
      setShowTemplates(false);
    }
  };

  // Filtrar templates por categoría
  const filteredTemplates = selectedCategory === 'all' 
    ? characterTemplates 
    : characterTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {id ? 'Editar NPC' : 'Crear Nuevo NPC'}
                </h1>
                <p className="text-indigo-100">
                  {showTemplates 
                    ? 'Selecciona un template para empezar rápido, o continúa con un NPC personalizado'
                    : 'Completa la información de tu personaje no jugador'
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                {!id && (
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {showTemplates ? 'Crear Sin Template' : 'Ver Templates'}
                  </button>
                )}
                <button 
                  onClick={() => navigate('/npcs')}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Templates de NPCs</h2>
                
                {/* Filtros por categoría */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {templateCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-indigo-600 text-white'
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
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                      onClick={() => applyTemplate(template.id)}
                    >
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-2">{template.icon}</div>
                        <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Adaptado para NPC
                        </span>
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
                        <div className="flex justify-between">
                          <span className="text-gray-500">CR aprox:</span>
                          <span className="font-medium">{(template.template.level / 4).toFixed(1)}</span>
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

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                    {success}
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
                          value={npc.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          value={npc.background || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          value={npc.hitPoints}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bonificador de Competencia
                        </label>
                        <input
                          type="number"
                          name="proficiencyBonus"
                          value={npc.proficiencyBonus || 2}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Habilidades del GameCharacter */}
                  <div className="bg-gray-50 rounded-lg p-6">
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Modificador: {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campos Específicos de NonPlayerCharacter */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de NPC</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="ej. 0.5, 1, 2, 5..."
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isHostile"
                          checked={npc.isHostile}
                          onChange={handleChange}
                          id="isHostile"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isHostile" className="ml-2 block text-sm text-gray-900">
                          NPC hostil (enemigo por defecto)
                        </label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivación del NPC
                      </label>
                      <textarea
                        name="motivation"
                        value={npc.motivation}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Describe qué motiva a este NPC, sus objetivos y deseos..."
                      />
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/npcs')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear NPC')}
                    </button>
                  </div>
                </form>

                {/* Información de ayuda */}
                <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h3 className="font-semibold text-indigo-900 mb-3">💡 Consejos para crear NPCs memorables</h3>
                  <ul className="text-indigo-700 text-sm space-y-2">
                    <li>• <strong>Define su propósito:</strong> ¿Qué papel cumple en la historia? ¿Es aliado, enemigo, o neutral?</li>
                    <li>• <strong>Dale personalidad:</strong> Una motivación clara hace que el NPC sea más interesante</li>
                    <li>• <strong>Ajusta el desafío:</strong> El Factor de Desafío debe ser apropiado para el nivel del grupo</li>
                    <li>• <strong>Considera el contexto:</strong> ¿Dónde vive? ¿Qué recursos tiene? ¿Cómo habla?</li>
                    <li>• <strong>Planea sus relaciones:</strong> ¿Con qué otros NPCs interactúa? ¿Tiene aliados o enemigos?</li>
                  </ul>
                </div>

                {/* Vista previa del NPC */}
                {npc.name && npc.npcType && (
                  <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Vista Previa del NPC</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {npc.npcType === 'MERCHANT' && '🛒'}
                          {npc.npcType === 'QUEST_GIVER' && '📝'}
                          {npc.npcType === 'ENEMY' && '⚔️'}
                          {npc.npcType === 'ALLY' && '🤝'}
                          {npc.npcType === 'NEUTRAL' && '😐'}
                          {npc.npcType === 'BOSS' && '👑'}
                        </span>
                        <span className="font-medium text-lg">{npc.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          npc.isHostile ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {npc.isHostile ? 'Hostil' : 'Pacífico'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {npc.race} • Nivel {npc.level} • CA {npc.armorClass} • PV {npc.maxHitPoints}
                        {npc.challengeRating && ` • CR ${npc.challengeRating}`}
                      </div>
                      
                      {npc.motivation && (
                        <p className="text-gray-600 text-sm mt-2 italic">
                          "{npc.motivation}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}