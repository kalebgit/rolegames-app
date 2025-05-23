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

function ProtectedRoute({children}){
  const isAuthenticated = useUserStore(state=>state.isAuthenticated)
  const loading = useUserStore(state=>state.loading)

  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
  }

  return (
      <AuthGuard>
          <AppLayout>
              {children}
          </AppLayout>
      </AuthGuard>
  );
}

// Componente principal que maneja la autenticación
function AppContent() {

  return (
    <Routes>
      {/* Ruta de autenticación */}
      <Route path="/auth" element={<AuthContainer />} />
      
      {/* Dashboard */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Characters */}
      <Route path="/characters" element={
        <ProtectedRoute>
          <CharacterList />
        </ProtectedRoute>
      } />
      <Route path="/characters/new" element={
        <ProtectedRoute>
          <CharacterForm />
        </ProtectedRoute>
      } />
      <Route path="/characters/:id/edit" element={
        <ProtectedRoute>
          <CharacterForm />
        </ProtectedRoute>
      } />
      
      {/* Campaigns */}
      <Route path="/campaigns" element={
        <ProtectedRoute>
          <CampaignList />
        </ProtectedRoute>
      } />
      <Route path="/campaigns/new" element={
        <ProtectedRoute>
          <CampaignForm />
        </ProtectedRoute>
      } />
      <Route path="/campaigns/:id/edit" element={
        <ProtectedRoute>
          <CampaignForm />
        </ProtectedRoute>
      } />
      
      {/* Items */}
      <Route path="/items" element={
        <ProtectedRoute>
          <ItemList />
        </ProtectedRoute>
      } />
      <Route path="/items/new" element={
        <ProtectedRoute>
          <ItemForm />
        </ProtectedRoute>
      } />
      <Route path="/items/:id/edit" element={
        <ProtectedRoute>
          <ItemForm />
        </ProtectedRoute>
      } />
      
      {/* Spells */}
      <Route path="/spells" element={
        <ProtectedRoute>
          <SpellList />
        </ProtectedRoute>
      } />
      <Route path="/spells/new" element={
        <ProtectedRoute>
          <SpellForm />
        </ProtectedRoute>
      } />
      <Route path="/spells/:id/edit" element={
        <ProtectedRoute>
          <SpellForm />
        </ProtectedRoute>
      } />
      
      {/* NPCs */}
      <Route path="/npcs" element={
        <ProtectedRoute>
          <NPCList />
        </ProtectedRoute>
      } />
      <Route path="/npcs/new" element={
        <ProtectedRoute>
          <NPCForm />
        </ProtectedRoute>
      } />
      <Route path="/npcs/:id/edit" element={
        <ProtectedRoute>
          <NPCForm />
        </ProtectedRoute>
      } />
      
      {/* Sessions */}
      <Route path="/sessions" element={
        <ProtectedRoute>
          <SessionList />
        </ProtectedRoute>
      } />
      <Route path="/sessions/new" element={
        <ProtectedRoute>
          <SessionForm />
        </ProtectedRoute>
      } />
      <Route path="/sessions/:id/edit" element={
        <ProtectedRoute>
          <SessionForm />
        </ProtectedRoute>
      } />
      
      {/* Encounters */}
      <Route path="/encounters" element={
        <ProtectedRoute>
          <EncounterList />
        </ProtectedRoute>
      } />
      <Route path="/encounters/new" element={
        <ProtectedRoute>
          <EncounterForm />
        </ProtectedRoute>
      } />
      <Route path="/encounters/:id/edit" element={
        <ProtectedRoute>
          <EncounterForm />
        </ProtectedRoute>
      } />
      
      {/* Combat */}
      <Route path="/combat" element={
        <ProtectedRoute>
          <CombatTracker />
        </ProtectedRoute>
      } />

      {/* Not Found */}
      <Route path="/not-found" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />
      
      {/* Redirect any unknown route to auth */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
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