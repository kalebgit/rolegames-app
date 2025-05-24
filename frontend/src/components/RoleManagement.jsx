import React, { useState } from 'react';
import useUserRoles from '../../hooks/useUserRoles';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RoleManagement() {
  const {
    roles,
    loading,
    error,
    enablePlayerRole,
    enableDungeonMasterRole,
    disableRole,
    switchRoleContext
  } = useUserRoles();

  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentContext, setCurrentContext] = useState(roles.primaryRole);

  const handleEnablePlayer = async () => {
    setActionLoading(true);
    setMessage('');
    
    const result = await enablePlayerRole();
    setMessage(result.message);
    
    setActionLoading(false);
  };

  const handleEnableDM = async () => {
    setActionLoading(true);
    setMessage('');
    
    const result = await enableDungeonMasterRole();
    setMessage(result.message);
    
    setActionLoading(false);
  };

  const handleDisableRole = async (roleType) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar el rol ${roleType}?`)) {
      setActionLoading(true);
      setMessage('');
      
      const result = await disableRole(roleType);
      setMessage(result.message);
      
      setActionLoading(false);
    }
  };

  const handleSwitchContext = async (targetRole) => {
    const result = await switchRoleContext(targetRole);
    if (result.success) {
      setCurrentContext(targetRole);
      setMessage(`Cambiado a contexto: ${targetRole}`);
    } else {
      setMessage(result.message);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando roles..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Roles</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {/* Información actual del usuario */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu perfil actual</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Usuario:</span>
                <p className="text-lg text-gray-900">{roles.username}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Rol principal:</span>
                <p className="text-lg text-gray-900">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    roles.primaryRole === 'PLAYER' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {roles.primaryRole === 'PLAYER' ? 'Jugador' : 'Dungeon Master'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">Roles disponibles:</span>
              <div className="flex space-x-2 mt-2">
                {roles.canActAsPlayer && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ✅ Jugador
                  </span>
                )}
                {roles.canActAsDungeonMaster && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ✅ Dungeon Master
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cambio de contexto (si tiene múltiples roles) */}
          {(roles.canActAsPlayer && roles.canActAsDungeonMaster) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Cambiar Contexto de Rol</h3>
              <p className="text-yellow-700 mb-4">
                Tienes acceso a múltiples roles. Puedes cambiar el contexto para acceder a diferentes funcionalidades.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSwitchContext('PLAYER')}
                  className={`px-4 py-2 rounded-md font-medium ${
                    currentContext === 'PLAYER'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  🎮 Modo Jugador
                </button>
                <button
                  onClick={() => handleSwitchContext('DUNGEON_MASTER')}
                  className={`px-4 py-2 rounded-md font-medium ${
                    currentContext === 'DUNGEON_MASTER'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  🎲 Modo Dungeon Master
                </button>
              </div>
            </div>
          )}

          {/* Activar roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Rol de Jugador */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎮</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Rol de Jugador</h3>
                  <p className="text-sm text-gray-600">Crea y gestiona personajes</p>
                </div>
              </div>
              
              {roles.canActAsPlayer ? (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Activo
                  </span>
                  {roles.primaryRole !== 'PLAYER' && (
                    <button
                      onClick={() => handleDisableRole('PLAYER')}
                      disabled={actionLoading}
                      className="mt-3 block w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm disabled:opacity-50"
                    >
                      Desactivar
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleEnablePlayer}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Activando...' : 'Activar Rol de Jugador'}
                </button>
              )}
            </div>

            {/* Rol de Dungeon Master */}
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎲</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Rol de Dungeon Master</h3>
                  <p className="text-sm text-gray-600">Dirige campañas y crea NPCs</p>
                </div>
              </div>
              
              {roles.canActAsDungeonMaster ? (
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Activo
                  </span>
                  {roles.primaryRole !== 'DUNGEON_MASTER' && (
                    <button
                      onClick={() => handleDisableRole('DUNGEON_MASTER')}
                      disabled={actionLoading}
                      className="mt-3 block w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm disabled:opacity-50"
                    >
                      Desactivar
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleEnableDM}
                  disabled={actionLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Activando...' : 'Activar Rol de DM'}
                </button>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Información sobre roles</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Puedes tener múltiples roles activos al mismo tiempo</li>
              <li>• El rol principal no se puede desactivar</li>
              <li>• Cambiar el contexto te permite acceder a diferentes funcionalidades</li>
              <li>• Los roles adicionales mantienen sus datos incluso si se desactivan temporalmente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}