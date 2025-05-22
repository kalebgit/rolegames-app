import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthContainer() {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  
  const handleLoginSuccess = (userData) => {
    
    navigate('/');
  };
  
  const handleRegisterSuccess = (userData) => {
    
    setShowLogin(true);
  };
  
  
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  
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