import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEncounterForm from '../../hooks/encounters/useEncounterForm';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { 
  encounterTemplates, 
  applyEncounterTemplate, 
  encounterTemplateCategories, 
  encounterDifficultyLevels 
} from '../../data/encounterTemplates';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';

export default function EncounterForm({ 
  encounterId, 
  sessionId: propSessionId, 
  campaignId: propCampaignId,
  onSave, 
  onCancel 
}) {
  // Obtener parámetros de la URL si no se pasan como props
  const { id, sessionId: urlSessionId, campaignId: urlCampaignId } = useParams();
  const navigate = useNavigate();
  
  const finalEncounterId = encounterId || id;
  const finalSessionId = propSessionId || urlSessionId;
  const finalCampaignId = propCampaignId || urlCampaignId;
  
  // Estados para tabs y UI
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'templates'
  const [templateFilter, setTemplateFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  
  // Estados para selección de campaña y sesión
  const [campaigns, setCampaigns] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(finalCampaignId || null);
  const [selectedSessionId, setSelectedSessionId] = useState(finalSessionId || null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Hook del formulario
  const {
    encounter,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    setError,
    setSuccess,
    isEditing,
    isCreating
  } = useEncounterForm(finalEncounterId, onSave);

  // Cargar campañas al montar el componente
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Cargar sesiones cuando se selecciona una campaña
  useEffect(() => {
    if (selectedCampaignId) {
      fetchSessionsForCampaign(selectedCampaignId);
    } else {
      setSessions([]);
      setSelectedSessionId(null);
    }
  }, [selectedCampaignId]);

  // Mostrar mensajes de toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const message = finalEncounterId ? 'Encuentro actualizado exitosamente' : 'Encuentro creado exitosamente';
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [success, finalEncounterId]);

  const fetchCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const response = await api.get('/api/campaigns');
      setCampaigns(response.data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      toast.error('Error al cargar las campañas disponibles');
      setCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const fetchSessionsForCampaign = async (campaignId) => {
    try {
      setLoadingSessions(true);
      const response = await api.get(`/api/sessions/campaign/${campaignId}`);
      setSessions(response.data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error('Error al cargar las sesiones de la campaña');
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleCampaignChange = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setSelectedSessionId(null); // Reset session when campaign changes
  };

  const handleSessionChange = (sessionId) => {
    setSelectedSessionId(sessionId);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = encounterTemplates.find(t => t.id === templateId);
    if (template) {
      const templateData = applyEncounterTemplate(template.template, encounter);
      // Aplicar template al formulario
      Object.keys(templateData).forEach(key => {
        if (key !== 'encounterId' && key !== 'sessionId') {
          handleChange({ target: { name: key, value: templateData[key] } });
        }
      });
      setActiveTab('form');
      toast.success(`Template "${template.name}" aplicado exitosamente`);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado una sesión
    if (!selectedSessionId) {
      setError('Debe seleccionar una sesión para el encuentro');
      return;
    }

    // Crear el encuentro con la sesión seleccionada
    try {
      const encounterData = {
        ...encounter,
        sessionId: selectedSessionId
      };

      let response;
      if (finalEncounterId) {
        response = await api.put(`/api/encounters/${finalEncounterId}`, encounterData);
      } else {
        response = await api.post('/api/encounters', {
          encounterDTO: encounterData,
          sessionId: selectedSessionId
        });
      }

      setSuccess(finalEncounterId ? 'Encuentro actualizado exitosamente' : 'Encuentro creado exitosamente');
      
      if (onSave) {
        setTimeout(() => onSave(response.data), 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al guardar el encuentro';
      setError(errorMessage);
    }
  };

  // Filtrar templates según los criterios seleccionados
  const filteredTemplates = encounterTemplates.filter(template => {
    const matchesCategory = templateFilter === 'all' || template.category === templateFilter;
    const matchesDifficulty = difficultyFilter === 'all' || template.difficulty === difficultyFilter;
    return matchesCategory && matchesDifficulty;
  });

  // Preparar datos para los dropdowns
  const campaignOptions = campaigns.map(campaign => ({
    id: campaign.campaignId,
    name: campaign.name,
    description: campaign.description,
    dungeonMasterName: campaign.dungeonMasterName,
    isActive: campaign.isActive,
    icon: campaign.isActive ? '📖' : '📚'
  }));

  const sessionOptions = sessions.map(session => ({
    id: session.sessionId,
    name: `Sesión #${session.sessionNumber}`,
    description: session.summary || 'Sin resumen',
    date: session.date,
    duration: session.duration,
    icon: '📅'
  }));

  const difficultyOptions = [
    { id: 'TRIVIAL', name: 'Trivial', icon: '🟢', description: 'Muy fácil, prácticamente sin riesgo' },
    { id: 'EASY', name: 'Fácil', icon: '🔵', description: 'Desafío menor, riesgo bajo' },
    { id: 'MEDIUM', name: 'Medio', icon: '🟡', description: 'Desafío balanceado para el grupo' },
    { id: 'HARD', name: 'Difícil', icon: '🟠', description: 'Desafío considerable, riesgo alto' },
    { id: 'DEADLY', name: 'Mortal', icon: '🔴', description: 'Extremadamente peligroso' }
  ];

  const encounterTypeOptions = [
    { id: 'COMBAT', name: 'Combate', icon: '⚔️', description: 'Batalla táctica contra enemigos' },
    { id: 'SOCIAL', name: 'Social', icon: '💬', description: 'Interacción y roleplay con NPCs' },
    { id: 'PUZZLE', name: 'Puzzle', icon: '🧩', description: 'Acertijos y desafíos mentales' },
    { id: 'TRAP', name: 'Trampa', icon: '🕳️', description: 'Trampas y peligros ambientales' },
    { id: 'EXPLORATION', name: 'Exploración', icon: '🗺️', description: 'Descubrimiento y navegación' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {finalEncounterId ? 'Editar Encuentro' : 'Crear Nuevo Encuentro'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {finalEncounterId 
                    ? 'Modifica los detalles de tu encuentro existente'
                    : 'Diseña un nuevo encuentro para tu campaña'
                  }
                </p>
              </div>
              <button 
                onClick={handleCancel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('form')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'form'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Formulario
              </button>
              {isCreating && (
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'templates'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🎭 Templates de Encuentros
                </button>
              )}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'form' ? (
              /* TAB: FORMULARIO */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Selección de Campaña y Sesión */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiSelectDropdown
                    label="Campaña"
                    options={campaignOptions}
                    selectedValue={selectedCampaignId}
                    onChange={handleCampaignChange}
                    placeholder="Selecciona una campaña..."
                    required={true}
                    loading={loadingCampaigns}
                    searchable={true}
                    showDescription={true}
                    descriptionKey="description"
                    icon="📖"
                    noOptionsMessage="No hay campañas disponibles"
                  />

                  <MultiSelectDropdown
                    label="Sesión"
                    options={sessionOptions}
                    selectedValue={selectedSessionId}
                    onChange={handleSessionChange}
                    placeholder={selectedCampaignId ? "Selecciona una sesión..." : "Primero selecciona una campaña"}
                    required={true}
                    loading={loadingSessions}
                    searchable={true}
                    showDescription={true}
                    descriptionKey="description"
                    icon="📅"
                    disabled={!selectedCampaignId}
                    noOptionsMessage={selectedCampaignId ? "No hay sesiones en esta campaña" : "Selecciona una campaña primero"}
                  />
                </div>

                {/* Información básica del encuentro */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Encuentro *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={encounter.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Emboscada en el Bosque Sombrio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={encounter.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe el encuentro, el ambiente, los objetivos y cualquier información relevante..."
                    />
                  </div>
                </div>

                {/* Tipo y Dificultad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MultiSelectDropdown
                    label="Tipo de Encuentro"
                    options={encounterTypeOptions}
                    selectedValue={encounter.encounterType}
                    onChange={(value) => handleChange({ target: { name: 'encounterType', value } })}
                    placeholder="Selecciona el tipo..."
                    required={true}
                    showDescription={true}
                    descriptionKey="description"
                    searchable={false}
                  />

                  <MultiSelectDropdown
                    label="Dificultad"
                    options={difficultyOptions}
                    selectedValue={encounter.difficulty}
                    onChange={(value) => handleChange({ target: { name: 'difficulty', value } })}
                    placeholder="Selecciona la dificultad..."
                    required={true}
                    showDescription={true}
                    descriptionKey="description"
                    searchable={false}
                  />
                </div>

                {/* Notas adicionales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del DM
                  </label>
                  <textarea
                    name="notes"
                    value={encounter.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Notas privadas para el DM: estrategias, recordatorios, modificaciones..."
                  />
                </div>

                {/* Estado del encuentro */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isCompleted"
                    checked={encounter.isCompleted}
                    onChange={handleChange}
                    id="isCompleted"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900">
                    Encuentro completado
                  </label>
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <div className="flex items-center">
                      <span className="mr-2">⚠️</span>
                      {error}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    <div className="flex items-center">
                      <span className="mr-2">✅</span>
                      {success}
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    {isCreating && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('templates')}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-md transition-colors"
                      >
                        🎭 Ver Templates
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !selectedSessionId}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Guardando...' : (finalEncounterId ? 'Actualizar Encuentro' : 'Crear Encuentro')}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* TAB: TEMPLATES */
              <div className="space-y-6">
                {/* Selección de Campaña y Sesión TAMBIÉN en templates */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MultiSelectDropdown
                      label="Campaña (requerida para usar templates)"
                      options={campaignOptions}
                      selectedValue={selectedCampaignId}
                      onChange={handleCampaignChange}
                      placeholder="Selecciona una campaña..."
                      required={true}
                      loading={loadingCampaigns}
                      searchable={true}
                      showDescription={true}
                      descriptionKey="description"
                      icon="📖"
                      noOptionsMessage="No hay campañas disponibles"
                    />

                    <MultiSelectDropdown
                      label="Sesión (requerida para usar templates)"
                      options={sessionOptions}
                      selectedValue={selectedSessionId}
                      onChange={handleSessionChange}
                      placeholder={selectedCampaignId ? "Selecciona una sesión..." : "Primero selecciona una campaña"}
                      required={true}
                      loading={loadingSessions}
                      searchable={true}
                      showDescription={true}
                      descriptionKey="description"
                      icon="📅"
                      disabled={!selectedCampaignId}
                      noOptionsMessage={selectedCampaignId ? "No hay sesiones en esta campaña" : "Selecciona una campaña primero"}
                    />
                  </div>

                  {(!selectedCampaignId || !selectedSessionId) && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-yellow-600 mr-2">⚠️</span>
                        <p className="text-yellow-700 text-sm">
                          Debes seleccionar una campaña y una sesión antes de poder usar los templates
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedCampaignId && selectedSessionId && (
                  <>
                    {/* Header de templates */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Templates de Encuentros
                      </h2>
                      <p className="text-gray-600">
                        Selecciona un template para empezar rápidamente con contenido predefinido
                      </p>
                    </div>

                    {/* Filtros de templates */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {/* Filtro por categoría */}
                      <div className="flex space-x-2">
                        {encounterTemplateCategories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => setTemplateFilter(category.id)}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                              templateFilter === category.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {category.icon} {category.name}
                          </button>
                        ))}
                      </div>
                      
                      {/* Separador */}
                      <div className="w-px bg-gray-300 mx-2"></div>
                      
                      {/* Filtro por dificultad */}
                      <div className="flex space-x-2">
                        {encounterDifficultyLevels.map(difficulty => (
                          <button
                            key={difficulty.id}
                            onClick={() => setDifficultyFilter(difficulty.id)}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                              difficultyFilter === difficulty.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {difficulty.icon} {difficulty.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grid de templates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group hover:border-purple-300"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          <div className="flex items-center mb-3">
                            <span className="text-3xl mr-3">{template.icon}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {template.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                  {template.category}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  template.difficulty === 'TRIVIAL' ? 'bg-green-100 text-green-800' :
                                  template.difficulty === 'EASY' ? 'bg-blue-100 text-blue-800' :
                                  template.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                  template.difficulty === 'HARD' ? 'bg-orange-100 text-orange-800' :
                                  template.difficulty === 'DEADLY' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {template.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {template.description}
                          </p>
                          
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>
                              <span className="font-medium">Tipo:</span> {template.template.encounterType}
                            </div>
                            <div>
                              <span className="font-medium">Descripción:</span> {template.template.description.substring(0, 50)}...
                            </div>
                          </div>
                          
                          <button className="mt-4 w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-md text-sm font-medium transition-colors group-hover:bg-purple-600 group-hover:text-white">
                            Usar Template
                          </button>
                        </div>
                      ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🎭</div>
                        <p className="text-gray-500">No se encontraron templates con los filtros seleccionados</p>
                        <button
                          onClick={() => {
                            setTemplateFilter('all');
                            setDifficultyFilter('all');
                          }}
                          className="mt-4 text-purple-600 hover:text-purple-800"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Botón para volver al formulario */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md transition-colors"
                  >
                    ← Volver al Formulario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vista previa del encuentro */}
        {encounter.name && encounter.encounterType && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Vista Previa del Encuentro</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {encounterTypeOptions.find(t => t.id === encounter.encounterType)?.icon}
                </span>
                <span className="font-medium text-lg">{encounter.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  encounter.difficulty === 'TRIVIAL' ? 'bg-green-100 text-green-800' :
                  encounter.difficulty === 'EASY' ? 'bg-blue-100 text-blue-800' :
                  encounter.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  encounter.difficulty === 'HARD' ? 'bg-orange-100 text-orange-800' :
                  encounter.difficulty === 'DEADLY' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {difficultyOptions.find(d => d.id === encounter.difficulty)?.name || encounter.difficulty}
                </span>
              </div>
              
              {encounter.description && (
                <p className="text-gray-600 text-sm mt-2">
                  {encounter.description}
                </p>
              )}
              
              <div className="text-xs text-gray-500 mt-3">
                <span>Tipo: {encounterTypeOptions.find(t => t.id === encounter.encounterType)?.name}</span>
                {encounter.isCompleted && (
                  <span className="ml-4 text-green-600">✓ Completado</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tips informativos */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="font-semibold text-purple-900 mb-3">💡 Consejos para crear encuentros memorables</h3>
          <ul className="text-purple-700 text-sm space-y-2">
            <li>• <strong>Establece objetivos claros:</strong> Define qué deben lograr los jugadores en este encuentro</li>
            <li>• <strong>Varía los tipos:</strong> Alterna entre combate, roleplay y puzzles para mantener el interés</li>
            <li>• <strong>Considera el ritmo:</strong> Los encuentros difíciles deben estar balanceados con momentos de respiro</li>
            <li>• <strong>Prepara consecuencias:</strong> Piensa en cómo los resultados afectarán la historia</li>
            <li>• <strong>Ten flexibilidad:</strong> Los jugadores pueden sorprenderte con soluciones creativas</li>
            <li>• <strong>Usa el ambiente:</strong> El entorno puede ser tan importante como los enemigos</li>
            <li>• <strong>Templates como guía:</strong> Los templates son un punto de partida, adáptalos a tu mesa</li>
          </ul>
        </div>
      </div>
    </div>
  );
}