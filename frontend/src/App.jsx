import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import AuthContainer from './components/AuthContainer';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
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

// Componente de protección de rutas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

// Layout principal de la aplicación
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      {children}
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route 
          path="/auth" 
          element={
            <AuthContainer />
          } 
        />
        
        
        
        {/* Characters */}
        <Route path="/characters" element={
          <ProtectedRoute>
            <AppLayout>
              <CharacterList />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/characters/new" element={
          <ProtectedRoute>
            <AppLayout>
              <CharacterForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/characters/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <CharacterForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Campaigns */}
        <Route path="/campaigns" element={
          <ProtectedRoute>
            <AppLayout>
              <CampaignList />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns/new" element={
          <ProtectedRoute>
            <AppLayout>
              <CampaignForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <CampaignForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Items */}
        <Route path="/items" element={
          <ProtectedRoute>
            <AppLayout>
              <ItemList />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/items/new" element={
          <ProtectedRoute>
            <AppLayout>
              <ItemForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/items/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <ItemForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Spells */}
        <Route path="/spells" element={
          <ProtectedRoute>
            <AppLayout>
              <SpellList />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/spells/new" element={
          <ProtectedRoute>
            <AppLayout>
              <SpellForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/spells/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <SpellForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* NPCs */}
        <Route path="/npcs" element={
          <ProtectedRoute>
            <AppLayout>
              <NPCList />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/npcs/new" element={
          <ProtectedRoute>
            <AppLayout>
              <NPCForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/npcs/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <NPCForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Sessions */}
        <Route path="/sessions" element={
          <ProtectedRoute>
            <AppLayout>
              <SessionList />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/sessions/new" element={
          <ProtectedRoute>
            <AppLayout>
              <SessionForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/sessions/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <SessionForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Encounters */}
        <Route path="/encounters" element={
          <ProtectedRoute>
            <AppLayout>
              <EncounterList />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/encounters/new" element={
          <ProtectedRoute>
            <AppLayout>
              <EncounterForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/encounters/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <EncounterForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Combat */}
        <Route path="/combat" element={
          <ProtectedRoute>
            <AppLayout>
              <CombatTracker />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/not-found" element={<NotFound/>}/>
        
        {/* Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
}

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Componente de prueba simple
// function TestComponent() {
//   return (
//     <div style={{ 
//       padding: '20px', 
//       backgroundColor: '#f0f0f0', 
//       margin: '20px',
//       borderRadius: '8px'
//     }}>
//       <h1>🎮 RoleGames Debug Test</h1>
//       <p>Si ves esto, React está funcionando correctamente.</p>
//       <p>Timestamp: {new Date().toLocaleString()}</p>
//     </div>
//   );
// }

// // Versión simplificada para debugging
// function App() {
//   console.log("🚀 App component is rendering...");
  
//   try {
//     return (
//       <Router>
//         <div className="min-h-screen bg-gray-100">
//           <TestComponent />
//           <Routes>
//             <Route path="/" element={<TestComponent />} />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </div>
//       </Router>
//     );
//   } catch (error) {
//     console.error("❌ Error in App component:", error);
//     return (
//       <div style={{ padding: '20px', color: 'red' }}>
//         <h1>Error en la aplicación</h1>
//         <pre>{error.toString()}</pre>
//       </div>
//     );
//   }
// }

// export default App;