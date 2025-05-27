import React, { useState, useRef, useEffect } from 'react';

export default function MultiSelectDropdown({
  label,
  options = [],
  selectedValue = null,
  onChange,
  placeholder = "Seleccionar...",
  required = false,
  disabled = false,
  error = null,
  className = "",
  // Configuración de display
  displayKey = "name", // Qué propiedad mostrar en la lista
  valueKey = "id", // Qué propiedad usar como valor
  searchable = true,
  maxHeight = "200px",
  // Estilo personalizado
  variant = "default", // default, compact, bordered
  icon = null, // Icono opcional para mostrar
  // Funcionalidad adicional
  onSearchChange = null,
  allowClear = true,
  loading = false,
  noOptionsMessage = "No hay opciones disponibles",
  // Props específicas para campaña
  showDescription = false,
  descriptionKey = "description"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filtrar opciones basado en búsqueda
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option[displayKey]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (showDescription && option[descriptionKey]?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options;

  // Obtener la opción seleccionada
  const selectedOption = selectedValue 
    ? options.find(option => option[valueKey] === selectedValue)
    : null;

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelect = (option) => {
    onChange(option[valueKey]);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Estilos según variante
  const getContainerClasses = () => {
    const base = "relative";
    const variants = {
      default: "",
      compact: "text-sm",
      bordered: "border-2 border-gray-200 rounded-lg p-1"
    };
    return `${base} ${variants[variant]} ${className}`;
  };

  const getDropdownClasses = () => {
    const base = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200";
    const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
    const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400";
    
    return `${base} ${errorClasses} ${disabledClasses}`;
  };

  return (
    <div className={getContainerClasses()}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown trigger */}
      <div ref={dropdownRef} className="relative">
        <div
          onClick={handleToggle}
          className={getDropdownClasses()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              {/* Icono opcional */}
              {icon && (
                <span className="mr-2 text-gray-400 flex-shrink-0">
                  {icon}
                </span>
              )}
              
              {/* Contenido seleccionado */}
              {selectedOption ? (
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {selectedOption[displayKey]}
                  </div>
                  {showDescription && selectedOption[descriptionKey] && (
                    <div className="text-xs text-gray-500 truncate">
                      {selectedOption[descriptionKey]}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-gray-500 truncate">{placeholder}</span>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center space-x-1 ml-2">
              {/* Loading spinner */}
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
              
              {/* Botón limpiar */}
              {allowClear && selectedOption && !disabled && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Flecha */}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {/* Campo de búsqueda */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}

            {/* Lista de opciones */}
            <div 
              className="overflow-y-auto"
              style={{ maxHeight }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : noOptionsMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option[valueKey]}
                    onClick={() => handleSelect(option)}
                    className={`px-3 py-2 cursor-pointer transition-colors duration-150 ${
                      selectedValue === option[valueKey]
                        ? 'bg-blue-100 text-blue-900'
                        : 'hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      {/* Icono de opción si existe */}
                      {option.icon && (
                        <span className="mr-2 text-gray-400">
                          {option.icon}
                        </span>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {option[displayKey]}
                        </div>
                        
                        {/* Descripción si está habilitada */}
                        {showDescription && option[descriptionKey] && (
                          <div className="text-xs text-gray-500 truncate">
                            {option[descriptionKey]}
                          </div>
                        )}
                        
                        {/* Información adicional para campañas */}
                        {option.dungeonMasterName && (
                          <div className="text-xs text-gray-400">
                            DM: {option.dungeonMasterName}
                          </div>
                        )}
                      </div>
                      
                      {/* Indicador de selección */}
                      {selectedValue === option[valueKey] && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}