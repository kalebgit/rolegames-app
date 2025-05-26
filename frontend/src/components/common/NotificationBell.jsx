// frontend/src/components/common/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { useUserStore } from '../../stores/useUserStore';

export default function NotificationBell() {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const user = useUserStore(state => state.user);
  
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    notifications,
    unreadCount,
    isConnected,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    hasUnreadNotifications
  } = useNotifications();

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notification) => {
    // Marcar como leída si no lo está
    if (!notification.isRead) {
      await markAsRead(notification.notificationId);
    }
    
    // Navegar a la URL de acción si existe
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'CAMPAIGN_INVITATION': return '✉️';
      case 'SESSION_REMINDER': return '📅';
      case 'CHARACTER_LEVEL_UP': return '⬆️';
      case 'COMBAT_TURN': return '⚔️';
      case 'COMBAT_STARTED': return '🔥';
      case 'COMBAT_ENDED': return '🏁';
      case 'ITEM_OBTAINED': return '🎒';
      case 'GENERAL_ANNOUNCEMENT': return '📢';
      case 'ENCOUNTER_CREATED': return '🎭';
      case 'PLAYER_JOINED_CAMPAIGN': return '👥';
      case 'SESSION_SCHEDULED': return '🗓️';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  // No mostrar si el usuario no está autenticado
  if (!user) return null;

  return (
    <div ref={notificationRef} className="fixed bottom-6 right-6 z-50">
      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">Notificaciones</h3>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs">
                  {isConnected ? 'En vivo' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded text-white"
                  disabled={loading}
                >
                  {loading ? '...' : 'Marcar todas'}
                </button>
              )}
              <button
                onClick={toggleNotifications}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="overflow-y-auto max-h-80">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Cargando notificaciones...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <div className="text-4xl mb-2">⚠️</div>
                <p>Error al cargar notificaciones</p>
                <p className="text-xs text-gray-500 mt-1">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>No tienes notificaciones</p>
                <p className="text-xs text-gray-400 mt-1">
                  Cuando tengas nuevas notificaciones aparecerán aquí
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`border-l-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    getPriorityColor(notification.priority)
                  } ${!notification.isRead ? 'bg-blue-25' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <h4 className={`font-semibold text-sm ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.timeAgo}</span>
                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification.notificationId, e)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Marcar leída
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotification(notification.notificationId, e)}
                            className="text-xs text-red-600 hover:text-red-800 ml-2"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      
                      {/* Información adicional para invitaciones */}
                      {notification.type === 'CAMPAIGN_INVITATION' && notification.actionData && (
                        <div className="mt-2 p-2 bg-blue-100 rounded text-xs">
                          <p>👥 Invitación de campaña</p>
                          <p>Haz clic para ver detalles</p>
                        </div>
                      )}
                      
                      {/* Mostrar si está expirada */}
                      {notification.isExpired && (
                        <div className="mt-1">
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            Expirada
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 text-center border-t">
            <button 
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={toggleNotifications}
        className={`relative bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110 ${
          isOpen ? 'scale-110 bg-blue-700' : ''
        }`}
        title={`${unreadCount} notificaciones no leídas`}
      >
        <span className="text-2xl">🔔</span>
        
        {/* Badge de notificaciones no leídas */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}

        {/* Efecto de ondas cuando hay notificaciones nuevas */}
        {hasUnreadNotifications() && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
        )}

        {/* Indicador de conexión */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </button>
    </div>
  );
}