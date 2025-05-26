import React, { useState, useRef, useEffect } from 'react';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // Mock de notificaciones para demo
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Nueva sesión programada",
        message: "La sesión 'Cavernas Perdidas' está programada para mañana a las 19:00",
        type: "session",
        time: "Hace 5 minutos",
        read: false,
        priority: "high"
      },
      {
        id: 2,
        title: "Invitación a campaña",
        message: "Has sido invitado a la campaña 'Reino de las Sombras' por @dungeonmaster_pro",
        type: "invitation",
        time: "Hace 2 horas",
        read: false,
        priority: "medium"
      },
      {
        id: 3,
        title: "Personaje subió de nivel",
        message: "Tu personaje 'Thorin Escudodorado' ha alcanzado el nivel 5",
        type: "character",
        time: "Hace 1 día",
        read: true,
        priority: "low"
      },
      {
        id: 4,
        title: "Recordatorio de combate",
        message: "Tienes un combate pendiente en la campaña 'Aventuras Épicas'",
        type: "combat",
        time: "Hace 3 horas",
        read: false,
        priority: "high"
      },
      {
        id: 5,
        title: "Nuevo objeto obtenido",
        message: "Has obtenido 'Espada Flamígera +2' en tu última aventura",
        type: "item",
        time: "Hace 2 días",
        read: true,
        priority: "low"
      }
    ];
    setNotifications(mockNotifications);
  }, []);

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

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session': return '📅';
      case 'invitation': return '✉️';
      case 'character': return '👤';
      case 'combat': return '⚔️';
      case 'item': return '🎒';
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

  return (
    <div ref={notificationRef} className="fixed bottom-6 right-6 z-50">
      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Notificaciones</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded text-white"
                >
                  Marcar todas
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
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'bg-blue-25' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <h4 className={`font-semibold text-sm ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        <div className="flex space-x-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Marcar leída
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800 ml-2"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 text-center border-t">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
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
      >
        <span className="text-2xl">🔔</span>
        
        {/* Badge de notificaciones no leídas */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}

        {/* Efecto de ondas cuando hay notificaciones nuevas */}
        {unreadCount > 0 && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
        )}
      </button>
    </div>
  );
}