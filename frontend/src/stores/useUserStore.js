import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axiosConfig'

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            loading: true,
            error: null,
            
            // Setters
            setUser: (user) => set({ user }),
            setIsAuthenticated: (val) => set({ isAuthenticated: val }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            
            // Actions
            fetchUserData: async () => {
                console.log("🔐 useAuth: Obteniendo datos del usuario...");
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.log("🔐 useAuth: token no encontrado");
                    set({ isAuthenticated: false, loading: false, user: null });
                    return false;
                }
                
                // Configurar el token en las headers
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                try {
                    set({ loading: true }); // Asegurarse de que está en loading
                    console.log("🔐 useAuth: Enviando petición a /api/users/me");
                    const res = await api.get("/api/users/me");
                    
                    console.log("🔐 useAuth: Respuesta recibida exitosamente");
                    set({ 
                        user: res.data, 
                        isAuthenticated: true, 
                        error: null, 
                        loading: false 
                    });
                    return true;
                    
                } catch (err) {
                    console.error('🔐 useAuth: Error fetching user data:', err);
                    
                    // Si es error de autenticación, limpiar todo
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        console.log("🔐 useAuth: Token inválido, limpiando...");
                        get().logout();
                    } else {
                        set({
                            error: err.message,
                            isAuthenticated: false,
                            user: null,
                            loading: false
                        });
                    }
                    return false;
                }
            },
            
            // Verificación rápida del token sin hacer petición al servidor
            checkTokenValidity: () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ isAuthenticated: false, user: null, loading: false });
                    return false;
                }
                
                try {
                    // Decodificar el token JWT para verificar expiración
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const isExpired = payload.exp * 1000 < Date.now();
                    
                    if (isExpired) {
                        console.log("🔐 useAuth: Token expirado");
                        get().logout();
                        return false;
                    }
                    
                    return true;
                } catch (error) {
                    console.error("🔐 useAuth: Error decodificando token:", error);
                    get().logout();
                    return false;
                }
            },
            
            logout: (navigate = null) => {
                console.log("🔐 useAuth: Cerrando sesión...");
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                
                set({ 
                    isAuthenticated: false, 
                    user: null, 
                    error: null,
                    loading: false 
                });
                
                // Si se proporciona navigate, redirigir
                if (navigate) {
                    navigate("/auth");
                }
            },
            
            // Método para refrescar datos del usuario
            refreshUserData: async () => {
                if (!get().isAuthenticated) return false;
                return await get().fetchUserData();
            }
        }),
        {
            name: 'user-storage',
            // Solo persistir datos básicos, no funciones
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
            // Configurar la hidratación para evitar problemas
            // onRehydrateStorage: () => (state) => {
            //     if (state) {
            //         state.loading = false;
            //     }
            // }
        }
    )
)