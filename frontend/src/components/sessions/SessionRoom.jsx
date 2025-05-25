import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';
import useSessionRoom from '../../hooks/sessions/useSessionRoom';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function SessionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionId = parseInt(id);
  
  // Role management
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  
  // Session room data
  const {
    session,
    connectedPlayers,
    combatState,
    loading,
    error,
    startCombat,
    nextTurn,
    endCombat,
    castSpell,
    performAttack
  } = useSessionRoom(sessionId);

  // Local state
  const [selectedAction, setSelectedAction] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const handleAction = async (actionType) => {
    try {
      switch (actionType) {
        case 'attack':
          await performAttack({ type: 'basic_attack' });
          toast.success('Ataque realizado');
          break;
        case 'spell':
          await castSpell({ spellId: 1 });
          toast.success('Hechizo lanzado');
          break;
        case 'next_turn':
          if (isInDMMode) {
            await nextTurn();
            toast.success('Turno avanzado');
          }
          break;
        default:
          break;
      }
      setShowActionMenu(false);
      setSelectedAction(null);
    } catch (err) {
      toast.error(`Error al ejecutar ${actionType}`);
    }
  };

  const getPlayerPosition = (index, total) => {
    const angle = (index * 360) / total;
    const radius = 200; // Radio del círculo
    const centerX = 50; // Centro en porcentaje
    const centerY = 50;
    
    const x = centerX + (radius / 8) * Math.cos((angle * Math.PI) / 180);
    const y = centerY + (radius / 8) * Math.sin((angle * Math.PI) / 180);
    
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  if (loading) {
    return <LoadingSpinner message="Conectando a la sesión..." />;
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Sesión no encontrada'}</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Volver a Campañas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header de la sesión */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sesión #{session.sessionNumber}
              </h1>
              <p className="text-gray-600">{session.campaignName}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">En vivo</span>
              </div>
              <span className="text-sm text-gray-500">
                {connectedPlayers.length} jugadores conectados
              </span>
              <button
                onClick={() => navigate('/campaigns')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Área principal de juego */}
        <div className="bg-white rounded-lg shadow-lg p-8 relative">
          <div className="w-full h-96 relative">
            {/* Círculo de jugadores */}
            {connectedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="absolute w-20 h-20 bg-white rounded-full shadow-lg border-4 border-blue-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                style={getPlayerPosition(index, connectedPlayers.length)}
              >
                <div className="text-2xl mb-1">{player.avatar}</div>
                <div className="text-xs font-medium text-gray-700 text-center">
                  {player.name}
                </div>
                {player.isReady && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            ))}

            {/* Centro del círculo - Área de acciones */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center">
                {!showActionMenu ? (
                  <button
                    onClick={() => setShowActionMenu(true)}
                    className="text-white text-4xl hover:scale-110 transition-transform"
                  >
                    ⚡
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    {/* Botón de Ataque */}
                    <button
                      onClick={() => handleAction('attack')}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                      title="Atacar"
                    >
                      ⚔️
                    </button>
                    
                    {/* Botón de Hechizo */}
                    <button
                      onClick={() => handleAction('spell')}
                      className="w-8 h-8 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                      title="Lanzar Hechizo"
                    >
                      ✨
                    </button>
                    
                    {/* Botón de Siguiente Turno (solo DM) */}
                    {isInDMMode && (
                      <button
                        onClick={() => handleAction('next_turn')}
                        className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                        title="Siguiente Turno"
                      >
                        ➡️
                      </button>
                    )}
                    
                    {/* Botón de cerrar */}
                    <button
                      onClick={() => setShowActionMenu(false)}
                      className="w-8 h-8 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                      title="Cerrar"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel de información de combate */}
        {combatState && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Combate en Progreso - Ronda {combatState.currentRound}
              </h3>
              {isInDMMode && (
                <button
                  onClick={endCombat}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Finalizar Combate
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {combatState.initiativeOrder?.slice(0, 3).map((initiative, index) => (
                <div 
                  key={initiative.initiativeId}
                  className={`p-4 rounded-lg border ${
                    initiative.currentTurn 
                      ? 'bg-yellow-50 border-yellow-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{initiative.characterName}</h4>
                    <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {initiative.initiativeRoll}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>PV: {initiative.hitPoints}/{initiative.maxHitPoints}</div>
                    <div>CA: {initiative.armorClass}</div>
                    {initiative.currentTurn && (
                      <div className="text-yellow-600 font-medium mt-1">
                        🎯 Turno actual
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Panel de chat/log de acciones */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Log de Acciones</h3>
          <div className="h-32 bg-gray-50 rounded-lg p-4 overflow-y-auto">
            <div className="text-sm text-gray-600 space-y-1">
              <div>🎮 <span className="font-medium">Jugador 1</span> se ha unido a la sesión</div>
              <div>⚔️ <span className="font-medium">Jugador 2</span> atacó al Goblin</div>
              <div>✨ <span className="font-medium">Jugador 3</span> lanzó Proyectil Mágico</div>
              <div>🎲 <span className="font-medium">DM</span> avanzó al siguiente turno</div>
            </div>
          </div>
        </div>

        {/* Panel de controles del DM */}
        {isInDMMode && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Controles del DM</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate(`/encounters/new?sessionId=${sessionId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
              >
                Crear Encuentro
              </button>
              <button
                onClick={() => {/* TODO: Implementar inicio de combate */}}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium"
              >
                Iniciar Combate
              </button>
              <button
                onClick={() => navigate(`/sessions/${sessionId}/edit`)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium"
              >
                Configurar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}