// frontend/src/data/encounterTemplates.js

// COMBATE TRIVIAL
const trivialCombat = {
    name: "Encuentro con Ratas Gigantes",
    description: "Un pequeño grupo de ratas gigantes hambrientas bloquea el paso en un callejón estrecho.",
    encounterType: "COMBAT",
    difficulty: "TRIVIAL",
    isCompleted: false,
    notes: "Enemigos débiles, perfecto para jugadores nuevos o para consumir recursos menores."
  };
  
  // COMBATE FÁCIL
  const easyCombat = {
    name: "Patrulla de Goblins",
    description: "Una patrulla descuidada de 3-4 goblins se encuentra con el grupo en un camino rural.",
    encounterType: "COMBAT",
    difficulty: "EASY",
    isCompleted: false,
    notes: "Los goblins intentarán huir si pierden la mitad de sus miembros. Considerar persecución."
  };
  
  // COMBATE MEDIO
  const mediumCombat = {
    name: "Emboscada en el Bosque Oscuro",
    description: "El grupo es sorprendido por bandidos encapuchados mientras atraviesa un sendero angosto entre árboles densos.",
    encounterType: "COMBAT",
    difficulty: "MEDIUM",
    isCompleted: false,
    notes: "Los enemigos conocen el terreno. Considerar cobertura, ventaja por sorpresa y posibles refuerzos."
  };
  
  // COMBATE DIFÍCIL
  const hardCombat = {
    name: "Duelo con el Campeón del Gremio",
    description: "Un guerrero veterano desafía al grupo en combate ritual por el derecho de paso a territorio sagrado.",
    encounterType: "COMBAT",
    difficulty: "HARD",
    isCompleted: false,
    notes: "Combate honorable, sin magia de área. El enemigo tiene tácticas avanzadas y equipo superior."
  };
  
  // COMBATE MORTAL
  const deadlyCombat = {
    name: "Despertar del Dragón Joven",
    description: "El grupo ha despertado accidentalmente a un dragón joven de su letargo en su guarida llena de tesoros.",
    encounterType: "COMBAT",
    difficulty: "DEADLY",
    isCompleted: false,
    notes: "Ambiente peligroso, aliento de dragón, vuelo. Considerar escape como opción válida."
  };
  
  // SOCIAL FÁCIL
  const easySocial = {
    name: "Negociación con el Noble Local",
    description: "Los aventureros deben convencer a un noble escéptico de permitirles acceso a los archivos confidenciales de la ciudad.",
    encounterType: "SOCIAL",
    difficulty: "EASY",
    isCompleted: false,
    notes: "El noble valora el protocolo y las buenas maneras. Bonificación por etiqueta apropiada."
  };
  
  // SOCIAL MEDIO
  const mediumSocial = {
    name: "Mediación en Conflicto Comercial",
    description: "Dos gremios de comerciantes están en disputa y necesitan mediación neutral para resolver sus diferencias.",
    encounterType: "SOCIAL",
    difficulty: "MEDIUM",
    isCompleted: false,
    notes: "Ambas partes tienen puntos válidos. Solución requiere creatividad y diplomacia hábil."
  };
  
  // SOCIAL DIFÍCIL
  const hardSocial = {
    name: "Tribunal Real de Acusación",
    description: "Los personajes deben defenderse ante la corte real de acusaciones graves que podrían resultar en exilio o muerte.",
    encounterType: "SOCIAL",
    difficulty: "HARD",
    isCompleted: false,
    notes: "Alto nivel de protocolo, evidencia requerida, consecuencias severas por fracaso."
  };
  
  // PUZZLE FÁCIL
  const easyPuzzle = {
    name: "Cerradura de Combinación Antigua",
    description: "Una puerta está sellada con una cerradura que requiere ordenar símbolos según las estaciones del año.",
    encounterType: "PUZZLE",
    difficulty: "EASY",
    isCompleted: false,
    notes: "Pistas disponibles en murales cercanos. Permite múltiples intentos sin penalización."
  };
  
  // PUZZLE MEDIO
  const mediumPuzzle = {
    name: "El Reloj de Runas Elementales",
    description: "Una estructura circular con runas de los cuatro elementos debe alinearse correctamente para activar un portal mágico.",
    encounterType: "PUZZLE",
    difficulty: "MEDIUM",
    isCompleted: false,
    notes: "Pistas dispersas en la habitación. Errores causan daño mágico menor pero no impiden reintentos."
  };
  
  // PUZZLE DIFÍCIL
  const hardPuzzle = {
    name: "Laberinto de Espejos Dimensionales",
    description: "Los personajes deben navegar un laberinto donde cada espejo puede llevarlos a una dimensión diferente.",
    encounterType: "PUZZLE",
    difficulty: "HARD",
    isCompleted: false,
    notes: "Mapear incorrectamente resulta en separación del grupo. Requiere trabajo en equipo y lógica espacial."
  };
  
  // TRAMPA FÁCIL
  const easyTrap = {
    name: "Foso Oculto Básico",
    description: "Un foso de 3 metros de profundidad está disimulado bajo una alfombra falsa en un pasillo de mazmorra.",
    encounterType: "TRAP",
    difficulty: "EASY",
    isCompleted: false,
    notes: "Fácil de detectar con investigación. Daño menor por caída, fácil de escalar para salir."
  };
  
  // TRAMPA MEDIA
  const mediumTrap = {
    name: "Dardos Envenenados de Pared",
    description: "Placas de presión en el suelo activan dardos envenenados que emergen de agujeros ocultos en las paredes.",
    encounterType: "TRAP",
    difficulty: "MEDIUM",
    isCompleted: false,
    notes: "Patrón predecible una vez descubierto. Veneno causa parálisis temporal, no letal."
  };
  
  // TRAMPA MORTAL
  const deadlyTrap = {
    name: "Pasillo de Agujas Místicas",
    description: "Una trampa mágica se activa si no se sigue el patrón exacto de baldosas. Los errores desatan magia destructiva.",
    encounterType: "TRAP",
    difficulty: "DEADLY",
    isCompleted: false,
    notes: "Un error desata rayos de fuego. Dos errores colapsan el techo. Tres errores son potencialmente letales."
  };
  
  // EXPLORACIÓN TRIVIAL
  const trivialExploration = {
    name: "Ruinas del Templo Caído",
    description: "Los personajes exploran ruinas antiguas cubiertas de musgo, donde la naturaleza ha reclamado la arquitectura sagrada.",
    encounterType: "EXPLORATION",
    difficulty: "TRIVIAL",
    isCompleted: false,
    notes: "Ideal para establecer atmósfera. Posibles hallazgos menores: monedas, gemas pequeñas, hierbas medicinales."
  };
  
  // EXPLORACIÓN FÁCIL
  const easyExploration = {
    name: "Investigación en la Biblioteca Abandonada",
    description: "Una biblioteca polvorientas contiene conocimientos perdidos, pero requiere tiempo y paciencia para encontrar información útil.",
    encounterType: "EXPLORATION",
    difficulty: "EASY",
    isCompleted: false,
    notes: "Investigación exitosa revela pistas sobre la misión principal. Posible encuentro con bibliotecario fantasma amigable."
  };
  
  // EXPLORACIÓN MEDIA
  const mediumExploration = {
    name: "Cartografiado de Cavernas Inexploradas",
    description: "Los aventureros deben mapear un sistema de cavernas peligroso mientras buscan una salida o recurso específico.",
    encounterType: "EXPLORATION",
    difficulty: "MEDIUM",
    isCompleted: false,
    notes: "Requiere suministros y planificación. Riesgo de perderse, encuentros aleatorios con criaturas de caverna."
  };
  
  // EXPLORACIÓN DIFÍCIL
  const hardExploration = {
    name: "Navegación en la Tormenta Planar",
    description: "El grupo debe encontrar su camino de regreso a su plano natal mientras navegan tormentas mágicas interdimensionales.",
    encounterType: "EXPLORATION",
    difficulty: "HARD",
    isCompleted: false,
    notes: "Requiere conocimiento arcano, navegación celestial y resistencia mental. Fallas resultan en deriva planar prolongada."
  };
  
  // ENCUENTROS ESPECÍFICOS DE CAMPAÑA
  
  // INVESTIGACIÓN SOCIAL-PUZZLE
  const investigationMystery = {
    name: "El Misterio del Mercader Desaparecido",
    description: "Los personajes deben investigar la desaparición de un mercader prominente, recopilando pistas de testigos y escenas del crimen.",
    encounterType: "SOCIAL",
    difficulty: "MEDIUM",
    isCompleted: false,
    notes: "Combina roleplay con deducción. Múltiples NPCs con información parcial. Pistas físicas requieren investigación."
  };
  
  // COMBATE CON ELEMENTOS AMBIENTALES
  const environmentalCombat = {
    name: "Batalla en el Puente Colgante",
    description: "Un combate crucial se desarrolla en un puente de cuerda sobre un abismo, donde el equilibrio es tan importante como la espada.",
    encounterType: "COMBAT",
    difficulty: "HARD",
    isCompleted: false,
    notes: "Espacio limitado, riesgo de caída, cuerdas pueden cortarse. Balance entre táctica y supervivencia."
  };
  
  // ENCUENTRO DE MÚLTIPLES FASES
  const multiphaseEncounter = {
    name: "El Ritual Interrumpido",
    description: "Los héroes irrumpen en un ritual oscuro. Primero deben superar guardias, luego resolver el puzzle del círculo mágico, y finalmente enfrentar la entidad parcialmente invocada.",
    encounterType: "COMBAT",
    difficulty: "DEADLY",
    isCompleted: false,
    notes: "Tres fases: Combate inicial, puzzle bajo presión, boss fight. Cada fase afecta la siguiente."
  };
  
  // ENCUENTRO DE PERSECUCIÓN
  const chaseEncounter = {
    name: "Persecución por los Tejados",
    description: "Los personajes deben perseguir (o escapar de) enemigos a través de los tejados de la ciudad, saltando entre edificios y evitando obstáculos.",
    encounterType: "EXPLORATION",
    difficulty: "MEDIUM",
    isCompleted: false,
    notes: "Usa reglas de persecución. Obstáculos incluyen tejados resbaladizos, guardias de la ciudad, y distancias peligrosas."
  };
  
  // ENCUENTRO DE DIPLOMACIA COMPLEJA
  const complexDiplomacy = {
    name: "Cumbre de las Cinco Naciones",
    description: "Los personajes median en una cumbre diplomática donde cinco naciones deben llegar a un acuerdo sobre territorios disputados.",
    encounterType: "SOCIAL",
    difficulty: "HARD",
    isCompleted: false,
    notes: "Cada nación tiene objetivos secretos. Exito requiere descubrir motivaciones ocultas y crear compromisos creativos."
  };
  
  // ENCUENTRO DE SUPERVIVENCIA
  const survivalEncounter = {
    name: "Perdidos en la Tormenta de Nieve",
    description: "El grupo debe sobrevivir a una tormenta de nieve mágica que los separa y los desorientas mientras buscan refugio.",
    encounterType: "EXPLORATION",
    difficulty: "HARD",
    isCompleted: false,
    notes: "Mecánicas de frío extremo, visibilidad limitada, recursos escasos. Trabajo en equipo esencial para supervivencia."
  };
  
  // Array principal con todos los templates
  export const encounterTemplates = [
    // COMBATE
    {
      id: 'trivial-combat',
      name: 'Combate Trivial',
      description: 'Encuentro de combate muy fácil, ideal para calentamiento',
      icon: '🐭',
      category: 'combat',
      difficulty: 'TRIVIAL',
      template: trivialCombat
    },
    {
      id: 'easy-combat',
      name: 'Combate Fácil',
      description: 'Batalla sencilla con enemigos débiles',
      icon: '⚔️',
      category: 'combat',
      difficulty: 'EASY',
      template: easyCombat
    },
    {
      id: 'medium-combat',
      name: 'Combate Equilibrado',
      description: 'Batalla balanceada para el nivel del grupo',
      icon: '🗡️',
      category: 'combat',
      difficulty: 'MEDIUM',
      template: mediumCombat
    },
    {
      id: 'hard-combat',
      name: 'Combate Desafiante',
      description: 'Batalla difícil que pondrá a prueba al grupo',
      icon: '⚡',
      category: 'combat',
      difficulty: 'HARD',
      template: hardCombat
    },
    {
      id: 'deadly-combat',
      name: 'Combate Mortal',
      description: 'Encuentro extremadamente peligroso',
      icon: '🔥',
      category: 'combat',
      difficulty: 'DEADLY',
      template: deadlyCombat
    },
  
    // SOCIAL
    {
      id: 'easy-social',
      name: 'Interacción Social Básica',
      description: 'Conversación o negociación sencilla',
      icon: '💬',
      category: 'social',
      difficulty: 'EASY',
      template: easySocial
    },
    {
      id: 'medium-social',
      name: 'Negociación Compleja',
      description: 'Situación social que requiere diplomacia hábil',
      icon: '🤝',
      category: 'social',
      difficulty: 'MEDIUM',
      template: mediumSocial
    },
    {
      id: 'hard-social',
      name: 'Situación Social Crítica',
      description: 'Encuentro social con altas consecuencias',
      icon: '👑',
      category: 'social',
      difficulty: 'HARD',
      template: hardSocial
    },
  
    // PUZZLE
    {
      id: 'easy-puzzle',
      name: 'Acertijo Sencillo',
      description: 'Puzzle básico con pistas obvias',
      icon: '🧩',
      category: 'puzzle',
      difficulty: 'EASY',
      template: easyPuzzle
    },
    {
      id: 'medium-puzzle',
      name: 'Enigma Desafiante',
      description: 'Puzzle que requiere pensamiento lógico',
      icon: '🔮',
      category: 'puzzle',
      difficulty: 'MEDIUM',
      template: mediumPuzzle
    },
    {
      id: 'hard-puzzle',
      name: 'Laberinto Mental',
      description: 'Puzzle complejo que desafía la lógica del grupo',
      icon: '🌀',
      category: 'puzzle',
      difficulty: 'HARD',
      template: hardPuzzle
    },
  
    // TRAMPA
    {
      id: 'easy-trap',
      name: 'Trampa Básica',
      description: 'Trampa mecánica simple y detectable',
      icon: '🕳️',
      category: 'trap',
      difficulty: 'EASY',
      template: easyTrap
    },
    {
      id: 'medium-trap',
      name: 'Trampa Peligrosa',
      description: 'Trampa con consecuencias moderadas',
      icon: '🏹',
      category: 'trap',
      difficulty: 'MEDIUM',
      template: mediumTrap
    },
    {
      id: 'deadly-trap',
      name: 'Trampa Letal',
      description: 'Trampa extremadamente peligrosa',
      icon: '💀',
      category: 'trap',
      difficulty: 'DEADLY',
      template: deadlyTrap
    },
  
    // EXPLORACIÓN
    {
      id: 'trivial-exploration',
      name: 'Exploración Atmosférica',
      description: 'Exploración para establecer ambiente',
      icon: '🌿',
      category: 'exploration',
      difficulty: 'TRIVIAL',
      template: trivialExploration
    },
    {
      id: 'easy-exploration',
      name: 'Búsqueda e Investigación',
      description: 'Exploración con hallazgos menores',
      icon: '📚',
      category: 'exploration',
      difficulty: 'EASY',
      template: easyExploration
    },
    {
      id: 'medium-exploration',
      name: 'Expedición Arriesgada',
      description: 'Exploración con peligros moderados',
      icon: '🗺️',
      category: 'exploration',
      difficulty: 'MEDIUM',
      template: mediumExploration
    },
    {
      id: 'hard-exploration',
      name: 'Exploración Extrema',
      description: 'Exploración en entornos muy hostiles',
      icon: '🌪️',
      category: 'exploration',
      difficulty: 'HARD',
      template: hardExploration
    },
  
    // ESPECIALES
    {
      id: 'investigation-mystery',
      name: 'Misterio de Investigación',
      description: 'Combina roleplay, deducción y búsqueda de pistas',
      icon: '🔍',
      category: 'special',
      difficulty: 'MEDIUM',
      template: investigationMystery
    },
    {
      id: 'environmental-combat',
      name: 'Combate Ambiental',
      description: 'Batalla con peligros del entorno',
      icon: '🌉',
      category: 'special',
      difficulty: 'HARD',
      template: environmentalCombat
    },
    {
      id: 'multiphase-encounter',
      name: 'Encuentro de Múltiples Fases',
      description: 'Encuentro complejo con varias etapas',
      icon: '🎭',
      category: 'special',
      difficulty: 'DEADLY',
      template: multiphaseEncounter
    },
    {
      id: 'chase-encounter',
      name: 'Secuencia de Persecución',
      description: 'Persecución dinámica con obstáculos',
      icon: '🏃',
      category: 'special',
      difficulty: 'MEDIUM',
      template: chaseEncounter
    },
    {
      id: 'complex-diplomacy',
      name: 'Diplomacia Multi-Facción',
      description: 'Negociación compleja entre múltiples partes',
      icon: '🏛️',
      category: 'special',
      difficulty: 'HARD',
      template: complexDiplomacy
    },
    {
      id: 'survival-encounter',
      name: 'Desafío de Supervivencia',
      description: 'Encuentro centrado en supervivencia y recursos',
      icon: '❄️',
      category: 'special',
      difficulty: 'HARD',
      template: survivalEncounter
    }
  ];
  
  // Función helper para obtener template por ID
  export const getEncounterTemplateById = (templateId) => {
    const templateData = encounterTemplates.find(t => t.id === templateId);
    return templateData ? { ...templateData.template } : null;
  };
  
  // Función helper para obtener templates por categoría
  export const getEncounterTemplatesByCategory = (category) => {
    return encounterTemplates.filter(t => t.category === category);
  };
  
  // Función helper para obtener templates por dificultad
  export const getEncounterTemplatesByDifficulty = (difficulty) => {
    return encounterTemplates.filter(t => t.difficulty === difficulty);
  };
  
  // Función helper para obtener templates por tipo
  export const getEncounterTemplatesByType = (encounterType) => {
    return encounterTemplates.filter(t => t.template.encounterType === encounterType);
  };
  
  // Función para aplicar template manteniendo ciertos valores del formulario actual
  export const applyEncounterTemplate = (template, currentData = {}) => {
    return {
      ...template,
      // Mantener algunos valores específicos que no queremos sobrescribir
      encounterId: currentData.encounterId || null,
      sessionId: currentData.sessionId || null,
      // Permitir override del nombre si el usuario ya escribió algo
      name: currentData.name && currentData.name.trim() !== '' ? currentData.name : template.name,
      // El resto viene del template
      ...template
    };
  };
  
  // Categorías disponibles para filtros
  export const encounterTemplateCategories = [
    { id: 'all', name: 'Todos', icon: '⭐' },
    { id: 'combat', name: 'Combate', icon: '⚔️' },
    { id: 'social', name: 'Social', icon: '💬' },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
    { id: 'trap', name: 'Trampa', icon: '🕳️' },
    { id: 'exploration', name: 'Exploración', icon: '🗺️' },
    { id: 'special', name: 'Especiales', icon: '🎭' }
  ];
  
  // Niveles de dificultad para filtros
  export const encounterDifficultyLevels = [
    { id: 'all', name: 'Todas', icon: '🎯' },
    { id: 'TRIVIAL', name: 'Trivial', icon: '🟢' },
    { id: 'EASY', name: 'Fácil', icon: '🔵' },
    { id: 'MEDIUM', name: 'Medio', icon: '🟡' },
    { id: 'HARD', name: 'Difícil', icon: '🟠' },
    { id: 'DEADLY', name: 'Mortal', icon: '🔴' }
  ];