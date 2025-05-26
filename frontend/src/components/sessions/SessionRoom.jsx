import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRoleStore } from '../../stores/useRoleStore';
import useSessionRoom from '../../hooks/sessions/useSessionRoom';
import { ReactDice } from 'react-dice-roll';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import { ReactDice } from 'react-dice-roll';
import { useWebSocket } from '../../services/WebSocketService';
import { useMemo } from 'react';

//players y items mockeadso
const mockPlayerItems = {
  armor: [
    { id: 1, name: 'Leather Armor', ac: 11, type: 'Light', rarity: 'Common', image: '/api/placeholder/40/40' },
    { id: 2, name: 'Chain Mail', ac: 16, type: 'Heavy', rarity: 'Common', image: '/api/placeholder/40/40' },
    { id: 3, name: 'Studded Leather', ac: 12, type: 'Light', rarity: 'Common', image: '/api/placeholder/40/40' }
  ],
  weapons: [
    { id: 4, name: 'Longsword', damage: '1d8', type: 'Melee', rarity: 'Common', image: '/api/placeholder/40/40' },
    { id: 5, name: 'Shortbow', damage: '1d6', type: 'Ranged', rarity: 'Common', image: '/api/placeholder/40/40' },
    { id: 6, name: 'Dagger', damage: '1d4', type: 'Melee', rarity: 'Common', image: '/api/placeholder/40/40' }
  ],
  items: [
    { id: 7, name: 'Health Potion', effect: 'Heal 2d4+2', rarity: 'Common', image: '/api/placeholder/40/40' },
    { id: 8, name: 'Rope (50ft)', effect: 'Utility', rarity: 'Common', image: '/api/placeholder/40/40' },
    { id: 9, name: 'Torch', effect: 'Light source', rarity: 'Common', image: '/api/placeholder/40/40' }
  ]
};

const mockNPCs = [
  { id: 10, name: 'Goblin Warrior', hp: 15, ac: 13, cr: '1/2', type: 'Humanoid', image: '/api/placeholder/40/40' },
  { id: 11, name: 'Orc Berserker', hp: 42, ac: 14, cr: '2', type: 'Humanoid', image: '/api/placeholder/40/40' },
  { id: 12, name: 'Fire Elemental', hp: 102, ac: 13, cr: '5', type: 'Elemental', image: '/api/placeholder/40/40' }
];

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

function InventoryModal({ isOpen, onClose, items, title, type, onItemSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 36 }, (_, index) => {
            const item = items[index];
            return (
              <div
                key={index}
                className={`aspect-square border-2 rounded-lg flex items-center justify-center relative group ${
                  item 
                    ? 'border-gray-300 bg-gray-50 hover:border-blue-500 cursor-pointer' 
                    : 'border-gray-200 bg-gray-100'
                }`}
                onClick={() => item && onItemSelect && onItemSelect(item)}
              >
                {item && (
                  <>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-8 h-8 object-cover"
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ItemTooltip item={item} type={type} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NPCModal({ isOpen, onClose, npcs, onAddToEncounter }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">NPCs</h3>
          <button
            onClick={onClose}
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
                    <img 
                      src={npc.image} 
                      alt={npc.name}
                      className="w-8 h-8 object-cover"
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <NPCTooltip npc={npc} onAddToEncounter={onAddToEncounter} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ActionLog({ actions }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-64 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-3">Action Log</h3>
      <div className="space-y-2">
        {actions.length === 0 ? (
          <p className="text-gray-500 text-sm">No actions yet...</p>
        ) : (
          actions.map((action, index) => (
            <div key={index} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-blue-500">
              <div className="font-medium text-gray-900">{action.player}</div>
              <div className="text-gray-600">{action.description}</div>
              <div className="text-xs text-gray-400">{action.timestamp}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DiceRoller({ onRoll }) {
  const [lastRoll, setLastRoll] = useState(null);
  
  const handleRollDone = (totalValue, values) => {
    const rollData = {
      total: totalValue,
      values: values,
      timestamp: new Date().toLocaleTimeString()
    };
    setLastRoll(rollData);
    onRoll(rollData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Dice Roller</h3>
      <div className="flex flex-col items-center space-y-3">
        <ReactDice
          numDice={1}
          rollDone={handleRollDone}
          faceColor="#ffffff"
          dotColor="#000000"
          dieSize={40}
        />
        <div className="grid grid-cols-2 gap-2 w-full">
          <ReactDice
            numDice={1}
            sides={4}
            rollDone={handleRollDone}
            faceColor="#ef4444"
            dotColor="#ffffff"
            dieSize={30}
          />
          <ReactDice
            numDice={1}
            sides={6}
            rollDone={handleRollDone}
            faceColor="#3b82f6"
            dotColor="#ffffff"
            dieSize={30}
          />
          <ReactDice
            numDice={1}
            sides={8}
            rollDone={handleRollDone}
            faceColor="#10b981"
            dotColor="#ffffff"
            dieSize={30}
          />
          <ReactDice
            numDice={1}
            sides={20}
            rollDone={handleRollDone}
            faceColor="#8b5cf6"
            dotColor="#ffffff"
            dieSize={30}
          />
        </div>
        {lastRoll && (
          <div className="text-center text-sm">
            <div className="font-semibold">Last Roll: {lastRoll.total}</div>
            <div className="text-gray-500">{lastRoll.timestamp}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EnhancedSessionRoom() {
  const { id } = useParams();
  const sessionId = parseInt(id);
  
  // Role management
  const isInDMMode = useRoleStore(state => state.isInDMMode);
  const currentRole = useRoleStore(state => state.currentRole);
  
  // Session room hook
  const {
    session,
    connectedPlayers,
    combatState,
    loading,
    error,
    joinSession,
    startCombat,
    nextTurn,
    endCombat,
    refreshSession
  } = useSessionRoom(sessionId);

  // Local state
  const [players, setPlayers] = useState([
    { id: 1, name: 'Jugador 1', avatar: '🧙‍♂️', isReady: true, x: 20, y: 50 },
    { id: 2, name: 'Jugador 2', avatar: '⚔️', isReady: false, x: 80, y: 30 },
    { id: 3, name: 'Jugador 3', avatar: '🏹', isReady: true, x: 80, y: 70 },
    { id: 4, name: 'Jugador 4', avatar: '🛡️', isReady: true, x: 50, y: 20 },
    { id: 5, name: 'Jugador 5', avatar: '⚡', isReady: false, x: 50, y: 80 }
  ]);
  
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Inventory states
  const [showArmorModal, setShowArmorModal] = useState(false);
  const [showWeaponsModal, setShowWeaponsModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [showNPCModal, setShowNPCModal] = useState(false);
  
  // Action log and dice
  const [actionLog, setActionLog] = useState([]);
  
  const boardRef = useRef(null);

  // Mouse handlers for dragging
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
    
    const clampedX = Math.max(8, Math.min(92, newX));
    const clampedY = Math.max(8, Math.min(92, newY));
    
    setPlayers(prev => 
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

  // Action handlers
  const handleAction = async (actionType) => {
    const timestamp = new Date().toLocaleTimeString();
    let description = '';
    
    switch (actionType) {
      case 'attack':
        description = 'Realiza un ataque';
        break;
      case 'spell':
        description = 'Lanza un hechizo';
        break;
      case 'move':
        description = 'Se mueve por el tablero';
        break;
      case 'item':
        description = 'Usa un objeto';
        break;
      case 'defend':
        description = 'Adopta postura defensiva';
        break;
      case 'next_turn':
        if (isInDMMode) {
          try {
            await nextTurn();
            description = 'Avanza al siguiente turno';
          } catch (err) {
            toast.error('Error al avanzar turno');
            return;
          }
        }
        break;
      default:
        description = `Realiza acción: ${actionType}`;
    }
    
    addToActionLog('Current Player', description, timestamp);
    setShowActionMenu(false);
  };

  const addToActionLog = (player, description, timestamp) => {
    setActionLog(prev => [...prev, { player, description, timestamp }].slice(-20));
  };

  const handleDiceRoll = (rollData) => {
    const description = `Rolled ${rollData.total} (${rollData.values?.join(', ') || rollData.total})`;
    addToActionLog('Current Player', description, rollData.timestamp);
  };

  const handleAddNPCToEncounter = async (npc) => {
    if (!isInDMMode) {
      toast.error('Solo el DM puede agregar NPCs al encuentro');
      return;
    }

    try {
      // TODO: Implement API call to add NPC to current encounter
      // await api.post(`/api/encounters/${currentEncounterId}/participants/${npc.id}`);
      
      addToActionLog('DM', `Added ${npc.name} to the encounter`, new Date().toLocaleTimeString());
      toast.success(`${npc.name} agregado al encuentro`);
      setShowNPCModal(false);
    } catch (err) {
      toast.error('Error al agregar NPC al encuentro');
    }
  };

  const handleItemSelect = (item) => {
    addToActionLog('Current Player', `Selected ${item.name}`, new Date().toLocaleTimeString());
    // Close all modals
    setShowArmorModal(false);
    setShowWeaponsModal(false);
    setShowItemsModal(false);
  };

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

  if (loading) {
    return <LoadingSpinner message="Cargando sala de sesión..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

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
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">En vivo</span>
              </div>
              <span className="text-sm text-gray-500">
                {players.length} jugadores conectados
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Board */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6 relative overflow-hidden">
              {/* Game board with grass background */}
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

                {/* Players */}
                {players.map((player) => (
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
                      {/* Armor slot */}
                      <button
                        onClick={() => setShowArmorModal(true)}
                        className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-gray-500"
                        title="Armaduras"
                      >
                        🛡️
                      </button>

                      {/* Weapons slot */}
                      <button
                        onClick={() => setShowWeaponsModal(true)}
                        className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-red-500"
                        title="Armas"
                      >
                        ⚔️
                      </button>

                      {/* Items slot */}
                      <button
                        onClick={() => setShowItemsModal(true)}
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
                      {/* NPCs slot */}
                      <button
                        onClick={() => setShowNPCModal(true)}
                        className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform shadow-lg border-2 border-purple-500"
                        title="NPCs"
                      >
                        👥
                      </button>

                      {/* Items slot for DM */}
                      <button
                        onClick={() => setShowItemsModal(true)}
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
                    <li>• <strong>Arrastra</strong> los jugadores por el tablero para posicionarlos</li>
                    <li>• <strong>Haz clic</strong> en el centro para abrir el menú de acciones</li>
                    <li>• <strong>Usa los dados</strong> para realizar tiradas</li>
                    <li>• <strong>Accede al inventario</strong> desde los botones inferiores</li>
                    {isInDMMode && (
                      <li>• <strong>Como DM</strong> puedes agregar NPCs al encuentro</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Log */}
            <ActionLog actions={actionLog} />

            {/* Dice Roller */}
            <DiceRoller onRoll={handleDiceRoll} />

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
                      <span>Jugadores:</span>
                      <span className="font-medium">{players.filter(p => p.isReady).length}/{players.length}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <InventoryModal
          isOpen={showArmorModal}
          onClose={() => setShowArmorModal(false)}
          items={mockPlayerItems.armor}
          title="Armaduras"
          type="armor"
          onItemSelect={handleItemSelect}
        />

        <InventoryModal
          isOpen={showWeaponsModal}
          onClose={() => setShowWeaponsModal(false)}
          items={mockPlayerItems.weapons}
          title="Armas"
          type="weapons"
          onItemSelect={handleItemSelect}
        />

        <InventoryModal
          isOpen={showItemsModal}
          onClose={() => setShowItemsModal(false)}
          items={mockPlayerItems.items}
          title="Objetos"
          type="items"
          onItemSelect={handleItemSelect}
        />

        <NPCModal
          isOpen={showNPCModal}
          onClose={() => setShowNPCModal(false)}
          npcs={mockNPCs}
          onAddToEncounter={handleAddNPCToEncounter}
        />
      </div>
    </div>
  );
}