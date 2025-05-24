import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthContainer from './components/auth/AuthContainer';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Componentes que requieren roles específicos
import CharacterForm from './components/characters/CharacterForm';
import NPCForm from './components/npcs/NPCForm';
import CampaignForm from './components/campaigns/CampaignForm';

// Componentes generales
import CharacterList from './components/characters/CharacterList';
import CampaignList from './components/campaigns/CampaignList';
import SpellList from './components/spells/SpellList';
import CombatTracker from './components/combat/CombatTracker';

// Gestión de roles
import RoleManager from './components/auth/RoleManager';

import { useUserStore } from './stores/useUserStore';
import LoadingSpinner from './components/common/LoadingSpinner';

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
          
          {/* RUTAS QUE REQUIEREN ROL DE PLAYER */}
          <Route path="/characters/new" element={
            <ProtectedRouteWithAuth requiredRole="PLAYER">
              <CharacterForm />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/characters/:id/edit" element={
            <ProtectedRouteWithAuth requiredRole="PLAYER">
              <CharacterForm />
            </ProtectedRouteWithAuth>
          } />
          
          {/* RUTAS QUE REQUIEREN ROL DE DUNGEON_MASTER */}
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
          
          {/* RUTAS GENERALES (sin rol específico) */}
          <Route path="/characters" element={
            <ProtectedRouteWithAuth>
              <CharacterList />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/campaigns" element={
            <ProtectedRouteWithAuth>
              <CampaignList />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/spells" element={
            <ProtectedRouteWithAuth>
              <SpellList />
            </ProtectedRouteWithAuth>
          } />
          <Route path="/combat" element={
            <ProtectedRouteWithAuth>
              <CombatTracker />
            </ProtectedRouteWithAuth>
          } />
          
          {/* Redirect any unknown route */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AppInitializer>
    </Router>
  );
}