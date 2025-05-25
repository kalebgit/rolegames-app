import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axiosConfig';

const creation = create(
  persist(
    (set, get) => ({
      // ========================================
      // ESTADO LOCAL
      // ========================================
      currentRole: null,
      availableRoles: [],
      roleInstances: {
        player: null,
        dungeonMaster: null
      },
      loading: false,
      error: null,


      setLoading: (loading)=>set({loading}),
      // ========================================
      // ACCIONES QUE LLAMAN AL BACKEND
      // ========================================

      /**
       * Obtiene roles disponibles del backend
       */
      fetchUserRoles: async () => {
        console.log("🔄 Zustand: Llamando a /api/user/roles/my-roles");
        set({ loading: true, error: null });
        
        try {
          const response = await api.get('/api/user/roles/my-roles');
          const data = response.data;
          
          // Actualizar estado local con datos del backend
          const available = [];
          if (data.canActAsPlayer) available.push('PLAYER');
          if (data.canActAsDungeonMaster) available.push('DUNGEON_MASTER');
          
          set({
            availableRoles: available,
            currentRole: get().currentRole || data.primaryRole,
            loading: false
          });
          
          console.log("✅ Zustand: Roles actualizados desde backend", available);
          
        } catch (error) {
          console.error("❌ Zustand: Error al obtener roles", error);
          set({ 
            error: 'Error al cargar roles del usuario',
            loading: false 
          });
        }
      },

      /**
       * Activa rol de Player llamando al backend
       */
      enablePlayerRole: async () => {
        console.log("🔄 Zustand: Llamando a /api/user/roles/enable-player");
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/api/user/roles/enable-player');
          
          if (response.data.success) {
            // Actualizar estado local después de éxito en backend
            const currentAvailable = get().availableRoles;
            if (!currentAvailable.includes('PLAYER')) {
              set({ 
                availableRoles: [...currentAvailable, 'PLAYER'],
                currentRole: 'PLAYER' // Cambiar automáticamente al nuevo rol
              });
            }
            
            // Actualizar instancia de Player
            set(state => ({
              roleInstances: {
                ...state.roleInstances,
                player: {
                  playerId: response.data.playerId,
                  level: response.data.playerLevel,
                  experience: response.data.experience
                }
              },
              loading: false
            }));
            
            console.log("✅ Zustand: Rol Player activado");
            return { success: true, message: response.data.message };
          }
          
          set({ loading: false });
          return { success: false, message: response.data.message };
          
        } catch (error) {
          console.error("❌ Zustand: Error al activar rol Player", error);
          const message = error.response?.data?.message || 'Error al activar rol de jugador';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      /**
       * Activa rol de DungeonMaster llamando al backend
       */
      enableDungeonMasterRole: async () => {
        console.log("🔄 Zustand: Llamando a /api/user/roles/enable-dm");
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/api/user/roles/enable-dm');
          
          if (response.data.success) {
            const currentAvailable = get().availableRoles;
            if (!currentAvailable.includes('DUNGEON_MASTER')) {
              set({ 
                availableRoles: [...currentAvailable, 'DUNGEON_MASTER'],
                currentRole: 'DUNGEON_MASTER'
              });
            }
            
            // Actualizar instancia de DM
            set(state => ({
              roleInstances: {
                ...state.roleInstances,
                dungeonMaster: {
                  dmId: response.data.dmId,
                  campaignCount: response.data.campaignCount,
                  dmStyle: response.data.dmStyle
                }
              },
              loading: false
            }));
            
            console.log("✅ Zustand: Rol DM activado");
            return { success: true, message: response.data.message };
          }
          
          set({ loading: false });
          return { success: false, message: response.data.message };
          
        } catch (error) {
          console.error("❌ Zustand: Error al activar rol DM", error);
          const message = error.response?.data?.message || 'Error al activar rol de Dungeon Master';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      /**
       * Cambia contexto de rol (sin llamar backend, solo local)
       */
      switchRoleContext: async (targetRole) => {
        console.log(`🔄 Zustand: (intento) Cambiando contexto a ${targetRole}`);
        
        const { availableRoles } = get();
        console.log(availableRoles)
        if (!availableRoles.includes(targetRole)) {
          const message = `No tienes acceso al rol ${targetRole}`;
          set({ error: message });
          return { success: false, message };
        }


        try {
          console.log(targetRole)
          const response = await api.post('/api/user/roles/switch-context', { targetRole });
          
          if (response.data.success) {
            set({ currentRole: targetRole, error: null });
            
            if (response.data.newToken) {
              localStorage.setItem('token', response.data.newToken);
              api.defaults.headers.common['Authorization'] = `Bearer ${response.data.newToken}`;
            }
            
            return { success: true, message: response.data.message };
          }
          
          return { success: false, message: response.data.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Error al cambiar contexto';
          set({ error: message });
          return { success: false, message };
        }
      },

      /**
       * Obtiene instancia específica de rol del backend
       */
      fetchPlayerInstance: async () => {
        console.log("🔄 Zustand: Obteniendo instancia Player del backend");
        
        try {
          const response = await api.get('/api/user/roles/player-instance');
          
          if (response.data.hasPlayerInstance) {
            set(state => ({
              roleInstances: {
                ...state.roleInstances,
                player: {
                  playerId: response.data.playerId,
                  level: response.data.level,
                  experience: response.data.experience,
                  characterCount: response.data.characterCount
                }
              }
            }));
            
            console.log("✅ Zustand: Instancia Player obtenida", response.data);
            return response.data;
          }
          
          return null;
        } catch (error) {
          console.error("❌ Zustand: Error al obtener instancia Player", error);
          return null;
        }
      },

      fetchDungeonMasterInstance: async () => {
        console.log("🔄 Zustand: Obteniendo instancia DM del backend");
        
        try {
          const response = await api.get('/api/user/roles/dm-instance');
          
          if (response.data.hasDMInstance) {
            set(state => ({
              roleInstances: {
                ...state.roleInstances,
                dungeonMaster: {
                  dmId: response.data.dmId,
                  campaignCount: response.data.campaignCount,
                  npcCount: response.data.npcCount,
                  itemCount: response.data.itemCount,
                  dmStyle: response.data.dmStyle,
                  rating: response.data.rating
                }
              }
            }));
            
            console.log("✅ Zustand: Instancia DM obtenida", response.data);
            return response.data;
          }
          
          return null;
        } catch (error) {
          console.error("❌ Zustand: Error al obtener instancia DM", error);
          return null;
        }
      },

      // ========================================
      // MÉTODOS DE UTILIDAD (SOLO LOCALES)
      // ========================================
      
      isInPlayerMode: () => get().currentRole === 'PLAYER',
      isInDMMode: () => get().currentRole === 'DUNGEON_MASTER',
      
      hasRole: (role) => get().availableRoles.includes(role),
      
      hasMultipleRoles: () => get().availableRoles.length > 1,
      
      requirePlayerAccess: () => {
        if (!get().isInPlayerMode()) {
          throw new Error('Esta acción requiere estar en modo Jugador');
        }
      },

      requireDMAccess: () => {
        if (!get().isInDMMode()) {
          throw new Error('Esta acción requiere estar en modo Dungeon Master');
        }
      },

      getPlayerInstance: () => get().roleInstances.player,
      getDMInstance: () => get().roleInstances.dungeonMaster,

      // ========================================
      // LIMPIEZA Y RESET
      // ========================================
      
      clearError: () => set({ error: null }),
      
      reset: () => set({
        currentRole: null,
        availableRoles: [],
        roleInstances: { player: null, dungeonMaster: null },
        loading: false,
        error: null
      })
    }),
    {
      name: 'role-context-storage',
      // Solo persistir datos básicos, no funciones
      partialize: (state) => ({
        currentRole: state.currentRole,
        availableRoles: state.availableRoles,
        roleInstances: state.roleInstances
      })
    }
  )
);

export const useRoleStore = creation;
