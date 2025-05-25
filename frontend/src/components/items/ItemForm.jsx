import React, { useEffect } from 'react'; 
import  useItemForm  from '../../hooks/items/useItemForm';
import { toast } from 'react-toastify';


export default function ItemForm({ itemId, onSave, onCancel }) {
  const {
    item,
    loading,
    error,
    success,
    handleSubmit,
    handleChange
  } = useItemForm(itemId, onSave);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const message = itemId ? 'Objeto actualizado exitosamente' : 'Objeto creado exitosamente';
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [success, itemId]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {itemId ? 'Editar Objeto' : 'Crear Objeto'}
            </h1>
            <button 
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Objeto *
              </label>
              <input
                type="text"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el nombre del objeto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={item.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el objeto, sus propiedades y efectos..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (lbs)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={item.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (mo)
                </label>
                <input
                  type="number"
                  name="value"
                  value={item.value}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rareza
                </label>
                <select
                  name="rarity"
                  value={item.rarity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="COMMON">Común</option>
                  <option value="UNCOMMON">Poco común</option>
                  <option value="RARE">Raro</option>
                  <option value="VERY_RARE">Muy raro</option>
                  <option value="LEGENDARY">Legendario</option>
                  <option value="ARTIFACT">Artefacto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requiresAttunement"
                  checked={item.requiresAttunement}
                  onChange={handleChange}
                  id="requiresAttunement"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="requiresAttunement" className="ml-2 block text-sm text-gray-900">
                  Requiere sintonía
                </label>
              </div>

              {item.requiresAttunement && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAttuned"
                    checked={item.isAttuned}
                    onChange={handleChange}
                    id="isAttuned"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAttuned" className="ml-2 block text-sm text-gray-900">
                    Actualmente sintonizado
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (itemId ? 'Actualizar' : 'Crear Objeto')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}