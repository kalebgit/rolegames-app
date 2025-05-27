
// SESIÓN CORTA (~1 hora)
export const shortSession = {
  sessionNumber: 1,
  date: '',
  duration: 60,
  summary: "Los aventureros se infiltraron en la torre abandonada y enfrentaron a un grupo de bandidos.",
  dmNotes: "Introducir pistas sobre el artefacto en la próxima sesión.",
  nextSessionObjectives: "Explorar el segundo piso y descifrar los símbolos antiguos."
};

// SESIÓN MEDIA (~2 horas)
export const mediumSession = {
  sessionNumber: 1,
  date: '',
  duration: 120,
  summary: "El grupo descubrió ruinas antiguas y negoció con una tribu de orcos pacíficos.",
  dmNotes: "Reforzar la conexión del chamán con el NPC profético.",
  nextSessionObjectives: "Buscar el fragmento del titán perdido en las montañas del norte."
};

// SESIÓN LARGA (~4 horas)
export const longSession = {
  sessionNumber: 1,
  date: '',
  duration: 240,
  summary: "Una extensa misión de rescate dentro de una ciudad sitiada terminó con un combate épico.",
  dmNotes: "Introducir conflicto político entre las casas nobles.",
  nextSessionObjectives: "Viajar a la capital para entregar información crucial."
};

// SESIÓN DE COMBATE INTENSO
export const combatSession = {
  sessionNumber: 1,
  date: '',
  duration: 180,
  summary: "Una serie de combates desafiantes contra las fuerzas del mal culminó en una batalla épica contra un dragón joven.",
  dmNotes: "Los jugadores usaron estrategias creativas. Darles recompensas especiales por su ingenio.",
  nextSessionObjectives: "Explorar el tesoro del dragón y lidiar con las consecuencias políticas de la victoria."
};

// SESIÓN DE ROLEPLAY SOCIAL
export const socialSession = {
  sessionNumber: 1,
  date: '',
  duration: 150,
  summary: "Los personajes navegaron intrincadas relaciones cortesanas y negociaron alianzas políticas cruciales.",
  dmNotes: "Excelente interpretación de roles. Anotar las promesas hechas a los NPCs para futuras sesiones.",
  nextSessionObjectives: "Investigar los rumores sobre la conspiración noble y prepararse para el baile real."
};

// SESIÓN DE EXPLORACIÓN Y MISTERIO
export const explorationSession = {
  sessionNumber: 1,
  date: '',
  duration: 200,
  summary: "Los aventureros exploraron ruinas ancestrales, resolvieron acertijos complejos y descubrieron secretos olvidados.",
  dmNotes: "Los jugadores encontraron pistas importantes sobre la historia del mundo. Desarrollar más el trasfondo.",
  nextSessionObjectives: "Seguir las pistas hacia la biblioteca perdida y descifrar los textos antiguos."
};

// SESIÓN DE CIUDAD/TAVERNA
export const tavernSession = {
  sessionNumber: 1,
  date: '',
  duration: 90,
  summary: "Una sesión más relajada en la ciudad donde los personajes se reagruparon, compraron equipo y recibieron nuevas misiones.",
  dmNotes: "Buena oportunidad para desarrollo de personajes. Los jugadores mostraron interés en el trasfondo de sus PCs.",
  nextSessionObjectives: "Prepararse para el viaje hacia las Tierras Salvajes y conseguir suministros adicionales."
};

// SESIÓN DE MAZMORRA CLÁSICA
export const dungeonSession = {
  sessionNumber: 1,
  date: '',
  duration: 210,
  summary: "Exploración completa de una mazmorra abandonada con trampas, puzzles y combates contra no-muertos.",
  dmNotes: "Los jugadores trabajaron bien en equipo. La trampa del corredor casi los sorprende completamente.",
  nextSessionObjectives: "Regresar a la superficie con el artefacto recuperado y lidiar con sus efectos mágicos."
};

// SESIÓN DE INVESTIGACIÓN
export const investigationSession = {
  sessionNumber: 1,
  date: '',
  duration: 160,
  summary: "Los personajes investigaron una serie de crímenes misteriosos, recopilaron pistas y confrontaron al culpable.",
  dmNotes: "Excelente trabajo detectivesco por parte de los jugadores. La revelación final fue impactante.",
  nextSessionObjectives: "Lidiar con las ramificaciones del caso resuelto y seguir la pista hacia la organización mayor."
};

// SESIÓN DE VIAJE Y ENCUENTROS ALEATORIOS
export const travelSession = {
  sessionNumber: 1,
  date: '',
  duration: 135,
  summary: "Un viaje lleno de encuentros inesperados: comerciantes, bandidos, criaturas mágicas y fenómenos extraños.",
  dmNotes: "Los encuentros aleatorios funcionaron bien para el ritmo. El druida local fue un NPC popular.",
  nextSessionObjectives: "Llegar al destino y prepararse para los desafíos que les esperan en la nueva región."
};

// SESIÓN DE BOSS FINAL
export const bossSession = {
  sessionNumber: 1,
  date: '',
  duration: 300,
  summary: "La confrontación épica final contra el villano principal de la campaña en su fortaleza, con múltiples fases de combate.",
  dmNotes: "Combate memorable y emotivo. Los jugadores lograron una victoria heroica con sacrificios significativos.",
  nextSessionObjectives: "Epílogo: lidiar con las consecuencias de la victoria y el nuevo orden mundial establecido."
};

// Array con todos los templates para fácil acceso
export const sessionTemplates = [
  {
    id: 'short',
    name: 'Sesión Corta (1 hora)',
    description: 'Perfecta para aventuras rápidas y encuentros puntuales',
    icon: '⚡',
    category: 'duration',
    template: shortSession
  },
  {
    id: 'medium',
    name: 'Sesión Media (2 horas)',
    description: 'Duración estándar con buen balance de roleplay y acción',
    icon: '⚖️',
    category: 'duration',
    template: mediumSession
  },
  {
    id: 'long',
    name: 'Sesión Larga (4 horas)',
    description: 'Para aventuras épicas y exploraciones extensas',
    icon: '📚',
    category: 'duration',
    template: longSession
  },
  {
    id: 'combat',
    name: 'Combate Intenso',
    description: 'Enfocada en batallas estratégicas y acción',
    icon: '⚔️',
    category: 'theme',
    template: combatSession
  },
  {
    id: 'social',
    name: 'Roleplay Social',
    description: 'Interacciones sociales, política y diplomacia',
    icon: '💬',
    category: 'theme',
    template: socialSession
  },
  {
    id: 'exploration',
    name: 'Exploración y Misterio',
    description: 'Descubrimientos, puzzles y secretos por revelar',
    icon: '🔍',
    category: 'theme',
    template: explorationSession
  },
  {
    id: 'tavern',
    name: 'Ciudad/Taverna',
    description: 'Descanso, preparación y desarrollo de personajes',
    icon: '🏛️',
    category: 'theme',
    template: tavernSession
  },
  {
    id: 'dungeon',
    name: 'Mazmorra Clásica',
    description: 'Exploración de mazmorras con trampas y tesoros',
    icon: '🏰',
    category: 'theme',
    template: dungeonSession
  },
  {
    id: 'investigation',
    name: 'Investigación',
    description: 'Misterios para resolver y pistas que seguir',
    icon: '🔎',
    category: 'theme',
    template: investigationSession
  },
  {
    id: 'travel',
    name: 'Viaje y Encuentros',
    description: 'Viajes con encuentros aleatorios y descubrimientos',
    icon: '🗺️',
    category: 'theme',
    template: travelSession
  },
  {
    id: 'boss',
    name: 'Boss Final',
    description: 'Confrontación épica y clímax de la campaña',
    icon: '👑',
    category: 'special',
    template: bossSession
  }
];

// Función helper para obtener template por ID
export const getTemplateById = (templateId) => {
  const templateData = sessionTemplates.find(t => t.id === templateId);
  return templateData ? { ...templateData.template } : null;
};

// Función helper para obtener templates por categoría
export const getTemplatesByCategory = (category) => {
  return sessionTemplates.filter(t => t.category === category);
};

// Función para aplicar template y mantener ciertos valores del formulario actual
export const applyTemplate = (template, currentData = {}) => {
  return {
    ...template,
    // Mantener algunos valores específicos que no queremos sobrescribir
    sessionNumber: currentData.sessionNumber || template.sessionNumber,
    date: currentData.date || template.date, // Mantener fecha si ya está establecida
    // Aplicar el resto del template
    duration: template.duration,
    summary: template.summary,
    dmNotes: template.dmNotes,
    nextSessionObjectives: template.nextSessionObjectives
  };
};