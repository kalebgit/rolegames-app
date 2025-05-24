import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';

export default function AccessDenied({ requiredRole, currentPath }) {
  const navigate = useNavigate();
  const availableRoles = useRoleStore(state => state.availableRoles);
  const switchRoleContext = useRoleStore(state => state.switchRoleContext);
  const enablePlayerRole = useRoleStore(state => state.enablePlayerRole);
  const enableDungeonMasterRole = useRoleStore(state => state.enableDungeonMasterRole);

  const handleSwitchRole = async () => {
    const result = await switchRoleContext(requiredRole);
    if (result.success) {
      // Redirigir a la página original después del cambio
      navigate(currentPath);
    }
  };

  const handleEnableRole = async () => {
    let result;
    if (requiredRole === 'PLAYER') {
      result = await enablePlayerRole();
    } else if (requiredRole === 'DUNGEON_MASTER') {
      result = await enableDungeonMasterRole();
    }
    
    if (result.success) {
      navigate(currentPath);
    }
  };

  const hasRequiredRole = availableRoles.includes(requiredRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Icono de acceso denegado */}
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 13.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h1>
        
        <p className="text-gray-600 mb-6">
          Esta página requiere el rol de{' '}
          <span className="font-semibold text-gray-900">
            {requiredRole === 'PLAYER' ? 'Jugador' : 'Dungeon Master'}
          </span>
          {' '}para acceder.
        </p>

        <div className="space-y-4">
          {hasRequiredRole ? (
            // Ya tiene el rol, solo necesita cambiar contexto
            <div>
              <p className="text-sm text-blue-600 mb-3">
                ✅ Ya tienes este rol. Cambia tu contexto para continuar:
              </p>
              <button
                onClick={handleSwitchRole}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Cambiar a modo {requiredRole === 'PLAYER' ? 'Jugador' : 'Dungeon Master'}
              </button>
            </div>
          ) : (
            // No tiene el rol, necesita activarlo
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Necesitas activar el rol de {requiredRole === 'PLAYER' ? 'Jugador' : 'Dungeon Master'}:
              </p>
              <button
                onClick={handleEnableRole}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Activar rol de {requiredRole === 'PLAYER' ? 'Jugador' : 'Dungeon Master'}
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium"
          >
            Volver al Dashboard
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Puedes tener múltiples roles activos y cambiar entre ellos cuando necesites.
          </p>
        </div>
      </div>
    </div>
  );
}