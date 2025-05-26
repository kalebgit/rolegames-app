import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams} from 'react-router-dom';
import AuthContainer from './components/auth/AuthContainer';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Componentes que requieren roles específicos
import CharacterForm from './components/characters/CharacterForm';
import CharacterDetail from './components/characters/CharacterDetail';
import NPCForm from './components/npcs/NPCForm';
import CampaignForm from './components/campaigns/CampaignForm';
import SessionForm from './components/sessions/SessionForm';
import EncounterForm from './components/encounters/EncounterForm';

// Componentes generales
import CharacterList from './components/characters/CharacterList';
import NPCList from './components/npcs/NPCList';
import CampaignList from './components/campaigns/CampaignList';
import SessionList from './components/sessions/SessionList';
import EncounterList from './components/encounters/EncounterList';
import SpellList from './components/spells/SpellList';
import SpellForm from './components/spells/SpellForm';
import ItemList from './components/items/ItemList';
import ItemForm from './components/items/ItemForm';
import CombatTracker from './components/combat/CombatTracker';

import CampaignDetail from './components/campaigns/CampaignDetail';
import CampaignSessionForm from './components/sessions/campaignSessionForm';
import SessionRoom from './components/sessions/SessionRoom';
import SessionDetail from './components/sessions/sessionDetail';


// Gestión de roles
import RoleManager from './components/auth/RoleManager';
import NotFound from './components/NotFound';

import { useUserStore } from './stores/useUserStore';
import LoadingSpinner from './components/common/LoadingSpinner';

// React Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {children}
    </div>
  );
}

function ProtectedRouteWithAuth({ children, requiredRole = null }) {
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const loading = useUserStore(state => state.loading);

  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AppLayout>
      <ProtectedRoute requiredRole={requiredRole}>
        {children}
      </ProtectedRoute>
    </AppLayout>
  );
}

function AppInitializer({ children }) {
  const initialize = useUserStore(state => state.initialize);
  const loading = useUserStore(state => state.loading);

  useEffect(() => {
    console.log("🚀 App: Inicializando aplicación...");
    initialize();
  }, [initialize]);

  if (loading) {
    return <LoadingSpinner message="Inicializando aplicación..." />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <AppInitializer>
        <Routes>
          {/* Autenticación */}
          <Route path="/auth" element={<AuthContainer />} />
          
          {/* Dashboard - sin rol específico */}
          <Route path="/" element={
            <ProtectedRouteWithAuth>
              <Dashboard />
            </ProtectedRouteWithAuth>
          } />
          
          {/* Gestión de roles */}
          <Route path="/roles" element={
            <ProtectedRouteWithAuth>
              <RoleManager />
            </ProtectedRouteWithAuth>
          } />
          
          {/* ========================================= */}
          {/* RUTAS QUE REQUIEREN ROL DE PLAYER */}
          {/* ========================================= */}
          
          {/* Personajes - PLAYER */}
          <Route path="/characters" element={
            <ProtectedRouteWithAuth requiredRole="PLAYER">
              <CharacterList />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/characters/new" element={
            <ProtectedRouteWithAuth requiredRole="PLAYER">
              <CharacterForm />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/characters/:id" element={
            <ProtectedRouteWithAuth requiredRole="PLAYER">
              <CharacterDetail />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/characters/:id/edit" element={
            <ProtectedRouteWithAuth requiredRole="PLAYER">
              <CharacterForm />
            </ProtectedRouteWithAuth>
          } />
          
          {/* ========================================= */}
          {/* RUTAS QUE REQUIEREN ROL DE DUNGEON_MASTER */}
          {/* ========================================= */}
          
          {/* NPCs - DUNGEON_MASTER */}
          <Route path="/npcs" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <NPCListPage />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/npcs/new" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <NPCForm />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/npcs/:id/edit" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <NPCForm />
            </ProtectedRouteWithAuth>
          } />
          
          {/* Campañas - DUNGEON_MASTER  solo puede crearlas y editarlas*/}
          <Route path="/campaigns/new" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <CampaignForm />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/campaigns/:id/edit" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <CampaignForm />
            </ProtectedRouteWithAuth>
          } />
          
          {/* Sesiones - DUNGEON_MASTER */}
          <Route path="/sessions" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <SessionListPage />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/sessions/new" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <SessionForm />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/sessions/:id/edit" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <SessionForm />
            </ProtectedRouteWithAuth>
          } />
          
          {/* Encuentros - DUNGEON_MASTER */}
          <Route path="/encounters" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <EncounterListPage />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/encounters/new" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <EncounterForm />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/encounters/:id/edit" element={
            <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
              <EncounterForm />
            </ProtectedRouteWithAuth>
          } />
          
          {/*
          RUTAS PARA EL NUEVO SISTEMA DE SESIONSES
          */}
          {/* Detalle de campaña con estadísticas */}
<Route path="/campaigns/:id" element={
  <ProtectedRouteWithAuth >
    <CampaignDetail />
  </ProtectedRouteWithAuth>
} />

{/* Crear sesión para una campaña específica */}
<Route path="/campaigns/:campaignId/sessions/new" element={
  <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
    <CampaignSessionForm />
  </ProtectedRouteWithAuth>
} />

{/* Sala de sesión en vivo */}
<Route path="/sessions/:id/room" element={
  <ProtectedRouteWithAuth>
    <SessionRoom />
  </ProtectedRouteWithAuth>
} />

{/* Editar sesión específica */}
<Route path="/sessions/:sessionId/edit" element={
  <ProtectedRouteWithAuth requiredRole="DUNGEON_MASTER">
    <CampaignSessionForm />
  </ProtectedRouteWithAuth>
} />

{/* Ver detalles de sesión */}
<Route path="/sessions/:id" element={
  <ProtectedRouteWithAuth>
    <SessionDetail />
  </ProtectedRouteWithAuth>
} />
          
          {/* ========================================= */}
          {/* RUTAS GENERALES (sin rol específico) */}
          {/* ========================================= */}
          
          {/* Hechizos */}
          <Route path="/campaigns" element={
            <ProtectedRouteWithAuth >
              <CampaignList />
            </ProtectedRouteWithAuth>
          } />

          <Route path="/spells" element={
            <ProtectedRouteWithAuth>
              <SpellList />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/spells/new" element={
            <ProtectedRouteWithAuth>
              <SpellForm />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/spells/:id/edit" element={
            <ProtectedRouteWithAuth>
              <SpellForm />
            </ProtectedRouteWithAuth>
          } />
          
          {/* OBJETOS - Esta era la ruta que faltaba */}
          <Route path="/items" element={
            <ProtectedRouteWithAuth>
              <ItemListPage />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/items/new" element={
            <ProtectedRouteWithAuth>
              <ItemFormPage />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/items/:id/edit" element={
            <ProtectedRouteWithAuth>
              <ItemFormPage />
            </ProtectedRouteWithAuth>
          } />
          
          {/* Combate */}
          <Route path="/combat" element={
            <ProtectedRouteWithAuth>
              <CombatTracker />
            </ProtectedRouteWithAuth>
          } />
          
          {/* Página 404 */}
          <Route path="/404" element={<NotFound />} />
          
          {/* Redirect any unknown route to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        {/* Toast Container */}
        {/* <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
      </AppInitializer>
    </Router>
  );
}

// ========================================
// Componentes Wrapper para páginas con lógica de navegación
// ========================================

function ItemListPage() {
  const navigate = useNavigate();
  
  const handleItemSelect = (itemId, mode = 'view') => {
    if (mode === 'edit') {
      navigate(`/items/${itemId}/edit`);
    } else {
      navigate(`/items/${itemId}`);
    }
  };

  const handleCreateItem = () => {
    navigate('/items/new');
  };

  return (
    <ItemList 
      onItemSelect={handleItemSelect}
      onCreateItem={handleCreateItem}
    />
  );
}

function ItemFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleSave = () => {
    navigate('/items');
  };

  const handleCancel = () => {
    navigate('/items');
  };

  return (
    <ItemForm 
      itemId={id}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}

function NPCListPage() {
  const navigate = useNavigate();
  
  const handleNPCSelect = (npcId, mode = 'view') => {
    if (mode === 'edit') {
      navigate(`/npcs/${npcId}/edit`);
    } else {
      navigate(`/npcs/${npcId}`);
    }
  };

  const handleCreateNPC = () => {
    navigate('/npcs/new');
  };

  return (
    <NPCList 
      onNPCSelect={handleNPCSelect}
      onCreateNPC={handleCreateNPC}
    />
  );
}

function SessionListPage() {
  const navigate = useNavigate();
  
  const handleSessionSelect = (sessionId, mode = 'view') => {
    if (mode === 'edit') {
      navigate(`/sessions/${sessionId}/edit`);
    } else {
      navigate(`/sessions/${sessionId}`);
    }
  };

  const handleCreateSession = () => {
    navigate('/sessions/new');
  };

  return (
    <SessionList 
      onSessionSelect={handleSessionSelect}
      onCreateSession={handleCreateSession}
    />
  );
}

function EncounterListPage() {
  const navigate = useNavigate();
  
  const handleEncounterSelect = (encounterId, mode = 'view') => {
    if (mode === 'edit') {
      navigate(`/encounters/${encounterId}/edit`);
    } else {
      navigate(`/encounters/${encounterId}`);
    }
  };

  const handleCreateEncounter = () => {
    navigate('/encounters/new');
  };

  const handleStartCombat = (encounter) => {
    // Lógica para iniciar combate
    navigate('/combat');
  };

  return (
    <EncounterList 
      onEncounterSelect={handleEncounterSelect}
      onCreateEncounter={handleCreateEncounter}
      onStartCombat={handleStartCombat}
    />
  );
}