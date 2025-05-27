import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

function ItemDetailTooltip({ item, type, onUse, onEquip, canInteract = false }) {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700 min-w-64">
      <div className="font-semibold text-yellow-300 mb-2">{item.name}</div>
      
      {type === 'armor' && (
        <div className="space-y-1 text-sm">
          <div>AC: <span className="text-green-300">{item.ac}</span></div>
          <div>Tipo: {item.type}</div>
          <div>Peso: {item.weight}lb</div>
          {item.properties && (
            <div>Propiedades: <span className="text-blue-300">{item.properties.join(', ')}</span></div>
          )}
        </div>
      )}
      
      {type === 'weapons' && (
        <div className="space-y-1 text-sm">
          <div>Daño: <span className="text-red-300">{item.damage}</span></div>
          <div>Tipo: {item.type}</div>
          <div>Peso: {item.weight}lb</div>
          <div>Alcance: {item.range}</div>
          {item.properties && (
            <div>Propiedades: <span className="text-blue-300">{item.properties.join(', ')}</span></div>
          )}
        </div>
      )}
      
      {type === 'items' && (
        <div className="space-y-1 text-sm">
          <div>Efecto: <span className="text-purple-300">{item.effect}</span></div>
          <div>Peso: {item.weight}lb</div>
          <div>Valor: {item.value} mo</div>
          {item.uses && (
            <div>Usos: <span className="text-orange-300">{item.currentUses}/{item.maxUses}</span></div>
          )}
        </div>
      )}

      {type === 'npcs' && (
        <div className="space-y-1 text-sm">
          <div>HP: <span className="text-red-300">{item.hp}/{item.maxHp}</span></div>
          <div>AC: <span className="text-blue-300">{item.ac}</span></div>
          <div>CR: <span className="text-yellow-300">{item.cr}</span></div>
          <div>Tipo: {item.type}</div>
          <div>Velocidad: {item.speed} ft</div>
          {item.abilities && (
            <div className="mt-2">
              <div className="font-medium text-yellow-300 mb-1">Habilidades:</div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div>STR: {item.abilities.strength}</div>
                <div>DEX: {item.abilities.dexterity}</div>
                <div>CON: {item.abilities.constitution}</div>
                <div>INT: {item.abilities.intelligence}</div>
                <div>WIS: {item.abilities.wisdom}</div>
                <div>CHA: {item.abilities.charisma}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`text-xs mt-2 ${
        item.rarity === 'Common' ? 'text-gray-300' : 
        item.rarity === 'Uncommon' ? 'text-green-300' : 
        item.rarity === 'Rare' ? 'text-blue-300' : 
        item.rarity === 'Very Rare' ? 'text-purple-300' :
        item.rarity === 'Legendary' ? 'text-orange-300' : 'text-gray-300'
      }`}>
        {item.rarity || 'Common'}
      </div>

      {item.description && (
        <div className="mt-2 text-xs text-gray-300 border-t border-gray-600 pt-2">
          {item.description}
        </div>
      )}

      {canInteract && (
        <div className="mt-3 space-y-2">
          {(type === 'items' || type === 'weapons' || type === 'armor') && (
            <button
              onClick={() => onUse && onUse(item)}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
            >
              {type === 'items' ? 'Usar' : 'Equipar'}
            </button>
          )}
          {type === 'npcs' && (
            <button
              onClick={() => onUse && onUse(item)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
            >
              Agregar al Encuentro
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function InventoryExpandedModal({ 
  isOpen, 
  onClose, 
  type, 
  items, 
  title,
  isInDMMode = false,
  onItemUse,
  onAddToEncounter 
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!isOpen) {
      setSelectedItem(null);
      setFilter('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = items
    .filter(item => 
      item && item.name && 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = { 'Common': 1, 'Uncommon': 2, 'Rare': 3, 'Very Rare': 4, 'Legendary': 5 };
          return (rarityOrder[a.rarity] || 1) - (rarityOrder[b.rarity] || 1);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        default:
          return 0;
      }
    });

  const handleItemClick = (item) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const handleItemUse = (item) => {
    if (onItemUse) {
      onItemUse(item, type);
    }
  };

  const handleAddToEncounter = (item) => {
    if (onAddToEncounter) {
      onAddToEncounter(item);
    }
  };

  const getItemIcon = (itemType, item) => {
    switch (itemType) {
      case 'armor':
        return '🛡️';
      case 'weapons':
        return item?.type === 'Ranged' ? '🏹' : '⚔️';
      case 'items':
        if (item?.name?.toLowerCase().includes('potion')) return '🧪';
        if (item?.name?.toLowerCase().includes('scroll')) return '📜';
        return '🎒';
      case 'npcs':
        return '👥';
      default:
        return '📦';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'border-gray-300';
      case 'Uncommon': return 'border-green-400';
      case 'Rare': return 'border-blue-400';
      case 'Very Rare': return 'border-purple-400';
      case 'Legendary': return 'border-orange-400';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {filteredItems.length} elemento{filteredItems.length !== 1 ? 's' : ''} disponible{filteredItems.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Buscar ${title.toLowerCase()}...`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="name">Ordenar por Nombre</option>
                <option value="rarity">Ordenar por Rareza</option>
                <option value="type">Ordenar por Tipo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner message="Cargando elementos..." />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">No hay elementos disponibles</p>
                <p className="text-gray-400 text-sm mt-2">
                  {filter ? 'Intenta con otros términos de búsqueda' : 'No se encontraron elementos en esta categoría'}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedItem?.id === item.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : `${getRarityColor(item.rarity)} hover:border-gray-400`
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-3xl">{getItemIcon(type, item)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.type || 'Sin tipo'}</p>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="space-y-1 text-xs text-gray-600">
                      {type === 'armor' && (
                        <div>AC: <span className="font-medium">{item.ac}</span></div>
                      )}
                      {type === 'weapons' && (
                        <div>Daño: <span className="font-medium">{item.damage}</span></div>
                      )}
                      {type === 'npcs' && (
                        <div>HP: <span className="font-medium">{item.hp}</span> | AC: <span className="font-medium">{item.ac}</span></div>
                      )}
                      {item.rarity && (
                        <div className={`text-xs font-semibold ${
                          item.rarity === 'Common' ? 'text-gray-600' :
                          item.rarity === 'Uncommon' ? 'text-green-600' :
                          item.rarity === 'Rare' ? 'text-blue-600' :
                          item.rarity === 'Very Rare' ? 'text-purple-600' :
                          'text-orange-600'
                        }`}>
                          {item.rarity}
                        </div>
                      )}
                    </div>

                    {/* Expanded details */}
                    {selectedItem?.id === item.id && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <ItemDetailTooltip
                          item={item}
                          type={type}
                          canInteract={true}
                          onUse={type === 'npcs' ? handleAddToEncounter : handleItemUse}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedItem ? (
                <span>Elemento seleccionado: <strong>{selectedItem.name}</strong></span>
              ) : (
                'Haz clic en un elemento para ver más detalles'
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}