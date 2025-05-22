import { useState, useEffect } from "react"
import api from "../api/axiosConfig"

export default function useAuth(){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=>{
        console.log("🔐 useAuth: Iniciando...");
        
        // revisar si hay token
        const token = localStorage.getItem('token')
        console.log("🔐 useAuth: Token encontrado:", !!token);
        
        if(token){
            // Configurar api con timeout y mejor manejo de errores
            api.defaults.timeout = 5000; // 5 segundos timeout
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            fetchUserData()
        } else {
            console.log("🔐 useAuth: No hay token, marcando como no autenticado");
            setLoading(false)
        }
    }, [])
    
    const fetchUserData = async() => {
        console.log("🔐 useAuth: Obteniendo datos del usuario...");
        
        try {
            // Usar variable de entorno o URL relativa para evitar CORS
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
            console.log("🔐 useAuth: Usando API URL:", apiUrl);
            
            const response = await api.get(`${apiUrl}/api/users/me`)
            console.log("🔐 useAuth: Respuesta recibida:", response.data);
            
            setUser(response.data)
            setIsAuthenticated(true)
            setError(null)
        } catch(err) {
            console.error('🔐 useAuth: Error fetching user data:', err);
            console.error('🔐 useAuth: Error details:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            });
            
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