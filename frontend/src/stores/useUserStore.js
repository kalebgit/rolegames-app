import {createStore, useStore} from 'zustand'
import { persist } from 'zustand/middleware'

import api from '../api/axiosConfig'

const userStore = createStore(
    persist(
        (set, get)=>({
            user: null,
            isAuthenticated: false,
            loading: true,
            error: null,
            //setters
            //shorthand pues el valor y clave se llaman igual
            setUser: (user)=>set({ user }),
            setIsAuthenticated: (val) => set({ isAuthenticated: val }) ,
            setLoading: (loading)=>set({ loading }),
            setError: (error)=>set({ error }),
        
            //actions
            fetchUserData: async()=>{
                console.log("🔐 useAuth: Obteniendo datos del usuario...");
                const token = localStorage.getItem('token')
                if(!token){
                    console.log("🔐 useAuth: token no encontrado");
                    return set({isAuthenticated: false, loading: false})
                }
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`

                try{
                    console.log("🔐 useAuth: Enviando petición a /api/users/me");
                    console.log("🔐 useAuth: Headers de la petición:", {
                        'Authorization': api.defaults.headers.common['Authorization']?.substring(0, 30) + "...",
                        'Content-Type': api.defaults.headers['Content-Type']
                    });

                    const res = await api.get("/api/users/me")

                    console.log("🔐 useAuth: Respuesta recibida:", {
                        status: response.status,
                        statusText: response.statusText,
                        data: response.data
                    });

                    return set({user: res.data, isAuthenticated: true, error: null})
                }catch (err) {

                    console.error('🔐 useAuth: Error fetching user data:', err);
                    console.error('🔐 useAuth: Error details:', {
                        message: err.message,
                        status: err.response?.status,
                        statusText: err.response?.statusText,
                        data: err.response?.data,
                        headers: err.response?.headers
                    });

                    if (err.response?.status === 401) {
                        console.error('🔐 useAuth: Error 401 - Token inválido o expirado');
                        console.error('🔐 useAuth: Token actual:', localStorage.getItem('token')?.substring(0, 20) + "...");
                    }
                    
                    // Si el token es inválido, limpiarlo
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        console.log("🔐 useAuth: Token inválido, limpiando...");
                        localStorage.removeItem('token')
                        delete api.defaults.headers.common['Authorization']
                    }
                    return set({
                        error: err.message,
                        isAuthenticated: false,
                        user: null
                    })
                    } finally {
                        return set({ loading: false })
                    }
                },

            logout: (navigate) => {
                console.log("🔐 useAuth: Cerrando sesión...");
                localStorage.removeItem('token')
                delete api.defaults.headers.common['Authorization']
                console.log(localStorage.getItem('token'))
                set({ isAuthenticated: false, user: null, error: null })
                navigate("/auth")
            },

        })
        , 
        {
            key: 'user-storage'
        }
   ))

export const useUserStore = ()=>useStore(userStore)