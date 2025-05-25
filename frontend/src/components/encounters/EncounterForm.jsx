import React, { useEffect } from 'react'; 
import  useEncounterForm  from '../../hooks/encounters/useEncounterForm';
import { toast } from 'react-toastify';


export default function EncounterForm({ encounterId, onSave, onCancel }) {
  const {
    encounter,
    loading,
    error,
    success,
    handleSubmit,
    handleChange
  } = useEncounterForm(encounterId, onSave);

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
      const message = encounterId ? 'Encuentro actualizado exitosamente' : 'Encuentro creado exitosamente';
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [success, encounterId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {encounterId ? 'Editar Encuentro' : 'Crear Encuentro'}
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
                Nombre del Encuentro *
              </label>
              <input
                type="text"
                name="name"
                value={encounter.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa el nombre del encuentro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={encounter.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el encuentro, su contexto y objetivos..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Encuentro *
                </label>
                <select
                  name="encounterType"
                  value={encounter.encounterType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="COMBAT">Combate</option>
                  <option value="SOCIAL">Social</option>
                  <option value="PUZZLE">Acertijo</option>
                  <option value="TRAP">Trampa</option>
                  <option value="EXPLORATION">Exploración</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de Dificultad *
                </label>
                <select
                  name="difficulty"
                  value={encounter.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TRIVIAL">Trivial</option>
                  <option value="EASY">Fácil</option>
                  <option value="MEDIUM">Medio</option>
                  <option value="HARD">Difícil</option>
                  <option value="DEADLY">Mortal</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isCompleted"
                checked={encounter.isCompleted}
                onChange={handleChange}
                id="isCompleted"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900">
                Encuentro completado
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas del Director de Juego
              </label>
              <textarea
                name="notes"
                value={encounter.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notas privadas para el DM sobre este encuentro..."
              />
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
                {loading ? 'Guardando...' : (encounterId ? 'Actualizar' : 'Crear Encuentro')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}