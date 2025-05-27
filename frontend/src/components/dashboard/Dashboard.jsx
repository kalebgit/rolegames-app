import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Acceso directo al store sin hook personalizado
  const currentRole = useRoleStore(state => state.currentRole);
  const availableRoles = useRoleStore(state => state.availableRoles);
  const isInPlayerMode = useRoleStore(state => state.isInPlayerMode);
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  const switchRoleContext = useRoleStore(state => state.switchRoleContext);

  // Funciones de utilidad
  const canActAsPlayer = () => availableRoles.includes('PLAYER');
  const canActAsDM = () => availableRoles.includes('DUNGEON_MASTER');

  const handleQuickAction = async (path, requiredRole = null) => {
    if (requiredRole && currentRole !== requiredRole) {
      // Si tiene el rol pero no está en el contexto correcto, cambiar automáticamente
      if (availableRoles.includes(requiredRole)) {
        const result = await switchRoleContext(requiredRole);
        if (result.success) {
          navigate(path);
        } else {
          alert(`Error al cambiar a modo ${requiredRole}: ${result.message}`);
        }
      } else {
        // No tiene el rol, ir a la página que le dirá cómo obtenerlo
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const quickActions = [
    // Acciones que requieren rol de Player
    {
      title: 'Crear Personaje',
      description: 'Diseña un nuevo aventurero',
      icon: '👤',
      action: () => handleQuickAction('/characters/new', 'PLAYER'),
      color: 'bg-blue-500',
      requiredRole: 'PLAYER',
      visible: canActAsPlayer()
    },
    // Acciones que requieren rol de DM
    {
      title: 'Crear NPC',
      description: 'Diseña personajes no jugables',
      icon: '👥',
      action: () => handleQuickAction('/npcs/new', 'DUNGEON_MASTER'),
      color: 'bg-purple-500',
      requiredRole: 'DUNGEON_MASTER',
      visible: canActAsDM()
    },
    {
      title: 'Nueva Campaña',
      description: 'Comienza una nueva aventura',
      icon: '📖',
      action: () => handleQuickAction('/campaigns/new', 'DUNGEON_MASTER'),
      color: 'bg-green-500',
      requiredRole: 'DUNGEON_MASTER',
      visible: canActAsDM()
    },
    // Acciones compartidas - disponibles para ambos roles
    {
      title: 'Explorar Campañas',
      description: isInDMMode() ? 'Gestiona tus campañas' : 'Ve campañas disponibles',
      icon: '📖',
      action: () => handleQuickAction('/campaigns'),
      color: 'bg-emerald-500',
      requiredRole: null,
      visible: canActAsPlayer() || canActAsDM()
    },
    // Acciones generales (sin rol específico)
    {
      title: 'Iniciar Combate',
      description: 'Gestiona encuentros épicos',
      icon: '⚔️',
      action: () => handleQuickAction('/combat'),
      color: 'bg-red-500',
      requiredRole: null,
      visible: true
    },
    {
      title: 'Explorar Hechizos',
      description: 'Busca la magia perfecta',
      icon: '✨',
      action: () => handleQuickAction('/spells'),
      color: 'bg-yellow-500',
      requiredRole: null,
      visible: true
    },

    {
      title: 'Explorar Sesiones',
      description: isInDMMode() ? 'Gestiona tus sesiones' : 'Ve sesiones en las que participas',
      icon: '📅',
      action: () => handleQuickAction('/sessions'),
      color: 'bg-indigo-500',
      requiredRole: null, // 👈 CLAVE: null significa no cambiar rol
      visible: canActAsPlayer() || canActAsDM()
    },
    {
      title: 'Explorar Encuentros',
      description: isInDMMode() ? 'Gestiona encuentros' : 'Ve encuentros en los que participas',
      icon: '⚔️',
      action: () => handleQuickAction('/encounters'),
      color: 'bg-red-500',
      requiredRole: null, // 👈 CLAVE: null significa no cambiar rol
      visible: canActAsPlayer() || canActAsDM()
    }
  ];

  // Filtrar acciones visibles
  const visibleActions = quickActions.filter(action => action.visible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado del Dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Dashboard de RoleGames
              </h1>
              <p className="text-gray-600">
                Gestiona tus personajes, campañas y aventuras desde este panel principal.
              </p>
            </div>
            
            {/* Indicador de rol actual */}
            <div className="text-right">
              <p className="text-sm text-gray-500">Modo actual:</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isInPlayerMode() 
                  ? 'bg-blue-100 text-blue-800' 
                  : isInDMMode()
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isInPlayerMode() && '🎮 Jugador'}
                {isInDMMode() && '🎲 Dungeon Master'}
                {!currentRole && '⚙️ Configurando...'}
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje de contexto si tiene múltiples roles */}
        {availableRoles.length > 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Tienes múltiples roles disponibles. Algunas opciones dependen de tu modo actual.
                  <button 
                    onClick={() => navigate('/roles')}
                    className="ml-2 underline font-medium hover:text-yellow-800"
                  >
                    Gestionar roles
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Personajes {!canActAsPlayer() && '(Requiere rol Jugador)'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {canActAsPlayer() ? '-' : '🔒'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">📖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Campañas {!canActAsPlayer() && !canActAsDM() && '(Requiere algún rol)'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {canActAsPlayer() || canActAsDM() ? '-' : '🔒'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sesiones</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">⚔️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Encuentros</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas (solo las visibles según roles) */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`p-6 rounded-lg border-2 border-dashed transition-all group relative ${
                  action.requiredRole && currentRole !== action.requiredRole
                    ? 'border-gray-300 hover:border-yellow-400 bg-gray-50'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${action.color} rounded-lg text-white text-2xl mb-3`}>
                    {action.icon}
                  </div>
                  <h3 className={`text-lg font-medium mb-1 ${
                    action.requiredRole && currentRole !== action.requiredRole
                      ? 'text-gray-600'
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {action.description}
                  </p>
                  
                  {/* Indicador de cambio de rol necesario */}
                  {action.requiredRole && currentRole !== action.requiredRole && (
                    <div className="mt-2">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Cambiar a modo {action.requiredRole === 'PLAYER' ? 'Jugador' : 'DM'}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h2>
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">🎲</div>
                <p className="text-gray-500">No hay actividad reciente</p>
                <p className="text-sm text-gray-400 mt-1">
                  Comienza una nueva aventura para ver la actividad aquí
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Próximas Sesiones</h2>
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">📅</div>
                <p className="text-gray-500">No hay sesiones programadas</p>
                <p className="text-sm text-gray-400 mt-1">
                  Programa tu siguiente sesión en el calendario
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}