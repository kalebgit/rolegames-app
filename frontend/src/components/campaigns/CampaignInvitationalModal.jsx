// frontend/src/components/campaigns/CampaignInvitationModal.jsx
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
  
  const { sendCampaignInvitation } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipientUsername.trim()) {
      alert('Por favor ingresa un nombre de usuario válido');
      return;
    }

    setSending(true);
    
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
        
        // Notificar al componente padre
        if (onInvitationSent) {
          onInvitationSent(result.notification);
        }
        
        // Cerrar modal
        onClose();
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setRecipientUsername('');
      setPersonalMessage('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Invitar Jugador a Campaña
          </h3>
          <button
            onClick={handleClose}
            disabled={sending}
            className="text-gray-400 hover:text-gray-600 text-xl disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Información de la campaña */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-1">{campaign.name}</h4>
          <p className="text-blue-700 text-sm">
            {campaign.description || 'Sin descripción'}
          </p>
          <div className="flex items-center mt-2 text-xs text-blue-600">
            <span>DM: {campaign.dungeonMasterName}</span>
            <span className="mx-2">•</span>
            <span>{campaign.players?.length || 0} jugadores</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="recipientUsername" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre de Usuario del Jugador *
            </label>
            <input
              type="text"
              id="recipientUsername"
              value={recipientUsername}
              onChange={(e) => setRecipientUsername(e.target.value)}
              placeholder="Ej: aventurero_123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mensaje Personal (Opcional)
            </label>
            <textarea
              id="personalMessage"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Ej: ¡Hola! Te invito a unirte a nuestra aventura épica..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo 200 caracteres
            </p>
          </div>

          {/* Vista previa de la invitación */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-2">Vista previa:</h5>
            <div className="text-sm text-gray-700">
              <p className="font-medium">✉️ Invitación a Campaña</p>
              <p>
                Te han invitado a unirte a la campaña "{campaign.name}"
                {personalMessage && (
                  <>
                    <br />
                    <em>"{personalMessage}"</em>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={sending}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending || !recipientUsername.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center"
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
                '📤 Enviar Invitación'
              )}
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-yellow-600">💡</span>
            </div>
            <div className="ml-2">
              <p className="text-xs text-yellow-700">
                El jugador recibirá una notificación en tiempo real y podrá aceptar o rechazar la invitación desde su panel de notificaciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}