import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '../stores/useUserStore';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

class NotificationWebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.userId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
  }

  connect(userId) {
    return new Promise((resolve, reject) => {
      this.userId = userId;
      
      try {
        const wsUrl = `${process.env.NODE_ENV === 'production' ? 'wss:' : 'ws:'}//${window.location.host}/ws/notifications/${userId}`;
        
        console.log(`🔔 NotificationWS: Conectando a ${wsUrl}`);
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          console.log(`✅ NotificationWS: Conectado para usuario ${userId}`);
          
          this.startHeartbeat();
          this.emit('connected', { userId });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing notification WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.isConnected = false;
          this.stopHeartbeat();
          console.log('🔔 NotificationWS: Conexión cerrada', event.code, event.reason);
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
          
          this.emit('disconnected', { code: event.code, reason: event.reason });
        };

        this.ws.onerror = (error) => {
          console.error('❌ NotificationWS Error:', error);
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        console.error('Error creating notification WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.userId = null;
    this.listeners.clear();
    
    console.log('🔔 NotificationWS: Desconectado');
  }

  attemptReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 NotificationWS: Intentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts}) en ${delay}ms`);
    
    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId)
          .catch(() => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.attemptReconnect();
            }
          });
      }
    }, delay);
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('PING', {});
      }
    }, 30000); // Ping cada 30 segundos
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(type, data) {
    if (!this.isConnected || !this.ws) {
      console.warn('NotificationWS: No conectado, no se puede enviar mensaje');
      return false;
    }

    const message = {
      type,
      data,
      timestamp: new Date().toISOString()
    };

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending notification WebSocket message:', error);
      return false;
    }
  }

  handleMessage(message) {
    console.log('📥 NotificationWS: Mensaje recibido', message);
    
    switch (message.type) {
      case 'NOTIFICATIONS_CONNECTED':
        this.emit('connected', message);
        break;
        
      case 'NEW_NOTIFICATION':
        this.emit('new_notification', message.notification);
        break;
        
      case 'UNREAD_COUNT_UPDATE':
        this.emit('unread_count_update', message.unreadCount);
        break;
        
      case 'NOTIFICATION_MARKED_READ':
        this.emit('notification_marked_read', message.notificationId);
        break;
        
      case 'ALL_NOTIFICATIONS_MARKED_READ':
        this.emit('all_notifications_marked_read');
        break;
        
      case 'NOTIFICATION_DELETED':
        this.emit('notification_deleted', message.notificationId);
        break;
        
      case 'SYSTEM_NOTIFICATION':
        this.emit('system_notification', message);
        break;
        
      case 'PONG':
        break;
        
      default:
        console.warn('Tipo de mensaje de notificación no reconocido:', message.type);
    }
  }

  // manejar eventso
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`NotificationWS event handler error for ${event}:`, error);
        }
      });
    }
  }

  markAsRead(notificationId) {
    return this.send('MARK_AS_READ', { notificationId });
  }

  markAllAsRead() {
    return this.send('MARK_ALL_READ', {});
  }

  deleteNotification(notificationId) {
    return this.send('DELETE_NOTIFICATION', { notificationId });
  }
}

const notificationWS = new NotificationWebSocketService();

// formateo de timepo
function formatTimeAgo(dateString) {
  const now = new Date();
  const notificationDate = new Date(dateString);
  const diffInMs = now - notificationDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Ahora mismo';
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
  if (diffInHours < 24) return `Hace ${diffInHours}h`;
  if (diffInDays < 7) return `Hace ${diffInDays}d`;
  
  return notificationDate.toLocaleDateString();
}

export function useNotifications() {
  const user = useUserStore(state => state.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========================================
  // tomar las notificaiones d la api
  // ========================================
  const fetchNotifications = useCallback(async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);

      const [notificationsResponse, unreadCountResponse] = await Promise.all([
        api.get('/api/notifications'),
        api.get('/api/notifications/unread-count')
      ]);

      const notificationsWithTimeAgo = notificationsResponse.data.map(notification => ({
        ...notification,
        timeAgo: formatTimeAgo(notification.createdAt),
        isExpired: notification.expiresAt && new Date(notification.expiresAt) < new Date()
      }));

      setNotifications(notificationsWithTimeAgo);
      setUnreadCount(unreadCountResponse.data.count || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Error al cargar notificaciones');
      toast.error('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  // ========================================
  // WEBSOCKET 
  // ========================================
  useEffect(() => {
    if (!user?.userId) return;

    const connectWS = async () => {
      try {
        await notificationWS.connect(user.userId);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError('Error conectando a notificaciones en tiempo real');
        console.error('Notification WebSocket connection error:', err);
      }
    };

    connectWS();

    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleError = (error) => setError('Error de conexión WebSocket');

    const handleNewNotification = (notification) => {
      const notificationWithTimeAgo = {
        ...notification,
        timeAgo: formatTimeAgo(notification.createdAt),
        isExpired: notification.expiresAt && new Date(notification.expiresAt) < new Date()
      };

      setNotifications(prev => [notificationWithTimeAgo, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      toast.info(`📬 ${notification.title}`, {
        position: "top-right",
        autoClose: 5000,
      });
    };

    const handleUnreadCountUpdate = (count) => {
      setUnreadCount(count);
    };

    const handleNotificationMarkedRead = (notificationId) => {
      setNotifications(prev => 
        prev.map(n => 
          n.notificationId === notificationId 
            ? { ...n, isRead: true }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleAllNotificationsMarkedRead = () => {
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    };

    const handleNotificationDeleted = (notificationId) => {
      setNotifications(prev => 
        prev.filter(n => n.notificationId !== notificationId)
      );
      setUnreadCount(prev => {
        const deletedNotification = notifications.find(n => n.notificationId === notificationId);
        return deletedNotification && !deletedNotification.isRead ? Math.max(0, prev - 1) : prev;
      });
    };

    const handleSystemNotification = (message) => {
      toast.info(`📢 ${message.title}: ${message.message}`, {
        position: "top-center",
        autoClose: 8000,
      });
    };

    notificationWS.on('connected', handleConnected);
    notificationWS.on('disconnected', handleDisconnected);
    notificationWS.on('error', handleError);
    notificationWS.on('new_notification', handleNewNotification);
    notificationWS.on('unread_count_update', handleUnreadCountUpdate);
    notificationWS.on('notification_marked_read', handleNotificationMarkedRead);
    notificationWS.on('all_notifications_marked_read', handleAllNotificationsMarkedRead);
    notificationWS.on('notification_deleted', handleNotificationDeleted);
    notificationWS.on('system_notification', handleSystemNotification);

    // Cleanup
    return () => {
      notificationWS.off('connected', handleConnected);
      notificationWS.off('disconnected', handleDisconnected);
      notificationWS.off('error', handleError);
      notificationWS.off('new_notification', handleNewNotification);
      notificationWS.off('unread_count_update', handleUnreadCountUpdate);
      notificationWS.off('notification_marked_read', handleNotificationMarkedRead);
      notificationWS.off('all_notifications_marked_read', handleAllNotificationsMarkedRead);
      notificationWS.off('notification_deleted', handleNotificationDeleted);
      notificationWS.off('system_notification', handleSystemNotification);
      
      notificationWS.disconnect();
      setIsConnected(false);
    };
  }, [user?.userId, notifications]);

  // ========================================
  // FETCH (falta ver que hacemos)
  // ========================================
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ========================================
  // acciones de API 
  // ========================================
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/api/notifications/${notificationId}/mark-read`);
      notificationWS.markAsRead(notificationId);
      return { success: true };
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Error al marcar notificación como leída');
      return { success: false, error: err.message };
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post('/api/notifications/mark-all-read');
      notificationWS.markAllAsRead();
      toast.success('Todas las notificaciones marcadas como leídas');
      return { success: true };
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Error al marcar todas las notificaciones');
      return { success: false, error: err.message };
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      notificationWS.deleteNotification(notificationId);
      toast.success('Notificación eliminada');
      return { success: true };
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Error al eliminar notificación');
      return { success: false, error: err.message };
    }
  }, []);

  const sendCampaignInvitation = useCallback(async (recipientUsername, campaignId, personalMessage = '') => {
    try {
      setLoading(true);
      const response = await api.post('/api/notifications/campaign-invitation', {
        recipientUsername,
        campaignId,
        personalMessage
      });

      toast.success(`Invitación enviada a ${recipientUsername}`);
      return { success: true, notification: response.data };
    } catch (err) {
      console.error('Error sending campaign invitation:', err);
      const message = err.response?.data?.message || 'Error al enviar invitación';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendSessionReminder = useCallback(async (recipientId, sessionInfo, actionUrl) => {
    try {
      const response = await api.post('/api/notifications/session-reminder', {
        recipientId,
        sessionInfo,
        actionUrl
      });

      toast.success('Recordatorio de sesión enviado');
      return { success: true, notification: response.data };
    } catch (err) {
      console.error('Error sending session reminder:', err);
      toast.error('Error al enviar recordatorio');
      return { success: false, error: err.message };
    }
  }, []);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  const hasUnreadNotifications = useCallback(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.isRead);
  }, [notifications]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ========================================
  //HOOK API
  // ========================================
  return {
    // datos
    notifications,
    unreadCount,
    isConnected,
    loading,
    error,
    
    // acciones
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendCampaignInvitation,
    sendSessionReminder,
    refreshNotifications,
    
    // utilidades
    hasUnreadNotifications,
    getNotificationsByType,
    getUnreadNotifications,
    
    // WebSocket status para que veamos mejor en console
    connectionStatus: {
      isConnected,
      reconnectAttempts: notificationWS.reconnectAttempts,
      maxReconnectAttempts: notificationWS.maxReconnectAttempts
    }
  };
}