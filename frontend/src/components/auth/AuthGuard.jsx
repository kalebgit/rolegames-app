import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AuthGuard({ children }) {
    const location = useLocation();
    const loading = useUserStore(state=>state.loading)
    const fetchUserData = useUserStore(state=>state.fetchUserData)
    const checkTokenValidity = useUserStore(state=>state.checkTokenValidity)
    
    useEffect(() => {
        console.log(`🔐 AuthGuard: Verificando autenticación para ${location.pathname}`);
        
        // Verificar si el token es válido antes de hacer petición
        if (checkTokenValidity()) {
            // Si el token parece válido, verificar con el servidor
            fetchUserData();
        }
    }, [location.pathname, fetchUserData, checkTokenValidity]);
    
    if (loading) {
        return <LoadingSpinner message="Verificando autenticación..." />;
    }
    
    return children;
}