import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';

export default function CampaignInvitationModal({ 
  isOpen, 
  onClose, 
  campaign,
  onInvitationSent 
}) {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(''); 
  
  const { sendCampaignInvitation } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipientUsername.trim()) {
      setError('Por favor ingresa un nombre de usuario válido');
      return;
    }

    setSending(true);
    setError(''); // Limpiar errores previos
    
    try {
      const result = await sendCampaignInvitation(
        recipientUsername.trim(), 
        campaign.campaignId, 
        personalMessage.trim()
      );
      
      if (result.success) {
        // Limpiar formulario
        setRecipientUsername('');
        setPersonalMessage('');
        setError('');
        
        // Notificar al componente padre
        if (onInvitationSent) {
          onInvitationSent(result.notification);
        }
        
        // Cerrar modal
        onClose();
      } else {
        // Mostrar error específico en el modal
        setError(result.error || 'Error al enviar la invitación');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      setError('Error inesperado al enviar la invitación');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setRecipientUsername('');
      setPersonalMessage('');
      setError(''); // Limpiar errores al cerrar
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Invitar Jugador a Campaña
          </h3>
          <button
            onClick={handleClose}
            disabled={sending}
            className="text-gray-400 hover:text-gray-600 text-lg sm:text-xl disabled:opacity-50 p-1"
          >
            ×
          </button>
        </div>

        {/* Información de la campaña */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
          <h4 className="font-semibold text-blue-900 mb-1 text-xs sm:text-sm truncate">{campaign?.name}</h4>
          <p className="text-blue-700 text-xs line-clamp-2">
            {campaign?.description || 'Sin descripción'}
          </p>
          <div className="flex items-center mt-1 text-xs text-blue-600">
            <span className="truncate">DM: {campaign?.dungeonMasterName}</span>
            <span className="mx-2">•</span>
            <span className="flex-shrink-0">{campaign?.players?.length || 0} jugadores</span>
          </div>
        </div>

        {/* Mostrar errores */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          <div>
            <label 
              htmlFor="recipientUsername" 
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Nombre de Usuario del Jugador *
            </label>
            <input
              type="text"
              id="recipientUsername"
              value={recipientUsername}
              onChange={(e) => setRecipientUsername(e.target.value)}
              placeholder="Ej: aventurero_123"
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={sending}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              El usuario debe estar registrado en la plataforma
            </p>
          </div>

          <div>
            <label 
              htmlFor="personalMessage" 
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2"
            >
              Mensaje Personal (Opcional)
            </label>
            <textarea
              id="personalMessage"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Ej: ¡Hola! Te invito a unirte a nuestra aventura épica..."
              rows={2}
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              disabled={sending}
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Máximo 200 caracteres
              </p>
              <p className="text-xs text-gray-400">
                {personalMessage.length}/200
              </p>
            </div>
          </div>

          {/* Vista previa de la invitación */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 sm:p-3">
            <h5 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Vista previa:</h5>
            <div className="text-xs sm:text-sm text-gray-700">
              <p className="font-medium text-xs">✉️ Invitación a Campaña</p>
              <p className="text-xs break-words">
                Te han invitado a unirte a la campaña "{campaign?.name}"
                {personalMessage && (
                  <>
                    <br />
                    <em className="break-words">"{personalMessage}"</em>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={sending}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-md disabled:opacity-50 text-sm order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending || !recipientUsername.trim()}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center text-sm order-1 sm:order-2"
            >
              {sending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">📤 </span>
                  Enviar Invitación
                </>
              )}
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-3 sm:mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-yellow-600 text-sm">💡</span>
            </div>
            <div className="ml-2">
              <p className="text-xs text-yellow-700 leading-relaxed">
                El jugador recibirá una notificación en tiempo real y podrá aceptar o rechazar la invitación desde su panel de notificaciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}