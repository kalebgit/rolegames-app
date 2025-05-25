import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useRoleStore } from '../../stores/useRoleStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function RoleManager() {
  const navigate = useNavigate();
  
  // User store
  const user = useUserStore(state => state.user);
  
  // Role store con sintaxis state => state.prop
  const currentRole = useRoleStore(state => state.currentRole);
  const availableRoles = useRoleStore(state => state.availableRoles);
  const loading = useRoleStore(state => state.loading);
  const setLoading = useRoleStore(state=>state.setLoading)
  const error = useRoleStore(state => state.error);
  const roleInstances = useRoleStore(state => state.roleInstances);
  
  // Actions del role store
  const fetchUserRoles = useRoleStore(state => state.fetchUserRoles);
  const enablePlayerRole = useRoleStore(state => state.enablePlayerRole);
  const enableDungeonMasterRole = useRoleStore(state => state.enableDungeonMasterRole);
  const switchRoleContext = useRoleStore(state => state.switchRoleContext);
  const fetchPlayerInstance = useRoleStore(state => state.fetchPlayerInstance);
  const fetchDungeonMasterInstance = useRoleStore(state => state.fetchDungeonMasterInstance);
  const clearError = useRoleStore(state => state.clearError);
  
  // Utilidades del role store
  const isInPlayerMode = useRoleStore(state => state.isInPlayerMode);
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  const hasRole = useRoleStore(state => state.hasRole);
  const hasMultipleRoles = useRoleStore(state => state.hasMultipleRoles);
  const getPlayerInstance = useRoleStore(state => state.getPlayerInstance);
  const getDMInstance = useRoleStore(state => state.getDMInstance);

  // Local state
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);

  useEffect(() => {
    // Obtener instancias de roles si están disponibles
    if (hasRole('PLAYER') && !getPlayerInstance()) {
      fetchPlayerInstance();
    }
    if (hasRole('DUNGEON_MASTER') && !getDMInstance()) {
      fetchDungeonMasterInstance();
    }
  }, [availableRoles, hasRole, getPlayerInstance, getDMInstance, fetchPlayerInstance, fetchDungeonMasterInstance]);

  // Mostrar errores como toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const handleEnablePlayer = async () => {
    setActionLoading(true);
    setMessage('');
    clearError();
    
    try {
      const result = await enablePlayerRole();
      if (result.success) {
        toast.success('¡Rol de Jugador activado exitosamente!', {
          position: "top-right",
          autoClose: 4000,
        });
        setMessage(result.message);
      } else {
        toast.error(result.message || 'Error al activar rol de Jugador', {
          position: "top-right",
          autoClose: 5000,
        });
        setMessage(result.message);
      }
    } catch (err) {
      toast.error('Error inesperado al activar rol de Jugador', {
        position: "top-right",
        autoClose: 5000,
      });
    }finally{
    setActionLoading(false);
    
    }
  };

  const handleEnableDM = async () => {
    setActionLoading(true);
    setMessage('');
    clearError();
    
    try {
      const result = await enableDungeonMasterRole();
      if (result.success) {
        toast.success('¡Rol de Dungeon Master activado exitosamente!', {
          position: "top-right",
          autoClose: 4000,
        });
        setMessage(result.message);
      } else {
        toast.error(result.message || 'Error al activar rol de Dungeon Master', {
          position: "top-right",
          autoClose: 5000,
        });
        setMessage(result.message);
      }
    } catch (err) {
      toast.error('Error inesperado al activar rol de Dungeon Master', {
        position: "top-right",
        autoClose: 5000,
      });
    }finally{
      setActionLoading(false);
    }
    
  };

  const handleSwitchContext = async (targetRole) => {
    try {
      const result = await switchRoleContext(targetRole);
      if (result.success) {
        const roleName = targetRole === 'PLAYER' ? 'Jugador' : 'Dungeon Master';
        toast.success(`Cambiado a contexto: ${roleName}`, {
          position: "top-right",
          autoClose: 3000,
        });
        setMessage(`Cambiado a contexto: ${roleName}`);
      } else {
        toast.error(result.message || 'Error al cambiar contexto', {
          position: "top-right",
          autoClose: 5000,
        });
        setMessage(result.message);
      }
    } catch (err) {
      toast.error('Error inesperado al cambiar contexto', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  if (loading || actionLoading) {
    return <LoadingSpinner message="Cargando roles..." />;
  }

  const playerInstance = getPlayerInstance();
  const dmInstance = getDMInstance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              ← Volver al Dashboard
            </button>
          </div>
          
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
                <p className="text-lg text-gray-900">{user?.username}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Contexto actual:</span>
                <p className="text-lg text-gray-900">
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    currentRole === 'PLAYER' 
                      ? 'bg-blue-100 text-blue-800' 
                      : currentRole === 'DUNGEON_MASTER'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentRole === 'PLAYER' && '🎮 Jugador'}
                    {currentRole === 'DUNGEON_MASTER' && '🎲 Dungeon Master'}
                    {!currentRole && '⚙️ Configurando...'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-500">Roles disponibles:</span>
              <div className="flex space-x-2 mt-2">
                {hasRole('PLAYER') && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ✅ Jugador
                  </span>
                )}
                {hasRole('DUNGEON_MASTER') && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ✅ Dungeon Master
                  </span>
                )}
                {availableRoles.length === 0 && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    ⚠️ Sin roles adicionales
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cambio de contexto (si tiene múltiples roles) */}
          {hasMultipleRoles() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Cambiar Contexto de Rol</h3>
              <p className="text-yellow-700 mb-4">
                Tienes acceso a múltiples roles. Puedes cambiar el contexto para acceder a diferentes funcionalidades.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSwitchContext('PLAYER')}
                  disabled={!hasRole('PLAYER')}
                  className={`px-4 py-2 rounded-md font-medium ${
                    isInPlayerMode()
                      ? 'bg-blue-600 text-white'
                      : hasRole('PLAYER')
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  🎮 Modo Jugador
                </button>
                <button
                  onClick={() => handleSwitchContext('DUNGEON_MASTER')}
                  disabled={!hasRole('DUNGEON_MASTER')}
                  className={`px-4 py-2 rounded-md font-medium ${
                    isInDMMode()
                      ? 'bg-purple-600 text-white'
                      : hasRole('DUNGEON_MASTER')
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
              
              {hasRole('PLAYER') ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Activo
                    </span>
                  </div>
                  
                  {playerInstance && (
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nivel:</span>
                        <span className="font-medium">{playerInstance.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experiencia:</span>
                        <span className="font-medium">{playerInstance.experience} XP</span>
                      </div>
                      {playerInstance.characterCount !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Personajes:</span>
                          <span className="font-medium">{playerInstance.characterCount}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => navigate('/characters')}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md text-sm"
                  >
                    Ver Mis Personajes
                  </button>
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
              
              {hasRole('DUNGEON_MASTER') ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Activo
                    </span>
                  </div>
                  
                  {dmInstance && (
                    <div className="bg-purple-50 rounded-lg p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Campañas:</span>
                        <span className="font-medium">{dmInstance.campaignCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">NPCs creados:</span>
                        <span className="font-medium">{dmInstance.npcCount || 0}</span>
                      </div>
                      {dmInstance.dmStyle && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estilo:</span>
                          <span className="font-medium">{dmInstance.dmStyle}</span>
                        </div>
                      )}
                      {dmInstance.rating && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calificación:</span>
                          <span className="font-medium">{dmInstance.rating}/5.0</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => navigate('/campaigns')}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-md text-sm"
                  >
                    Ver Mis Campañas
                  </button>
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
              <li>• Cambiar el contexto te permite acceder a diferentes funcionalidades</li>
              <li>• Los roles adicionales mantienen sus datos incluso si cambias de contexto</li>
              <li>• Algunas páginas requieren un rol específico para acceder</li>
              <li>• Puedes cambiar entre roles en cualquier momento desde el dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}