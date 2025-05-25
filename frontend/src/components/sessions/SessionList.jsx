import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react'; 
import useSessions from '../../hooks/sessions/useSessions';


export default function SessionList({ onSessionSelect, onCreateSession }) {
  const { sessions, loading, error, deleteSession } = useSessions();
  const [filter, setFilter] = useState('');
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);
  
  // En handleDelete, envolver con try-catch:
  const handleDelete = async (sessionId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sesión?')) {
      try {
        await deleteSession(sessionId);
        toast.success('Sesión eliminada exitosamente', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        toast.error('Error al eliminar la sesión', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.campaign?.name.toLowerCase().includes(filter.toLowerCase())
  );


  if (loading) {
    return <LoadingSpinner message="Cargando sesiones..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Historial de Sesiones</h1>
            <button 
              onClick={onCreateSession}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Nueva Sesión
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por campaña..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            {filteredSessions.map(session => (
              <div key={session.sessionId} className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sesión #{session.sessionNumber}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {session.campaign?.name}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Fecha:</span>
                        <span className="ml-2">{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duración:</span>
                        <span className="ml-2">{session.duration || 'No registrada'} minutos</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Jugadores:</span>
                        <span className="ml-2">{session.attendingPlayers?.length || 0}</span>
                      </div>
                    </div>

                    {session.summary && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Resumen:</h4>
                        <p className="text-gray-700 text-sm">{session.summary}</p>
                      </div>
                    )}

                    {session.encountersCompleted?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Encuentros completados:</h4>
                        <div className="flex flex-wrap gap-2">
                          {session.encountersCompleted.map(encounter => (
                            <span 
                              key={encounter.encounterId}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {encounter.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {session.nextSessionObjectives && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Objetivos para la próxima sesión:</h4>
                        <p className="text-gray-700 text-sm">{session.nextSessionObjectives}</p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 space-y-2">
                    <button 
                      onClick={() => onSessionSelect(session.sessionId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Ver Detalles
                    </button>
                    <button 
                      onClick={() => onSessionSelect(session.sessionId, 'edit')}
                      className="block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(session.sessionId)}
                      className="block bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No se encontraron sesiones</p>
              <p className="text-gray-400 text-sm mt-2">Crear tu primera sesión para comenzar a registrar tus aventuras</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}