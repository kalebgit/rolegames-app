import React, { useEffect } from 'react';
import  useCombat  from '../../hooks/combat/useCombat';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

export default function CombatTracker() {
  const { combatState, loading, error, nextTurn, endCombat } = useCombat();
  const navigate = useNavigate();

  // Mostrar errores como toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const handleNextTurn = async () => {
    try {
      await nextTurn();
      toast.success('Turno avanzado exitosamente', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error('Error al avanzar turno', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleEndCombat = async () => {
    if (window.confirm('¿Estás seguro de que quieres finalizar el combate?')) {
      try {
        await endCombat();
        toast.success('Combate finalizado exitosamente', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (err) {
        toast.error('Error al finalizar combate', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const handleStartCombat = () => {
    navigate('/encounters');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando combate..." />;
  }

  if (!combatState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Rastreador de Combate</h1>
            <div className="mb-8">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-4">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">No hay combate activo en este momento</p>
            </div>
            <button 
              onClick={handleStartCombat}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Iniciar Combate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Combate en Curso</h1>
              <p className="text-gray-600">Ronda {combatState.currentRound}</p>
            </div>
            <div className="space-x-3">
              <button 
                onClick={handleNextTurn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Siguiente Turno
              </button>
              <button 
                onClick={handleEndCombat}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Finalizar Combate
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Orden de Iniciativa</h2>
            
            {combatState.initiativeOrder?.map((initiative, index) => (
              <div 
                key={initiative.initiativeId} 
                className={`p-4 rounded-lg border ${
                  initiative.currentTurn 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      initiative.currentTurn 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {initiative.initiativeRoll}
                    </div>
                    <div>
                      <h3 className="font-semibold">{initiative.character.name}</h3>
                      <p className="text-sm text-gray-600">
                        PV: {initiative.character.hitPoints}/{initiative.character.maxHitPoints}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {initiative.currentTurn && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Turno Actual
                      </span>
                    )}
                    {initiative.hasActed && (
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        Ha actuado
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Acciones de bonificación:</span>
                    <span className="ml-2">{initiative.bonusActionsUsed}/1</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reacciones:</span>
                    <span className="ml-2">{initiative.reactionsUsed}/1</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Movimiento usado:</span>
                    <span className="ml-2">{initiative.movementUsed}/{initiative.character.speed || 30}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {combatState.activeEffects?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Efectos Activos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {combatState.activeEffects.map(effect => (
                  <div key={effect.effectId} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-blue-900">{effect.name}</h4>
                        <p className="text-sm text-blue-700">
                          {effect.target.name} - {effect.effectType}
                        </p>
                      </div>
                      <span className="text-xs text-blue-600">
                        {effect.duration === -1 ? 'Permanente' : `${effect.duration} rondas`}
                      </span>
                    </div>
                    {effect.description && (
                      <p className="text-sm text-blue-700 mt-2">{effect.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}