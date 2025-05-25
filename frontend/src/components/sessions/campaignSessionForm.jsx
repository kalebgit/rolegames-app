import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCampaignSessionForm from '../campaigns/useCampaignSessionForm';
import { toast } from 'react-toastify';

export default function CampaignSessionForm() {
  const { campaignId, sessionId } = useParams();
  const navigate = useNavigate();
  
  const {
    session,
    loading,
    error,
    success,
    handleSubmit,
    handleChange
  } = useCampaignSessionForm(
    campaignId, 
    sessionId, 
    (sessionData) => {
      // Redirigir a la sala de la sesión después de crearla
      navigate(`/sessions/${sessionData.sessionId}/room`);
    }
  );

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
      const message = sessionId ? 'Sesión actualizada exitosamente' : 'Sesión creada exitosamente';
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [success, sessionId]);

  const handleCancel = () => {
    if (campaignId) {
      navigate(`/campaigns/${campaignId}`);
    } else {
      navigate('/sessions');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {sessionId ? 'Editar Sesión' : 'Crear Nueva Sesión'}
            </h1>
            <button 
              onClick={handleCancel}
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
                  Duración Estimada (minutos)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={session.duration}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. 240 (4 horas)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora de la Sesión *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos de la Sesión
              </label>
              <textarea
                name="summary"
                value={session.summary}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="¿Qué planeas que suceda en esta sesión? Objetivos principales, tramas a desarrollar..."
              />
            </div>

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
                placeholder="Notas privadas para el DM, recordatorios, mecánicas especiales..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preparación para la Próxima Sesión
              </label>
              <textarea
                name="nextSessionObjectives"
                value={session.nextSessionObjectives}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="¿Qué elementos debes preparar después de esta sesión?"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos para la Sesión</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Prepara encuentros y NPCs con anticipación</li>
                <li>• Considera el ritmo: combate, roleplay y exploración</li>
                <li>• Ten flexibilidad para adaptarte a las decisiones de los jugadores</li>
                <li>• Recuerda tomar descansos cada 2-3 horas</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Creando...' : (sessionId ? 'Actualizar Sesión' : 'Crear y Abrir Sala')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}