import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useUserStore } from '../../stores/useUserStore';

export default function AuthContainer() {
  const [showLogin, setShowLogin] = useState(true);
  const isAuthenticated = useUserStore(state=>state.isAuthenticated)
  const setIsAuthenticated = useUserStore(state=>state.setIsAuthenticated)
  const navigate = useNavigate();
  
  const handleLoginSuccess = (userData) => {
    console.log("se loggeo perfectaomente (dentro de login handler en AuthContianer.jsx")
    setIsAuthenticated(true)
    navigate('/');
  };
  
  const handleRegisterSuccess = (userData) => {
    setIsAuthenticated(true)
    setShowLogin(true);
  };
  
  
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  if(isAuthenticated){
    console.log("el usuario esta autenticado")
    navigate('/')
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