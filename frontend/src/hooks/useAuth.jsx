import { useState, useEffect } from "react"
import api from "../api/axiosConfig"
import {useNavigate} from "react-router-dom"

export default function useAuth(){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        console.log("🔐 useAuth: Iniciando...");
        
        // revisar si hay token
        const token = localStorage.getItem('token')
        console.log("🔐 useAuth: Token encontrado:", !!token);
        
        if(token){
            console.log("🔐 useAuth: Token (primeros 20 chars):", token.substring(0, 20) + "...");
            
            // Configurar api con timeout y mejor manejo de errores
            api.defaults.timeout = 10000; // 10 segundos timeout
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            console.log("🔐 useAuth: Header Authorization configurado:", api.defaults.headers.common['Authorization']?.substring(0, 30) + "...");
            
            fetchUserData()
        } else {
            console.log("🔐 useAuth: No hay token, marcando como no autenticado");
            setLoading(false)
            setIsAuthenticated(false)
        }
    }, [])
    
    const fetchUserData = async() => {
        console.log("🔐 useAuth: Obteniendo datos del usuario...");
        
        try {
            // Log de la petición antes de enviarla
            console.log("🔐 useAuth: Enviando petición a /api/users/me");
            console.log("🔐 useAuth: Headers de la petición:", {
                'Authorization': api.defaults.headers.common['Authorization']?.substring(0, 30) + "...",
                'Content-Type': api.defaults.headers['Content-Type']
            });
            
            const response = await api.get('/api/users/me')
            console.log("🔐 useAuth: Respuesta recibida:", {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            });
            
            setUser(response.data)
            setIsAuthenticated(true)
            setError(null)
        } catch(err) {
            console.error('🔐 useAuth: Error fetching user data:', err);
            console.error('🔐 useAuth: Error details:', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                headers: err.response?.headers
            });
            
            // Log específico para error 401
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
            
            setError(err.message)
            setIsAuthenticated(false)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        console.log("🔐 useAuth: Cerrando sesión...");
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        console.log(localStorage.getItem('token'))
        setIsAuthenticated(false)
        setUser(null)
        setError(null)
    }
    
    return {
        isAuthenticated, 
        user, 
        loading, 
        error,
        handleLogout, 
        setIsAuthenticated, 
        setUser
    }
}