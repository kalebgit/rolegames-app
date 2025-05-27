import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';
import { useUserStore } from '../../stores/useUserStore';
import useSessionRoom from '../../hooks/sessions/useSessionRoom';
import { useWebSocket } from '../../services/WebSocketService';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';

// Componentes auxiliares (mantienen la misma estructura)
function ItemTooltip({ item, type }) {
  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 border border-gray-700">
      <div className="font-semibold text-yellow-300">{item.name}</div>
      {type === 'armor' && (
        <>
          <div>AC: {item.ac}</div>
          <div>Type: {item.type}</div>
        </>
      )}
      {type === 'weapons' && (
        <>
          <div>Damage: {item.damage}</div>
          <div>Type: {item.type}</div>
        </>
      )}
      {type === 'items' && (
        <div>Effect: {item.effect}</div>
      )}
      <div className={`text-xs ${item.rarity === 'Common' ? 'text-gray-300' : 
        item.rarity === 'Uncommon' ? 'text-green-300' : 
        item.rarity === 'Rare' ? 'text-blue-300' : 'text-purple-300'}`}>
        {item.rarity}
      </div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  );
}

function NPCTooltip({ npc, onAddToEncounter }) {
  return (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50 border border-gray-700">
      <div className="font-semibold text-yellow-300">{npc.name}</div>
      <div>HP: {npc.hp}</div>
      <div>AC: {npc.ac}</div>
      <div>CR: {npc.cr}</div>
      <div>Type: {npc.type}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToEncounter(npc);
        }}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
      >
        Add to Encounter
      </button>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  );
}

function ActionLog({ messages }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-64 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-3">Registro de Acciones</h3>
      <div className="space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay acciones aún...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id || index} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-blue-500">
              <div className="font-medium text-gray-900">
                {msg.character || msg.type === 'system' ? 'Sistema' : 'Jugador'}
              </div>
              <div className="text-gray-600">{msg.message}</div>
              <div className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AccessRestrictionMessage({ hasCharacterInEncounter, onAddCharacter }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🎭</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acceso Restringido
        </h1>
        
        <p className="text-gray-600 mb-6">
          Para acceder a la sala de sesión como jugador, necesitas tener un personaje 
          participando en el encuentro actual.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onAddCharacter}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium"
          >
            Agregar Personaje al Encuentro
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-medium"
          >
            Volver Atrás
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 Los DMs pueden acceder sin restricciones para gestionar el encuentro
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SessionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionId = parseInt(id);
  
  // Stores
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  const isInPlayerMode = useRoleStore(state => state.isInPlayerMode);
  const currentRole = useRoleStore(state => state.currentRole);
  const user = useUserStore(state => state.user);
  
  // Session room hook
  const {
    session,
    encounter,
    combatState,
    loading: sessionLoading,
    error: sessionError,
    createEncounter,
    addParticipantToEncounter,
    startCombat,
    nextTurn,
    endCombat,
    refreshSession
  } = useSessionRoom(sessionId);

  // WebSocket connection (solo si hay encounter)
  const {
    isConnected,
    participants,
    connectedUsers,
    messages,
    error: wsError,
    performAction,
    rollDice,
    addNPCToEncounter: wsAddNPC,
    updatePlayerPosition
  } = useWebSocket(
    sessionId, 
    user?.userId, 
    encounter?.encounterId
  );

  // Local state
  const [playerCharacters, setPlayerCharacters] = useState([]);
  const [npcs, setNPCs] = useState([]);
  const [items, setItems] = useState({ armor: [], weapons: [], items: [] });
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showModals, setShowModals] = useState({
    armor: false,
    weapons: false,
    items: false,
    npcs: false
  });

  const boardRef = useRef(null);

  // ========================================
  // ACCESS CONTROL
  // ========================================
  const hasCharacterInEncounter = useMemo(() => {
    if (isInDMMode) return true; // DM siempre tiene acceso
    if (!encounter || !encounter.participantIds || !playerCharacters.length) return false;
    
    // Verificar si algún personaje del jugador está en el encuentro
    return playerCharacters.some(char => 
      encounter.participantIds.includes(char.characterId)
    );
  }, [isInDMMode, encounter, playerCharacters]);

  // ========================================
  // DATA FETCHING
  // ========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener personajes del jugador (si es jugador)
        if (currentRole === 'PLAYER' && user?.userId) {
          const charactersResponse = await api.get(`/api/characters/player/${user.userId}`);
          setPlayerCharacters(charactersResponse.data || []);
        }

        // Obtener NPCs (si es DM)
        if (isInDMMode) {
          const npcsResponse = await api.get('/api/npcs');
          setNPCs(npcsResponse.data || []);
        }

        // Obtener items (simulados por ahora)
        setItems({
          armor: [
            { id: 1, name: 'Leather Armor', ac: 11, type: 'Light', rarity: 'Common' },
            { id: 2, name: 'Chain Mail', ac: 16, type: 'Heavy', rarity: 'Common' }
          ],
          weapons: [
            { id: 4, name: 'Longsword', damage: '1d8', type: 'Melee', rarity: 'Common' },
            { id: 5, name: 'Shortbow', damage: '1d6', type: 'Ranged', rarity: 'Common' }
          ],
          items: [
            { id: 7, name: 'Health Potion', effect: 'Heal 2d4+2', rarity: 'Common' },
            { id: 8, name: 'Rope (50ft)', effect: 'Utility', rarity: 'Common' }
          ]
        });

      } catch (error) {
        console.error('Error fetching session data:', error);
        toast.error('Error al cargar datos de la sesión');
      }
    };

    fetchData();
  }, [currentRole, user?.userId, isInDMMode]);

  // ========================================
  // ENCOUNTER MANAGEMENT
  // ========================================
  const handleCreateEncounter = async () => {
    if (!isInDMMode) {
      toast.error('Solo el DM puede crear encuentros');
      return;
    }

    try {
      const encounterData = {
        name: `Encuentro de Sesión #${session?.sessionNumber}`,
        description: 'Encuentro creado automáticamente para la sesión',
        encounterType: 'COMBAT',
        difficulty: 'MEDIUM',
        isCompleted: false
      };

      await createEncounter(encounterData);
      toast.success('Encuentro creado exitosamente');
    } catch (error) {
      toast.error('Error al crear encuentro');
    }
  };

  const handleAddCharacterToEncounter = async (characterId = null) => {
    if (!encounter) {
      // Si no hay encuentro, crear uno primero
      if (isInDMMode) {
        await handleCreateEncounter();
        return;
      } else {
        toast.error('No hay encuentro activo. Solicita al DM que cree uno.');
        return;
      }
    }

    try {
      let charId = characterId;
      
      // Si es jugador y no se especifica personaje, usar el primero disponible
      if (!charId && currentRole === 'PLAYER' && playerCharacters.length > 0) {
        charId = playerCharacters[0].characterId;
      }

      if (!charId) {
        toast.error('No se encontró personaje para agregar');
        return;
      }

      await addParticipantToEncounter(charId);
      toast.success('Personaje agregado al encuentro');
      refreshSession();
    } catch (error) {
      toast.error('Error al agregar personaje al encuentro');
    }
  };

  // ========================================
  // COMBAT ACTIONS
  // ========================================
  const handleAction = async (actionType) => {
    if (!encounter || !hasCharacterInEncounter) {
      toast.error('No puedes realizar acciones sin un personaje en el encuentro');
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    
    try {
      switch (actionType) {
        case 'attack':
          await performAction({
            actionType: 'ATTACK',
            characterId: playerCharacters[0]?.characterId,
            diceResult: true // Por ahora simplificado
          });
          break;
          
        case 'spell':
          await performAction({
            actionType: 'CAST_SPELL',
            characterId: playerCharacters[0]?.characterId,
            diceResult: true
          });
          break;
          
        case 'next_turn':
          if (isInDMMode) {
            await nextTurn();
          }
          break;
          
        default:
          toast.info(`Acción ${actionType} no implementada aún`);
      }
    } catch (error) {
      toast.error('Error al realizar acción');
    }
    
    setShowActionMenu(false);
  };

  const handleDiceRoll = (rollData) => {
    rollDice({
      type: rollData.type || 'd20',
      result: rollData.total,
      timestamp: rollData.timestamp
    });
  };

  const handleAddNPCToEncounter = async (npc) => {
    if (!isInDMMode) {
      toast.error('Solo el DM puede agregar NPCs');
      return;
    }

    try {
      // Primero agregar via API
      await addParticipantToEncounter(npc.id);
      
      // Luego notificar via WebSocket
      wsAddNPC({
        npcId: npc.id,
        name: npc.name,
        hp: npc.hp,
        ac: npc.ac
      });
      
      toast.success(`${npc.name} agregado al encuentro`);
      setShowModals(prev => ({ ...prev, npcs: false }));
    } catch (error) {
      toast.error('Error al agregar NPC');
    }
  };

  // ========================================
  // DRAG AND DROP
  // ========================================
  const handleMouseDown = (e, playerId) => {
    const rect = boardRef.current.getBoundingClientRect();
    const playerElement = e.currentTarget;
    const playerRect = playerElement.getBoundingClientRect();
    
    setDraggedPlayer(playerId);
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
    
    const clampedX = Math.max(8, Math.min(92, newX));
    const clampedY = Math.max(8, Math.min(92, newY));
    
    // Actualizar posición localmente y via WebSocket
    updatePlayerPosition(draggedPlayer, { x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setDraggedPlayer(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // ========================================
  // RENDER LOGIC
  // ========================================
  if (sessionLoading) {
    return <LoadingSpinner message="Cargando sala de sesión..." />;
  }

  if (sessionError || wsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{sessionError || wsError}</p>
          <button
            onClick={() => navigate('/sessions')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
          >
            Volver a Sesiones
          </button>
        </div>
      </div>
    );
  }

  // Verificar acceso para jugadores
  if (!hasCharacterInEncounter) {
    return (
      <AccessRestrictionMessage 
        hasCharacterInEncounter={hasCharacterInEncounter}
        onAddCharacter={() => handleAddCharacterToEncounter()}
      />
    );
  }

  // Action buttons configuration
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
    ...(isInDMMode ? [{ 
      id: 'next_turn', 
      icon: '➡️', 
      color: 'bg-indigo-500 hover:bg-indigo-600', 
      tooltip: 'Siguiente Turno',
      description: 'Pasar al siguiente jugador (Solo DM)'
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session ? `Sesión #${session.sessionNumber}` : 'Sala de Sesión'}
              </h1>
              <p className="text-gray-600">
                {session ? session.campaignName : 'Cargando...'}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  currentRole === 'PLAYER' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {currentRole === 'PLAYER' ? '🎮 Jugador' : '🎲 Dungeon Master'}
                </span>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {isConnected ? 'En vivo' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {connectedUsers.length} usuarios conectados
              </span>
              {!encounter && isInDMMode && (
                <button
                  onClick={handleCreateEncounter}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Crear Encuentro
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Board */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6 relative overflow-hidden">
              {/* Game board */}
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
                {/* Central action circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div 
                    className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
                    onClick={() => setShowActionMenu(!showActionMenu)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 opacity-75"></div>
                    <div className="absolute inset-2 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full"></div>
                    
                    <div className="relative z-10 text-white text-4xl font-bold">
                      {!showActionMenu ? '⚡' : '🎯'}
                    </div>
                  </div>
                </div>

                {/* Connected Users/Players */}
                {connectedUsers.map((user, index) => (
                  <div
                    key={user.userId}
                    className="absolute w-20 h-20 bg-white rounded-full shadow-lg border-4 border-green-400 flex flex-col items-center justify-center cursor-move hover:scale-110 transition-all duration-200 z-20"
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, user.userId)}
                  >
                    <div className="text-2xl mb-1">👤</div>
                    <div className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {user.username || `User ${user.userId}`}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                ))}

                {/* Action menu */}
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

              {/* Bottom inventory bar */}
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-4">
                  {/* Player inventory slots */}
                  {currentRole === 'PLAYER' && (
                    <>
                      <button
                        onClick={() => setShowModals(prev => ({ ...prev, armor: true }))}
                        className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-gray-500"
                        title="Armaduras"
                      >
                        🛡️
                      </button>

                      <button
                        onClick={() => setShowModals(prev => ({ ...prev, weapons: true }))}
                        className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-red-500"
                        title="Armas"
                      >
                        ⚔️
                      </button>

                      <button
                        onClick={() => setShowModals(prev => ({ ...prev, items: true }))}
                        className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-green-500"
                        title="Objetos"
                      >
                        🎒
                      </button>
                    </>
                  )}

                  {/* DM inventory slots */}
                  {isInDMMode && (
                    <>
                      <button
                        onClick={() => setShowModals(prev => ({ ...prev, npcs: true }))}
                        className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-purple-500"
                        title="NPCs"
                      >
                        👥
                      </button>

                      <button
                        onClick={() => setShowModals(prev => ({ ...prev, items: true }))}
                        className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-blue-500"
                        title="Objetos"
                      >
                        📦
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="text-blue-500 text-xl">💡</div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Instrucciones de Juego</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Arrastra</strong> los avatares por el tablero para posicionar jugadores</li>
                    <li>• <strong>Haz clic</strong> en el centro para abrir el menú de acciones</li>
                    <li>• <strong>Las acciones</strong> se sincronizan en tiempo real con otros jugadores</li>
                    <li>• <strong>Usa el inventario</strong> desde los botones inferiores</li>
                    {isInDMMode && (
                      <li>• <strong>Como DM</strong> puedes agregar NPCs y gestionar el encuentro</li>
                    )}
                    {!encounter && (
                      <li>• <strong>Nota:</strong> Se requiere un encuentro activo para acciones de combate</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Log */}
            <ActionLog messages={messages} />

            {/* Connection Status */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Estado de Conexión</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>WebSocket:</span>
                  <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Encuentro:</span>
                  <span className="font-medium">{encounter ? encounter.name : 'Sin encuentro'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Participantes:</span>
                  <span className="font-medium">{participants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Usuarios conectados:</span>
                  <span className="font-medium">{connectedUsers.length}</span>
                </div>
              </div>
            </div>

            {/* Combat State */}
            {combatState && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Estado del Combate</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Ronda:</span>
                    <span className="font-medium">{combatState.currentRound}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turno actual:</span>
                    <span className="font-medium">{combatState.currentTurn || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">Combate Activo</span>
                  </div>
                </div>
              </div>
            )}

            {/* Session Info */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Información de la Sesión</h3>
              <div className="space-y-2 text-sm">
                {session && (
                  <>
                    <div className="flex justify-between">
                      <span>Sesión:</span>
                      <span className="font-medium">#{session.sessionNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duración:</span>
                      <span className="font-medium">{session.duration || 'N/A'} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Campaña:</span>
                      <span className="font-medium">{session.campaignName}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {/* Armor Modal */}
        {showModals.armor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Armaduras</h3>
                <button
                  onClick={() => setShowModals(prev => ({ ...prev, armor: false }))}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }, (_, index) => {
                  const item = items.armor[index];
                  return (
                    <div
                      key={index}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center relative group ${
                        item 
                          ? 'border-gray-300 bg-gray-50 hover:border-blue-500 cursor-pointer' 
                          : 'border-gray-200 bg-gray-100'
                      }`}
                      onClick={() => item && toast.info(`Seleccionaste ${item.name}`)}
                    >
                      {item && (
                        <>
                          <div className="text-2xl">🛡️</div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ItemTooltip item={item} type="armor" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Weapons Modal */}
        {showModals.weapons && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Armas</h3>
                <button
                  onClick={() => setShowModals(prev => ({ ...prev, weapons: false }))}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }, (_, index) => {
                  const item = items.weapons[index];
                  return (
                    <div
                      key={index}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center relative group ${
                        item 
                          ? 'border-gray-300 bg-gray-50 hover:border-blue-500 cursor-pointer' 
                          : 'border-gray-200 bg-gray-100'
                      }`}
                      onClick={() => item && toast.info(`Seleccionaste ${item.name}`)}
                    >
                      {item && (
                        <>
                          <div className="text-2xl">⚔️</div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ItemTooltip item={item} type="weapons" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Items Modal */}
        {showModals.items && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Objetos</h3>
                <button
                  onClick={() => setShowModals(prev => ({ ...prev, items: false }))}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }, (_, index) => {
                  const item = items.items[index];
                  return (
                    <div
                      key={index}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center relative group ${
                        item 
                          ? 'border-gray-300 bg-gray-50 hover:border-blue-500 cursor-pointer' 
                          : 'border-gray-200 bg-gray-100'
                      }`}
                      onClick={() => item && toast.info(`Usaste ${item.name}`)}
                    >
                      {item && (
                        <>
                          <div className="text-2xl">🎒</div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ItemTooltip item={item} type="items" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* NPCs Modal */}
        {showModals.npcs && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">NPCs</h3>
                <button
                  onClick={() => setShowModals(prev => ({ ...prev, npcs: false }))}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }, (_, index) => {
                  const npc = npcs[index];
                  return (
                    <div
                      key={index}
                      className={`aspect-square border-2 rounded-lg flex items-center justify-center relative group ${
                        npc 
                          ? 'border-gray-300 bg-gray-50 hover:border-purple-500 cursor-pointer' 
                          : 'border-gray-200 bg-gray-100'
                      }`}
                    >
                      {npc && (
                        <>
                          <div className="text-2xl">👥</div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <NPCTooltip npc={npc} onAddToEncounter={handleAddNPCToEncounter} />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}