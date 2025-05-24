import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useRoleStore } from '../../stores/useRoleStore';
import LoadingSpinner from '../common/LoadingSpinner';
import AccessDenied from './AccessDenied';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  
  // Usuario autenticado
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const userLoading = useUserStore(state => state.loading);
  
  // Roles del usuario
  const currentRole = useRoleStore(state => state.currentRole);
  const availableRoles = useRoleStore(state => state.availableRoles);
  const roleLoading = useRoleStore(state => state.loading);
  const fetchUserRoles = useRoleStore(state => state.fetchUserRoles);

  // Cargar roles si no están cargados
  useEffect(() => {
    if (isAuthenticated && availableRoles.length === 0) {
      console.log("🔐 ProtectedRoute: Cargando roles para verificación");
      fetchUserRoles();
    }
  }, [isAuthenticated, availableRoles.length, fetchUserRoles]);

  // Loading states
  if (userLoading || (isAuthenticated && roleLoading && availableRoles.length === 0)) {
    return <LoadingSpinner message="Verificando permisos..." />;
  }

  // No autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Si no se requiere rol específico, permitir acceso
  if (!requiredRole) {
    return children;
  }

  // Verificar si tiene el rol requerido
  const hasRequiredRole = availableRoles.includes(requiredRole);
  const isInCorrectContext = currentRole === requiredRole;

  console.log(`🔒 ProtectedRoute: Verificando acceso a ${location.pathname}`);
  console.log(`   - Rol requerido: ${requiredRole}`);
  console.log(`   - Rol actual: ${currentRole}`);
  console.log(`   - Tiene rol requerido: ${hasRequiredRole}`);
  console.log(`   - Contexto correcto: ${isInCorrectContext}`);

  // Si no tiene el rol requerido O no está en el contexto correcto
  if (!hasRequiredRole || !isInCorrectContext) {
    return (
      <AccessDenied 
        requiredRole={requiredRole} 
        currentPath={location.pathname}
      />
    );
  }

  // Todo bien, permitir acceso
  return children;
}