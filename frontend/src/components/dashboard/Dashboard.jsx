import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Crear Personaje',
      description: 'Diseña un nuevo aventurero',
      icon: '👤',
      action: () => navigate('/characters/new'),
      color: 'bg-blue-500'
    },
    {
      title: 'Nueva Campaña',
      description: 'Comienza una nueva aventura',
      icon: '📖',
      action: () => navigate('/campaigns/new'),
      color: 'bg-green-500'
    },
    {
      title: 'Iniciar Combate',
      description: 'Gestiona encuentros épicos',
      icon: '⚔️',
      action: () => navigate('/combat'),
      color: 'bg-red-500'
    },
    {
      title: 'Explorar Hechizos',
      description: 'Busca la magia perfecta',
      icon: '✨',
      action: () => navigate('/spells'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado del Dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard de RoleGames
          </h1>
          <p className="text-gray-600">
            Gestiona tus personajes, campañas y aventuras desde este panel principal.
            ¡Que comience la aventura!
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Personajes</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">📖</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Campañas Activas</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
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

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors group"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${action.color} rounded-lg text-white text-2xl mb-3`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actividad Reciente (placeholder) */}
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