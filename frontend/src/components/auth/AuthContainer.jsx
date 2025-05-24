import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useUserStore } from '../../stores/useUserStore';

export default function AuthContainer() {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  
  // Solo obtener el estado, no las acciones que podrían causar re-renders
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  
  // Efecto separado para manejar redirección cuando está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuario autenticado, redirigiendo...");
      // Usar setTimeout para evitar setState durante render
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);
  
  const handleLoginSuccess = (userData) => {
    console.log("Login exitoso en AuthContainer.jsx");
    setIsAuthenticated(true);
    // No llamar navigate aquí, dejar que el useEffect lo maneje
  };
  
  const handleRegisterSuccess = (userData) => {
    console.log("Registro exitoso en AuthContainer.jsx");
    // Después del registro, mostrar login para que inicie sesión
    setShowLogin(true);
    // Nota: No establecer isAuthenticated aquí, el usuario debe hacer login
  };
  
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  // Si está autenticado, mostrar loading mientras redirige
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            RoleGames Application
          </h1>
        </div>
        
        {showLogin ? (
          <LoginForm 
            onLoginSuccess={handleLoginSuccess} 
            onToggleForm={toggleForm} 
          />
        ) : (
          <RegisterForm 
            onRegisterSuccess={handleRegisterSuccess} 
            onToggleForm={toggleForm} 
          />
        )}
      </div>
    </div>
  );
}