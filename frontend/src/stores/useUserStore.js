import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axiosConfig'

export const useUserStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            loading: false, 
            error: null,
            
            // Setters
            setUser: (user) => set({ user }),
            setIsAuthenticated: (val) => set({ isAuthenticated: val }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),
            
            // Actions
            fetchUserData: async () => {
                console.log("🔐 useUserStore: Obteniendo datos del usuario...");
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.log("🔐 useUserStore: No hay token disponible");
                    set({ 
                        isAuthenticated: false, 
                        loading: false, 
                        user: null,
                        error: null 
                    });
                    return false;
                }
                
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                try {
                    set({ loading: true, error: null });
                    console.log("🔐 useUserStore: Enviando petición a /api/users/me");
                    
                    const res = await api.get("/api/users/me");
                    
                    console.log("🔐 useUserStore: Respuesta recibida exitosamente");
                    set({ 
                        user: res.data, 
                        isAuthenticated: true, 
                        error: null, 
                        loading: false 
                    });
                    return true;
                    
                } catch (err) {
                    console.error('🔐 useUserStore: Error fetching user data:', err);
                    
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        console.log("🔐 useUserStore: Token inválido, limpiando...");
                        get().logout();
                        return false;
                    } else {
                        // Otros errores, mantener estado pero marcar error
                        set({
                            error: 'Error al obtener datos del usuario',
                            loading: false
                        });
                        return false;
                    }
                }
            },
            
            checkTokenValidity: () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ isAuthenticated: false, user: null, loading: false });
                    return false;
                }
                
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const isExpired = payload.exp * 1000 < Date.now();
                    
                    if (isExpired) {
                        console.log("🔐 useUserStore: Token expirado");
                        get().logout();
                        return false;
                    }
                    
                    return true;
                } catch (error) {
                    console.error("🔐 useUserStore: Error decodificando token:", error);
                    get().logout();
                    return false;
                }
            },
            
            logout: (navigate = null) => {
                console.log("🔐 useUserStore: Cerrando sesión...");
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                
                set({ 
                    isAuthenticated: false, 
                    user: null, 
                    error: null,
                    loading: false 
                });
                
                // Si se proporciona navigate, redirigir
                if (navigate && typeof navigate === 'function') {
                    navigate("/auth");
                }
            },
            
            refreshUserData: async () => {
                if (!get().isAuthenticated) return false;
                return await get().fetchUserData();
            },

            initialize: async () => {
                console.log("🔐 useUserStore: Inicializando...");
                set({ loading: true });
                
                const isValidToken = get().checkTokenValidity();
                if (isValidToken) {
                    await get().fetchUserData();
                } else {
                    set({ loading: false });
                }
            }
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                console.log("🔐 useUserStore: Rehidratando estado...");
                if (state) {
                    state.loading = false;
                    state.error = null;
                }
            }
        }
    )
)