import React, { useState, useRef } from 'react';

export default function SessionRoom() {
  const [connectedPlayers, setConnectedPlayers] = useState([
    { id: 1, name: 'Jugador 1', avatar: '🧙‍♂️', isReady: true, x: 20, y: 50 },
    { id: 2, name: 'Jugador 2', avatar: '⚔️', isReady: false, x: 80, y: 30 },
    { id: 3, name: 'Jugador 3', avatar: '🏹', isReady: true, x: 80, y: 70 },
    { id: 4, name: 'Jugador 4', avatar: '🛡️', isReady: true, x: 50, y: 20 },
    { id: 5, name: 'Jugador 5', avatar: '⚡', isReady: false, x: 50, y: 80 }
  ]);
  
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef(null);

  const handleMouseDown = (e, player) => {
    const rect = boardRef.current.getBoundingClientRect();
    const playerElement = e.currentTarget;
    const playerRect = playerElement.getBoundingClientRect();
    
    setDraggedPlayer(player.id);
    setDragOffset({
      x: (playerRect.left - rect.left + playerRect.width / 2) - (e.clientX - rect.left),
      y: (playerRect.top - rect.top + playerRect.height / 2) - (e.clientY - rect.top)
    });
  };

  const handleMouseMove = (e) => {
    if (draggedPlayer === null) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const newX = ((e.clientX - rect.left + dragOffset.x) / rect.width) * 100;
    const newY = ((e.clientY - rect.top + dragOffset.y) / rect.height) * 100;
    
    // Limitar a los bordes del tablero
    const clampedX = Math.max(8, Math.min(92, newX));
    const clampedY = Math.max(8, Math.min(92, newY));
    
    setConnectedPlayers(prev => 
      prev.map(player => 
        player.id === draggedPlayer 
          ? { ...player, x: clampedX, y: clampedY }
          : player
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedPlayer(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleAction = (actionType) => {
    console.log(`Acción ejecutada: ${actionType}`);
    setShowActionMenu(false);
  };

  const actionButtons = [
    { 
      id: 'attack', 
      icon: '⚔️', 
      color: 'bg-red-500 hover:bg-red-600', 
      tooltip: 'Realizar Ataque',
      description: 'Ataca a un enemigo con tu arma equipada'
    },
    { 
      id: 'spell', 
      icon: '✨', 
      color: 'bg-purple-500 hover:bg-purple-600', 
      tooltip: 'Lanzar Hechizo',
      description: 'Usa magia para afectar el campo de batalla'
    },
    { 
      id: 'move', 
      icon: '🏃', 
      color: 'bg-blue-500 hover:bg-blue-600', 
      tooltip: 'Mover Personaje',
      description: 'Mueve tu personaje por el tablero'
    },
    { 
      id: 'item', 
      icon: '🎒', 
      color: 'bg-green-500 hover:bg-green-600', 
      tooltip: 'Usar Objeto',
      description: 'Utiliza un objeto de tu inventario'
    },
    { 
      id: 'defend', 
      icon: '🛡️', 
      color: 'bg-yellow-500 hover:bg-yellow-600', 
      tooltip: 'Defenderse',
      description: 'Adopta una postura defensiva'
    },
    { 
      id: 'next_turn', 
      icon: '➡️', 
      color: 'bg-indigo-500 hover:bg-indigo-600', 
      tooltip: 'Siguiente Turno',
      description: 'Pasar al siguiente jugador (Solo DM)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header de la sesión */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sesión #3
              </h1>
              <p className="text-gray-600">Campaña: La Forja del Destino</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">En vivo</span>
              </div>
              <span className="text-sm text-gray-500">
                {connectedPlayers.length} jugadores conectados
              </span>
            </div>
          </div>
        </div>

        {/* Área principal de juego con fondo de pasto */}
        <div className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
          {/* FONDO DE PASTO - Z-INDEX 1 */}
          <div 
            className="absolute inset-0 opacity-30 z-1" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: 'cover'
            }}
          ></div>
          
          <div 
            ref={boardRef}
            className="w-full h-96 relative cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Círculo central - Z-INDEX 10 (encima del pasto, debajo de jugadores) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div 
                className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                onClick={() => setShowActionMenu(!showActionMenu)}
              >
                {/* Efecto de textura */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 opacity-75"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full"></div>
                
                <div className="relative z-10 text-white text-4xl font-bold">
                  {!showActionMenu ? '⚡' : '🎯'}
                </div>
              </div>
            </div>

            {/* Jugadores - Z-INDEX 20 (encima del círculo central) */}
            {connectedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`absolute w-20 h-20 bg-white rounded-full shadow-lg border-4 ${
                  player.isReady ? 'border-green-400' : 'border-gray-300'
                } flex flex-col items-center justify-center cursor-move hover:scale-110 transition-all duration-200 z-20 ${
                  draggedPlayer === player.id ? 'scale-110' : ''
                }`}
                style={{
                  left: `${player.x}%`,
                  top: `${player.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseDown={(e) => handleMouseDown(e, player)}
              >
                <div className="text-2xl mb-1">{player.avatar}</div>
                <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {player.name}
                </div>
                {player.isReady && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            ))}

            {/* Círculos pequeños de acción - Z-INDEX 30 (encima de jugadores) */}
            {showActionMenu && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="relative">
                  {actionButtons.map((action, index) => {
                    const angle = (index * 360) / actionButtons.length;
                    const radius = 100;
                    const x = radius * Math.cos((angle * Math.PI) / 180);
                    const y = radius * Math.sin((angle * Math.PI) / 180);
                    
                    return (
                      <div
                        key={action.id}
                        className="absolute group z-30"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <button
                          onClick={() => handleAction(action.id)}
                          className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center text-white text-xl transition-all duration-200 shadow-2xl hover:scale-110 hover:shadow-2xl border-2 border-white relative z-30`}
                          title={action.tooltip}
                        >
                          {action.icon}
                        </button>
                        
                        {/* Tooltip con descripción - Z-INDEX 40 (encima de todo) */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-2xl border border-gray-700">
                            <div className="font-semibold">{action.tooltip}</div>
                            <div className="text-gray-300 text-xs mt-1">{action.description}</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Botón de cerrar en el centro - Z-INDEX 30 */}
                  <button
                    onClick={() => setShowActionMenu(false)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-lg transition-colors shadow-2xl border-2 border-white z-30"
                    title="Cerrar menú"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instrucciones para el usuario */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Instrucciones de Juego</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• <strong>Arrastra</strong> los jugadores por el tablero para posicionarlos</li>
                <li>• <strong>Haz clic</strong> en el centro para abrir el menú de acciones</li>
                <li>• <strong>Pasa el mouse</strong> sobre los botones para ver qué hacen</li>
                <li>• Los jugadores con ✓ verde están listos para la acción</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}