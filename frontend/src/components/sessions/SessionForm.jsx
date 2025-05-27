import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSessionForm from '../../hooks/sessions/useSessionForm';
import MultiSelectDropdown from '../common/MultiSelectDropdown';
import { sessionTemplates, applyTemplate } from '../../data/sessionTemplates';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';

export default function SessionForm({ 
  sessionId, 
  campaignId: propCampaignId, 
  onSave, 
  onCancel 
}) {
  // Obtener parámetros de la URL si no se pasan como props
  const { id, campaignId: urlCampaignId } = useParams();
  const navigate = useNavigate();
  
  const finalSessionId = sessionId || id;
  const finalCampaignId = propCampaignId || urlCampaignId;
  
  // Estados para el formulario y UI
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'templates'
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(finalCampaignId || null);
  const [templateFilter, setTemplateFilter] = useState('all');

  // Hook del formulario
  const {
    session,
    loading,
    error,
    success,
    handleSubmit,
    handleChange,
    applyTemplate: applyTemplateToForm,
    resetForm,
    validateForm,
    hasChanges,
    setError,
    setSuccess,
    isEditing,
    isCreating
  } = useSessionForm(finalSessionId, selectedCampaignId, onSave);

  // Cargar campañas disponibles
  useEffect(() => {
    fetchCampaigns();
  }, []);

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
      const message = isEditing ? 'Sesión actualizada exitosamente' : 'Sesión creada exitosamente';
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [success, isEditing]);

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

  const handleCampaignChange = (campaignId) => {
    setSelectedCampaignId(campaignId);
  };

  const handleCancel = () => {
    if (hasChanges()) {
      if (window.confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.')) {
        if (onCancel) {
          onCancel();
        } else {
          navigate(-1);
        }
      }
    } else {
      if (onCancel) {
        onCancel();
      } else {
        navigate(-1);
      }
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = sessionTemplates.find(t => t.id === templateId);
    if (template) {
      const templateData = applyTemplate(template.template, session);
      applyTemplateToForm(templateData);
      setActiveTab('form');
      toast.success(`Template "${template.name}" aplicado exitosamente`);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado una campaña
    if (!selectedCampaignId) {
      setError('Debe seleccionar una campaña para la sesión');
      return;
    }

    // Validar formulario
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    // Llamar al submit del hook
    handleSubmit(e);
  };

  // Filtrar templates según la categoría seleccionada
  const filteredTemplates = templateFilter === 'all' 
    ? sessionTemplates 
    : sessionTemplates.filter(t => t.category === templateFilter);

  // Preparar datos de campañas para el dropdown
  const campaignOptions = campaigns.map(campaign => ({
    id: campaign.campaignId,
    name: campaign.name,
    description: campaign.description,
    dungeonMasterName: campaign.dungeonMasterName,
    isActive: campaign.isActive,
    icon: campaign.isActive ? '📖' : '📚'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Editar Sesión' : 'Crear Nueva Sesión'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing 
                    ? 'Modifica los detalles de tu sesión existente'
                    : 'Crea una nueva sesión para tu campaña'
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
                    ? 'border-blue-500 text-blue-600'
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
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📋 Templates
                </button>
              )}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'form' ? (
              /* TAB: FORMULARIO */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Selección de Campaña */}
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
                  className="mb-6"
                />

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Sesión *
                    </label>
                    <input
                      type="number"
                      name="sessionNumber"
                      value={session.sessionNumber}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={session.duration}
                      onChange={handleChange}
                      min="0"
                      max="720"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ej. 240 (4 horas)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha y Hora *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={session.date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Resumen de la sesión */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resumen de la Sesión
                  </label>
                  <textarea
                    name="summary"
                    value={session.summary}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Resume los eventos principales, decisiones importantes y momentos destacados de la sesión..."
                  />
                </div>

                {/* Notas del DM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del Director de Juego
                  </label>
                  <textarea
                    name="dmNotes"
                    value={session.dmNotes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notas privadas para el DM, observaciones sobre los jugadores, ideas para futuras sesiones..."
                  />
                </div>

                {/* Objetivos para la próxima sesión */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivos para la Próxima Sesión
                  </label>
                  <textarea
                    name="nextSessionObjectives"
                    value={session.nextSessionObjectives}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="¿Qué planeas para la próxima sesión? ¿Hay tramas que continuar o elementos que introducir?"
                  />
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {success}
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
                        📋 Ver Templates
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                    >
                      Limpiar Formulario
                    </button>
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
                      disabled={loading || !selectedCampaignId}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Guardando...' : (isEditing ? 'Actualizar Sesión' : 'Crear Sesión')}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* TAB: TEMPLATES */
              <div className="space-y-6">
                {/* Header de templates */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Templates de Sesión
                  </h2>
                  <p className="text-gray-600">
                    Selecciona un template para empezar rápidamente con contenido predefinido
                  </p>
                </div>

                {/* Filtros de templates */}
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setTemplateFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      templateFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setTemplateFilter('duration')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      templateFilter === 'duration'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Por Duración
                  </button>
                  <button
                    onClick={() => setTemplateFilter('theme')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      templateFilter === 'theme'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Por Tema
                  </button>
                  <button
                    onClick={() => setTemplateFilter('special')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      templateFilter === 'special'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Especiales
                  </button>
                </div>

                {/* Grid de templates */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">{template.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {template.name}
                          </h3>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {template.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {template.description}
                      </p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          <span className="font-medium">Duración:</span> {template.template.duration} min
                        </div>
                        <div>
                          <span className="font-medium">Resumen:</span> {template.template.summary.substring(0, 60)}...
                        </div>
                      </div>
                      
                      <button className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        Usar Template
                      </button>
                    </div>
                  ))}
                </div>

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

        {/* Tips informativos */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Consejos para crear sesiones efectivas</h3>
          <ul className="text-blue-700 text-sm space-y-2">
            <li>• <strong>Planifica con tiempo:</strong> Programa tus sesiones con anticipación para que los jugadores puedan organizarse</li>
            <li>• <strong>Balance de contenido:</strong> Combina combate, roleplay y exploración para mantener a todos interesados</li>
            <li>• <strong>Toma notas:</strong> Las notas del DM te ayudarán a recordar detalles importantes para futuras sesiones</li>
            <li>• <strong>Objetivos claros:</strong> Define qué quieres lograr en cada sesión para mantener el ritmo de la campaña</li>
            <li>• <strong>Flexibilidad:</strong> Los templates son una guía, pero siéntete libre de adaptarlos a tu estilo de juego</li>
          </ul>
        </div>
      </div>
    </div>
  );
}