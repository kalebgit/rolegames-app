import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();

  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    return path.split('/')[1];
  };

  const currentView = getCurrentView();

  // Items principales que siempre se muestran en desktop
  const primaryItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' },
    { key: 'characters', label: 'Personajes', icon: '👤', path: '/characters' },
    { key: 'campaigns', label: 'Campañas', icon: '📖', path: '/campaigns' },
    { key: 'combat', label: 'Combate', icon: '⚔️', path: '/combat' }
  ];

  // Items secundarios que van en el dropdown "Más"
  const secondaryItems = [
    { key: 'npcs', label: 'NPCs', icon: '👥', path: '/npcs' },
    { key: 'sessions', label: 'Sesiones', icon: '📅', path: '/sessions' },
    { key: 'encounters', label: 'Encuentros', icon: '🗡️', path: '/encounters' },
    { key: 'spells', label: 'Hechizos', icon: '✨', path: '/spells' },
    { key: 'items', label: 'Objetos', icon: '🎒', path: '/items' }
  ];

  // Grupos para móvil
  const menuGroups = [
    {
      title: "Panel Principal",
      items: [{ key: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/' }]
    },
    {
      title: "Gestión de Personajes",
      items: [
        { key: 'characters', label: 'Personajes', icon: '👤', path: '/characters' },
        { key: 'npcs', label: 'NPCs', icon: '👥', path: '/npcs' }
      ]
    },
    {
      title: "Gestión de Campañas",
      items: [
        { key: 'campaigns', label: 'Campañas', icon: '📖', path: '/campaigns' },
        { key: 'sessions', label: 'Sesiones', icon: '📅', path: '/sessions' },
        { key: 'encounters', label: 'Encuentros', icon: '🗡️', path: '/encounters' }
      ]
    },
    {
      title: "Recursos del Juego",
      items: [
        { key: 'spells', label: 'Hechizos', icon: '✨', path: '/spells' },
        { key: 'items', label: 'Objetos', icon: '🎒', path: '/items' }
      ]
    },
    {
      title: "Herramientas",
      items: [{ key: 'combat', label: 'Combate', icon: '⚔️', path: '/combat' }]
    }
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            {/* Logo más compacto */}
            <div className="flex-shrink-0">
              <h1 className="text-lg font-bold text-gray-900">RoleGames</h1>
            </div>
            
            {/* Desktop menu - Solo items principales + dropdown "Más" */}
            <div className="hidden xl:ml-4 xl:flex xl:space-x-1">
              {primaryItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`${
                    currentView === item.key
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  } inline-flex items-center px-2 py-1 border-b-2 text-sm font-medium rounded-t-md transition-colors`}
                >
                  <span className="text-xs mr-1">{item.icon}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              ))}
              
              {/* Dropdown "Más" para items secundarios */}
              <div className="relative group">
                <button className="inline-flex items-center px-2 py-1 border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 text-sm font-medium rounded-t-md transition-colors">
                  <span className="text-xs mr-1">⋯</span>
                  <span className="hidden lg:inline">Más</span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {secondaryItems.map(item => (
                      <button
                        key={item.key}
                        onClick={() => navigate(item.path)}
                        className={`${
                          currentView === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        } group flex items-center px-4 py-2 text-sm w-full text-left`}
                      >
                        <span className="mr-3 text-xs">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tablet menu - Dropdown simplificado */}
            <div className="hidden md:ml-4 md:flex md:space-x-2 xl:hidden">
              <button
                onClick={() => navigate('/')}
                className={`${
                  currentView === 'dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                } px-2 py-1 rounded text-sm font-medium`}
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
                      {group.items.map(item => (
                        <button
                          key={item.key}
                          onClick={() => navigate(item.path)}
                          className={`${
                            currentView === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                          } group flex items-center px-3 py-2 text-sm w-full text-left`}
                        >
                          <span className="mr-2 text-xs">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            {/* Usuario info - más compacto */}
            <div className="hidden sm:ml-4 sm:flex sm:items-center sm:space-x-2">
              <span className="text-xs text-gray-600 max-w-20 truncate">
                {user?.username}
              </span>
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
            {menuGroups.map(group => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </div>
                {group.items.map(item => (
                  <button
                    key={item.key}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`${
                      currentView === item.key
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-800'
                    } block px-3 py-2 rounded-md text-sm font-medium w-full text-left border-l-4`}
                  >
                    <span className="mr-2 text-xs">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-1">
                <span className="text-sm text-gray-700">Hola, {user?.username}</span>
              </div>
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