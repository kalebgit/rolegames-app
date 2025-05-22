import React from 'react';
import useRegisterForm from '../hooks/useRegisterForm';

export default function RegisterForm({ onRegisterSuccess, onToggleForm }) {
    const {
        formData,
        error,
        success,
        loading,
        handleChange,
        handleSubmit
    } = useRegisterForm({}, onRegisterSuccess);

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-2xl border-4 border-amber-600 p-6 relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-amber-700"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-amber-700"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-amber-700"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-amber-700"></div>
                
                {/* Medieval header with shield icon */}
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
                        <div className="text-4xl">🛡️</div>
                    </div>
                    <h2 className="text-xl font-bold text-amber-900 font-serif tracking-wide">
                        Únete al Reino
                    </h2>
                    <p className="text-amber-700 font-serif italic text-sm">Regístrate para comenzar tu aventura</p>
                </div>
                
                {error && (
                    <div className="bg-red-100 border-2 border-red-600 text-red-800 px-3 py-2 rounded mb-4 font-serif text-sm">
                        <div className="flex items-center">
                            <span className="mr-2">⚠️</span>
                            {error}
                        </div>
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border-2 border-green-600 text-green-800 px-3 py-2 rounded mb-4 font-serif text-sm">
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            {success}
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label 
                            htmlFor="username" 
                            className="block text-sm font-medium text-amber-800 mb-2 font-serif"
                        >
                            👤 Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border-2 border-amber-600 rounded-md shadow-sm bg-amber-50 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-700 font-serif transition-all duration-200 hover:bg-amber-25 text-sm"
                            placeholder="Elige tu nombre de aventurero"
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-amber-800 mb-2 font-serif"
                        >
                            📧 Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border-2 border-amber-600 rounded-md shadow-sm bg-amber-50 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-700 font-serif transition-all duration-200 hover:bg-amber-25 text-sm"
                            placeholder="tu@email.com"
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-amber-800 mb-2 font-serif"
                        >
                            🗝️ Contraseña Secreta
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border-2 border-amber-600 rounded-md shadow-sm bg-amber-50 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-700 font-serif transition-all duration-200 hover:bg-amber-25 text-sm"
                            placeholder="Crea tu contraseña secreta"
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="confirmPassword" 
                            className="block text-sm font-medium text-amber-800 mb-2 font-serif"
                        >
                            🔒 Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border-2 border-amber-600 rounded-md shadow-sm bg-amber-50 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-700 font-serif transition-all duration-200 hover:bg-amber-25 text-sm"
                            placeholder="Repite tu contraseña"
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="userType" 
                            className="block text-sm font-medium text-amber-800 mb-2 font-serif"
                        >
                            🎭 Tipo de Usuario
                        </label>
                        <select
                            id="userType"
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-2 border-amber-600 rounded-md shadow-sm bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-700 font-serif transition-all duration-200 hover:bg-amber-25 text-sm"
                        >
                            <option value="PLAYER">Jugador</option>
                            <option value="DUNGEON_MASTER">Dungeon Master</option>
                        </select>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border-2 border-amber-700 rounded-md shadow-lg text-sm font-medium text-amber-100 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gradient-to-b disabled:from-gray-400 disabled:to-gray-600 disabled:cursor-not-allowed font-serif tracking-wider transform hover:scale-105 transition-all duration-200"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-amber-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creando cuenta...
                            </div>
                        ) : (
                            <>
                                <span className="mr-2">⚔️</span>
                                Registrarse
                                <span className="ml-2">⚔️</span>
                            </>
                        )}
                    </button>
                    
                    {/* Enlace a login */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-amber-700 font-serif">
                            ¿Ya tienes una cuenta?{' '}
                            <button
                                type="button"
                                onClick={onToggleForm}
                                className="font-medium text-amber-900 hover:text-amber-800 underline focus:outline-none"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}