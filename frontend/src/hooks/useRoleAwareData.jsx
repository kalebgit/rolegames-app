import { useEffect, useRef } from 'react';
import { useRoleStore } from '../stores/useRoleStore';

export function useRoleAwareData(fetchFunction, dependencies = []) {
  const currentRole = useRoleStore(state => state.currentRole);
  const previousRole = useRef(currentRole);

  useEffect(() => {
    // Solo refrescar si el rol realmente cambió (no en el primer render)
    if (previousRole.current !== null && previousRole.current !== currentRole) {
      console.log(`🔄 Rol cambió de ${previousRole.current} a ${currentRole}, refrescando datos...`);
      fetchFunction();
    }
    previousRole.current = currentRole;
  }, [currentRole, fetchFunction, ...dependencies]);
}