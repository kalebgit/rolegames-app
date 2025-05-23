import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
      // Manejar errores de autenticación globalmente
      if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("🔐 Axios Interceptor: Error de autenticación detectado");
          
          // Limpiar datos de autenticación
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          // Obtener el store de Zustand
          import('../stores/useUserStore').then(({ useUserStore }) => {
              const store = useUserStore.getState();
              store.logout();
              
              // Redirigir al login solo si no estamos ya en la página de auth
              if (!window.location.pathname.includes('/auth')) {
                  window.location.href = '/auth';
              }
          });
      }
      
      return Promise.reject(error);
  }
);

export default api;
