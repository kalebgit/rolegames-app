// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContainer from './components/AuthContainer';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

// Characters
import CharacterList from './components/characters/CharacterList';
import CharacterForm from './components/characters/CharacterForm';

// Campaigns
import CampaignList from './components/campaigns/CampaignList';
import CampaignForm from './components/campaigns/CampaignForm';

// Items
import ItemList from './components/items/ItemList';
import ItemForm from './components/items/ItemForm';

// Spells
import SpellList from './components/spells/SpellList';
import SpellForm from './components/spells/SpellForm';

// NPCs
import NPCList from './components/npcs/NPCList';
import NPCForm from './components/npcs/NPCForm';

// Combat
import CombatTracker from './components/combat/CombatTracker';

// Sessions
import SessionList from './components/sessions/SessionList';
import SessionForm from './components/sessions/SessionForm';

// Encounters
import EncounterList from './components/encounters/EncounterList';
import EncounterForm from './components/encounters/EncounterForm';

//not found
import NotFound from './components/NotFound';
import { useUserStore } from './stores/useUserStore';

// Layout principal de la aplicación
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {children}
    </div>
  );
}

// Componente principal que maneja la autenticación
function AppContent() {
  //observando
  const isAuthenticated = useUserStore(state=>state.isAuthenticated)
  const loading = useUserStore(state=>state.loading)
  const fetchUserData = useUserStore(state=>state.fetchUserData)

  useEffect(()=>{
    fetchUserData()
  })
  console.log("🔐 AppContent: isAuthenticated =", isAuthenticated, "loading =", loading);
  
  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }
  
  // Si no está autenticado, mostrar solo las rutas de autenticación
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthContainer />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }
  
  // Si está autenticado, mostrar las rutas protegidas
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={
        <AppLayout>
          <Dashboard />
        </AppLayout>
      } />
      
      {/* Si está autenticado y va a /auth, redirigir al dashboard */}
      <Route path="/auth" element={<Navigate to="/" replace />} />
      
      {/* Characters */}
      <Route path="/characters" element={
        <AppLayout>
          <CharacterList />
        </AppLayout>
      } />
      <Route path="/characters/new" element={
        <AppLayout>
          <CharacterForm />
        </AppLayout>
      } />
      <Route path="/characters/:id/edit" element={
        <AppLayout>
          <CharacterForm />
        </AppLayout>
      } />
      
      {/* Campaigns */}
      <Route path="/campaigns" element={
        <AppLayout>
          <CampaignList />
        </AppLayout>
      } />
      <Route path="/campaigns/new" element={
        <AppLayout>
          <CampaignForm />
        </AppLayout>
      } />
      <Route path="/campaigns/:id/edit" element={
        <AppLayout>
          <CampaignForm />
        </AppLayout>
      } />
      
      {/* Items */}
      <Route path="/items" element={
        <AppLayout>
          <ItemList />
        </AppLayout>
      } />
      <Route path="/items/new" element={
        <AppLayout>
          <ItemForm />
        </AppLayout>
      } />
      <Route path="/items/:id/edit" element={
        <AppLayout>
          <ItemForm />
        </AppLayout>
      } />
      
      {/* Spells */}
      <Route path="/spells" element={
        <AppLayout>
          <SpellList />
        </AppLayout>
      } />
      <Route path="/spells/new" element={
        <AppLayout>
          <SpellForm />
        </AppLayout>
      } />
      <Route path="/spells/:id/edit" element={
        <AppLayout>
          <SpellForm />
        </AppLayout>
      } />
      
      {/* NPCs */}
      <Route path="/npcs" element={
        <AppLayout>
          <NPCList />
        </AppLayout>
      } />
      <Route path="/npcs/new" element={
        <AppLayout>
          <NPCForm />
        </AppLayout>
      } />
      <Route path="/npcs/:id/edit" element={
        <AppLayout>
          <NPCForm />
        </AppLayout>
      } />
      
      {/* Sessions */}
      <Route path="/sessions" element={
        <AppLayout>
          <SessionList />
        </AppLayout>
      } />
      <Route path="/sessions/new" element={
        <AppLayout>
          <SessionForm />
        </AppLayout>
      } />
      <Route path="/sessions/:id/edit" element={
        <AppLayout>
          <SessionForm />
        </AppLayout>
      } />
      
      {/* Encounters */}
      <Route path="/encounters" element={
        <AppLayout>
          <EncounterList />
        </AppLayout>
      } />
      <Route path="/encounters/new" element={
        <AppLayout>
          <EncounterForm />
        </AppLayout>
      } />
      <Route path="/encounters/:id/edit" element={
        <AppLayout>
          <EncounterForm />
        </AppLayout>
      } />
      
      {/* Combat */}
      <Route path="/combat" element={
        <AppLayout>
          <CombatTracker />
        </AppLayout>
      } />

      <Route path="/not-found" element={<NotFound/>}/>
      
      {/* Redirect any unknown route to not-found */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}