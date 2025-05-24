import React from 'react'
import useLoginForm from '../../hooks/useLoginForm'

export default function LoginForm({ onLoginSuccess, onToggleForm }) {
    const { credentials, error, success, loading, handleChange, handleSubmit } = useLoginForm({}, onLoginSuccess)

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
                        Entrar al Reino
                    </h2>
                    <p className="text-amber-700 font-serif italic text-sm">Los guardias esperan tus credenciales</p>
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
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label 
                            htmlFor="username" 
                            className="block text-sm font-medium text-amber-800 mb-2 font-serif"
                        >
                            👤 Nombre del Héroe
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border-2 border-amber-600 rounded-md shadow-sm bg-amber-50 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-700 font-serif transition-all duration-200 hover:bg-amber-25 text-sm"
                            placeholder="Ingresa tu nombre, valiente aventurero"
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
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border-2 border-amber-600 rounded-md shadow-sm bg-amber-50 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-700 font-serif transition-all duration-200 hover:bg-amber-25 text-sm"
                            placeholder="Susurra tus palabras secretas"
                        />
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
                                Abriendo las puertas...
                            </div>
                        ) : (
                            <>
                                <span className="mr-2">⚔️</span>
                                Entrar al Reino
                                <span className="ml-2">⚔️</span>
                            </>
                        )}
                    </button>
                    
                    {/* Enlace a registro */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-amber-700 font-serif">
                            ¿Nuevo en el reino?{' '}
                            <button
                                type="button"
                                onClick={onToggleForm}
                                className="font-medium text-amber-900 hover:text-amber-800 underline focus:outline-none"
                            >
                                Regístrate ahora
                            </button>
                        </p>
                    </div>
                    
                    {/* Medieval footer */}
                    <div className="text-center mt-4">
                        <p className="text-xs text-amber-600 font-serif italic">
                            "Solo los dignos pueden cruzar estas puertas"
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}