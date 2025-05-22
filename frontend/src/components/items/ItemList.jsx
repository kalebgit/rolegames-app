import React, { useState } from 'react';
import  useItems  from '../../hooks/items/useItems';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ItemList({ onItemSelect, onCreateItem }) {
  const { items, loading, error, deleteItem } = useItems();
  const [filter, setFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');

  const rarityColors = {
    COMMON: 'bg-gray-100 text-gray-800',
    UNCOMMON: 'bg-green-100 text-green-800',
    RARE: 'bg-blue-100 text-blue-800',
    VERY_RARE: 'bg-purple-100 text-purple-800',
    LEGENDARY: 'bg-orange-100 text-orange-800',
    ARTIFACT: 'bg-red-100 text-red-800'
  };

  const filteredItems = items.filter(item => {
    const matchesName = item.name.toLowerCase().includes(filter.toLowerCase());
    const matchesRarity = !rarityFilter || item.rarity === rarityFilter;
    return matchesName && matchesRarity;
  });

  const handleDelete = async (itemId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este objeto?')) {
      await deleteItem(itemId);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando inventario..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Inventario de Objetos</h1>
            <button 
              onClick={onCreateItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Crear Objeto
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Buscar objetos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las rarezas</option>
              <option value="COMMON">Común</option>
              <option value="UNCOMMON">Poco común</option>
              <option value="RARE">Raro</option>
              <option value="VERY_RARE">Muy raro</option>
              <option value="LEGENDARY">Legendario</option>
              <option value="ARTIFACT">Artefacto</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.itemId} className="bg-gray-50 rounded-lg p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    rarityColors[item.rarity] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.rarity}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.description || 'Sin descripción'}
                </p>

                <div className="space-y-2 text-sm">
                  {item.weight && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Peso:</span>
                      <span>{item.weight} lb</span>
                    </div>
                  )}
                  {item.value && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valor:</span>
                      <span>{item.value} mo</span>
                    </div>
                  )}
                  {item.requiresAttunement && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Requiere sintonía:</span>
                      <span className={item.isAttuned ? 'text-green-600' : 'text-red-600'}>
                        {item.isAttuned ? 'Sintonizado' : 'No sintonizado'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => onItemSelect(item.itemId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
                  >
                    Ver Detalles
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onItemSelect(item.itemId, 'edit')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(item.itemId)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron objetos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}