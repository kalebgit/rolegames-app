import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { useRoleStore } from '../../stores/useRoleStore';
import { toast } from 'react-toastify';


export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Stores
  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logout);
  const currentRole = useRoleStore(state => state.currentRole);
  const availableRoles = useRoleStore(state => state.availableRoles);
  const switchRoleContext = useRoleStore(state => state.switchRoleContext);
  const fetchUserRoles = useRoleStore(state => state.fetchUserRoles);

  // Cargar roles al montar el componente
  useEffect(() => {
    if (user && availableRoles.length === 0) {
      fetchUserRoles();
    }
  }, [user, availableRoles.length, fetchUserRoles]);

  const handleLogout = () => {
    toast.info('Sesión cerrada exitosamente', {
      position: "top-right",
      autoClose: 2000,
    });
    logout(navigate);
  };
  

  const handleRoleSwitch = async (targetRole) => {
    try {
      const result = await switchRoleContext(targetRole);
      if (result.success) {
        const roleName = targetRole === 'PLAYER' ? 'Jugador' : 'Dungeon Master';
        toast.success(`Cambiado a modo ${roleName}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(result.message || 'Error al cambiar rol', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast.error('Error inesperado al cambiar rol', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };
  

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    return path.split('/')[1];
  };

  const currentView = getCurrentView();

  // Funciones de utilidad para roles
  const canActAsPlayer = () => availableRoles.includes('PLAYER');
  const canActAsDM = () => availableRoles.includes('DUNGEON_MASTER');
  const isInPlayerMode = () => currentRole === 'PLAYER';
  const isInDMMode = () => currentRole === 'DUNGEON_MASTER';

  // Items principales que siempre se muestran
  const primaryItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' }
  ];

  // Items específicos para Players
  const playerItems = canActAsPlayer() ? [
    { key: 'characters', label: 'Personajes', icon: '👤', path: '/characters' }
  ] : [];

  // Items específicos para DMs SOLO para creación
  const dmOnlyItems = canActAsDM() ? [
    { key: 'npcs', label: 'NPCs', icon: '👥', path: '/npcs' },
    { key: 'sessions', label: 'Sesiones', icon: '📅', path: '/sessions' },
    { key: 'encounters', label: 'Encuentros', icon: '🗡️', path: '/encounters' }
  ] : [];

  // Items compartidos (ambos roles pueden acceder)
  const sharedItems = [];
  
  // Agregar campañas si tiene cualquiera de los dos roles
  if (canActAsPlayer() || canActAsDM()) {
    sharedItems.push({ key: 'campaigns', label: 'Campañas', icon: '📖', path: '/campaigns' });
  }

  // Agregar otros items compartidos
  sharedItems.push(
    { key: 'spells', label: 'Hechizos', icon: '✨', path: '/spells' },
    { key: 'items', label: 'Objetos', icon: '🎒', path: '/items' },
    { key: 'combat', label: 'Combate', icon: '⚔️', path: '/combat' },
    { key: 'roles', label: 'Roles', icon: '⚙️', path: '/roles' }
  );

  // Combinar items según el rol actual y disponible
  const getVisibleItems = () => {
    let items = [...primaryItems];
    
    // Agregar items según roles disponibles
    if (canActAsPlayer()) {
      items = [...items, ...playerItems];
    }
    
    if (canActAsDM()) {
      items = [...items, ...dmOnlyItems];
    }
    
    // Agregar items compartidos
    items = [...items, ...sharedItems];
    
    return items;
  };

  const visibleItems = getVisibleItems();

  // Agrupar items para móvil por categorías
  const getMobileMenuGroups = () => {
    const groups = [
      {
        title: "Panel Principal",
        items: [{ key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' }]
      }
    ];

    if (canActAsPlayer()) {
      groups.push({
        title: "Gestión de Personajes",
        items: [
          { key: 'characters', label: 'Personajes', icon: '👤', path: '/characters' }
        ]
      });
    }

    if (canActAsDM()) {
      groups.push({
        title: "Gestión de Campañas (DM)",
        items: [
          { key: 'npcs', label: 'NPCs', icon: '👥', path: '/npcs' },
          { key: 'sessions', label: 'Sesiones', icon: '📅', path: '/sessions' },
          { key: 'encounters', label: 'Encuentros', icon: '🗡️', path: '/encounters' }
        ]
      });
    }

    if (canActAsPlayer() || canActAsDM()) {
      groups.push({
        title: "Contenido Compartido",
        items: [
          { key: 'campaigns', label: 'Campañas', icon: '📖', path: '/campaigns' },
          { key: 'spells', label: 'Hechizos', icon: '✨', path: '/spells' },
          { key: 'items', label: 'Objetos', icon: '🎒', path: '/items' }
        ]
      });

      groups.push({
        title: "Herramientas",
        items: [
          { key: 'combat', label: 'Combate', icon: '⚔️', path: '/combat' },
          { key: 'roles', label: 'Gestión de Roles', icon: '⚙️', path: '/roles' }
        ]
      });
    }

    return groups;
  };

  const menuGroups = getMobileMenuGroups();

  // Función para navegar con verificación de roles
  const handleNavigation = (path, requiredRole = null) => {
    if (requiredRole && currentRole !== requiredRole) {
      // Si tiene el rol pero no está en el contexto correcto, cambiar automáticamente
      if (availableRoles.includes(requiredRole)) {
        handleRoleSwitch(requiredRole).then(() => {
          navigate(path);
        });
      } else {
        // No tiene el rol, ir a la página que le dirá cómo obtenerlo
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const getItemStyle = (itemKey, requiredRole = null) => {
    const isActive = currentView === itemKey;
    const needsRoleSwitch = requiredRole && currentRole !== requiredRole;
    
    let baseStyle = "inline-flex items-center px-2 py-1 border-b-2 text-sm font-medium rounded-t-md transition-colors";
    
    if (isActive) {
      baseStyle += " border-blue-500 text-blue-600 bg-blue-50";
    } else if (needsRoleSwitch) {
      baseStyle += " border-transparent text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50";
    } else {
      baseStyle += " border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50";
    }
    
    return baseStyle;
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-lg font-bold text-gray-900">RoleGames</h1>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden xl:ml-4 xl:flex xl:space-x-1">
              {visibleItems.slice(0, 5).map(item => {
                // Determinar si requiere cambio de rol SOLO para items específicos de DM
                let requiredRole = null;
                if (['characters'].includes(item.key)) requiredRole = 'PLAYER';
                if (['npcs', 'sessions', 'encounters'].includes(item.key)) requiredRole = 'DUNGEON_MASTER';
                // campaigns NO requiere rol específico
                
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.path, requiredRole)}
                    className={getItemStyle(item.key, requiredRole)}
                  >
                    <span className="text-xs mr-1">{item.icon}</span>
                    <span className="hidden lg:inline">{item.label}</span>
                    {requiredRole && currentRole !== requiredRole && (
                      <span className="ml-1 text-xs">↻</span>
                    )}
                  </button>
                );
              })}
              
              {/* Dropdown "Más" para items adicionales */}
              {visibleItems.length > 5 && (
                <div className="relative group">
                  <button className="inline-flex items-center px-2 py-1 border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-sm font-medium rounded-t-md transition-colors">
                    <span className="text-xs mr-1">⋯</span>
                    <span className="hidden lg:inline">Más</span>
                  </button>
                  
                  <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {visibleItems.slice(5).map(item => {
                        let requiredRole = null;
                        if (['characters'].includes(item.key)) requiredRole = 'PLAYER';
                        if (['npcs', 'sessions', 'encounters'].includes(item.key)) requiredRole = 'DUNGEON_MASTER';
                        
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleNavigation(item.path, requiredRole)}
                            className={`${
                              currentView === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                            } group flex items-center px-4 py-2 text-sm w-full text-left`}
                          >
                            <span className="mr-3 text-xs">{item.icon}</span>
                            {item.label}
                            {requiredRole && currentRole !== requiredRole && (
                              <span className="ml-auto text-yellow-500">↻</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tablet menu */}
            <div className="hidden md:ml-4 md:flex md:space-x-2 xl:hidden">
              <button
                onClick={() => navigate('/')}
                className={currentView === 'dashboard' ? 'bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm font-medium' : 'text-gray-600 hover:bg-gray-50 px-2 py-1 rounded text-sm font-medium'}
              >
                🏠
              </button>
              
              {menuGroups.slice(1).map(group => (
                <div key={group.title} className="relative group">
                  <button className="text-gray-600 hover:text-blue-600 px-2 py-1 text-xs font-medium flex items-center rounded hover:bg-gray-50">
                    {group.title.split(' ')[0]}
                    <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute left-0 mt-1 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {group.items.map(item => {
                        let requiredRole = null;
                        if (['characters'].includes(item.key)) requiredRole = 'PLAYER';
                        if (['npcs', 'sessions', 'encounters'].includes(item.key)) requiredRole = 'DUNGEON_MASTER';
                        
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleNavigation(item.path, requiredRole)}
                            className={`${
                              currentView === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                            } group flex items-center px-3 py-2 text-sm w-full text-left`}
                          >
                            <span className="mr-2 text-xs">{item.icon}</span>
                            {item.label}
                            {requiredRole && currentRole !== requiredRole && (
                              <span className="ml-auto text-yellow-500">↻</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {/* Indicador de rol actual y switch */}
            {availableRoles.length > 1 && (
              <div className="hidden sm:flex items-center mr-4">
                <div className="flex rounded-md shadow-sm">
                  {availableRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`px-2 py-1 text-xs font-medium ${
                        currentRole === role
                          ? role === 'PLAYER' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${
                        role === 'PLAYER' ? 'rounded-l-md' : 'rounded-r-md border-l'
                      }`}
                    >
                      {role === 'PLAYER' ? '🎮' : '🎲'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Usuario info */}
            <div className="hidden sm:ml-4 sm:flex sm:items-center sm:space-x-2">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-600 max-w-20 truncate">
                  {user?.username}
                </span>
                {currentRole && (
                  <span className="text-xs text-gray-500">
                    {isInPlayerMode() ? 'Jugador' : isInDMMode() ? 'DM' : 'Usuario'}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
              >
                Salir
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-100 inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Abrir menú principal</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
            {/* Selector de rol para móvil */}
            {availableRoles.length > 1 && (
              <div className="px-3 py-2 border-b border-gray-200 mb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Cambiar Rol
                </div>
                <div className="flex space-x-2">
                  {availableRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        currentRole === role
                          ? role === 'PLAYER' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {role === 'PLAYER' ? '🎮 Jugador' : '🎲 DM'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {menuGroups.map(group => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </div>
                {group.items.map(item => {
                  let requiredRole = null;
                  if (['characters'].includes(item.key)) requiredRole = 'PLAYER';
                  if (['npcs', 'sessions', 'encounters'].includes(item.key)) requiredRole = 'DUNGEON_MASTER';
                  
                  const needsRoleSwitch = requiredRole && currentRole !== requiredRole;
                  
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        handleNavigation(item.path, requiredRole);
                        setIsMenuOpen(false);
                      }}
                      className={`${
                        currentView === item.key
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : needsRoleSwitch
                          ? 'border-transparent text-yellow-600 hover:bg-yellow-100 hover:border-yellow-300 hover:text-yellow-800'
                          : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-800'
                      } block px-3 py-2 rounded-md text-sm font-medium w-full text-left border-l-4`}
                    >
                      <span className="mr-2 text-xs">{item.icon}</span>
                      {item.label}
                      {needsRoleSwitch && <span className="ml-1 text-xs">↻</span>}
                    </button>
                  );
                })}
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-1">
                <span className="text-sm text-gray-700">Hola, {user?.username}</span>
                {currentRole && (
                  <div className="text-xs text-gray-500">
                    Modo: {isInPlayerMode() ? 'Jugador' : isInDMMode() ? 'Dungeon Master' : 'Usuario'}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  navigate('/roles');
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-blue-600 hover:bg-blue-50 w-full text-left text-sm font-medium"
              >
                Gestionar Roles
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-red-600 hover:bg-red-50 w-full text-left text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}