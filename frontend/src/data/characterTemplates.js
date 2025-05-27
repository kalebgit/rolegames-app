// characterTemplates.js

// GUERRERO HUMANO TANK
const tankFighter = {
    name: "Tharok Escudo de Hierro",
    race: "HUMAN",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 48,
    maxHitPoints: 48,
    armorClass: 18,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "LAWFUL_GOOD",
    background: "Soldado",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 17,
      DEXTERITY: 12,
      CONSTITUTION: 16,
      INTELLIGENCE: 10,
      WISDOM: 11,
      CHARISMA: 9
    }
   };
   
   // MAGO ÉLFICO DE CONTROL
   const elvenWizard = {
    name: "Aerendyl la Bruma",
    race: "ELF",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 26,
    maxHitPoints: 26,
    armorClass: 13,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "NEUTRAL_GOOD",
    background: "Sabio",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 8,
      DEXTERITY: 14,
      CONSTITUTION: 12,
      INTELLIGENCE: 18,
      WISDOM: 13,
      CHARISMA: 10
    }
   };
   
   // PÍCARO MEDIANO SIGILOSO
   const halflingRogue = {
    name: "Lira Sombrasuave",
    race: "HALFLING",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 34,
    maxHitPoints: 34,
    armorClass: 15,
    proficiencyBonus: 3,
    speed: 25,
    alignment: "CHAOTIC_NEUTRAL",
    background: "Criminal",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 9,
      DEXTERITY: 18,
      CONSTITUTION: 14,
      INTELLIGENCE: 13,
      WISDOM: 11,
      CHARISMA: 12
    }
   };
   
   // CLÉRIGO ENANO DE CURACIÓN
   const dwarfCleric = {
    name: "Brog Martilloluz",
    race: "DWARF",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 40,
    maxHitPoints: 40,
    armorClass: 17,
    proficiencyBonus: 3,
    speed: 25,
    alignment: "LAWFUL_GOOD",
    background: "Acólito",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 12,
      DEXTERITY: 10,
      CONSTITUTION: 16,
      INTELLIGENCE: 10,
      WISDOM: 17,
      CHARISMA: 11
    }
   };
   
   // BÁRBARO MEDIO ORCO DE DAÑO
   const halfOrcBarbarian = {
    name: "Gorath Rompecráneos",
    race: "HALF_ORC",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 58,
    maxHitPoints: 58,
    armorClass: 15,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "CHAOTIC_GOOD",
    background: "Forastero",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 18,
      DEXTERITY: 14,
      CONSTITUTION: 16,
      INTELLIGENCE: 8,
      WISDOM: 10,
      CHARISMA: 10
    }
   };
   
   // RANGER ÉLFICO ARQUERO
   const elvenRanger = {
    name: "Silvana Ventoverde",
    race: "ELF",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 42,
    maxHitPoints: 42,
    armorClass: 16,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "NEUTRAL_GOOD",
    background: "Explorador",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 12,
      DEXTERITY: 17,
      CONSTITUTION: 14,
      INTELLIGENCE: 12,
      WISDOM: 16,
      CHARISMA: 10
    }
   };
   
   // PALADÍN DRAGONBORN HÍBRIDO
   const dragonbornPaladin = {
    name: "Bahamut Llamadorada",
    race: "DRAGONBORN",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 44,
    maxHitPoints: 44,
    armorClass: 19,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "LAWFUL_GOOD",
    background: "Noble",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 16,
      DEXTERITY: 10,
      CONSTITUTION: 15,
      INTELLIGENCE: 11,
      WISDOM: 12,
      CHARISMA: 17
    }
   };
   
   // HECHICERO TIEFLING CAÓTICO
   const tieflingSorcerer = {
    name: "Zara Llamaoscura",
    race: "TIEFLING",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 30,
    maxHitPoints: 30,
    armorClass: 14,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "CHAOTIC_NEUTRAL",
    background: "Forastero",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 9,
      DEXTERITY: 15,
      CONSTITUTION: 13,
      INTELLIGENCE: 12,
      WISDOM: 10,
      CHARISMA: 18
    }
   };
   
   // MONJE HUMANO EQUILIBRADO
   const humanMonk = {
    name: "Kael Puñocalmado",
    race: "HUMAN",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 38,
    maxHitPoints: 38,
    armorClass: 16,
    proficiencyBonus: 3,
    speed: 40,
    alignment: "LAWFUL_NEUTRAL",
    background: "Ermitaño",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 13,
      DEXTERITY: 17,
      CONSTITUTION: 14,
      INTELLIGENCE: 11,
      WISDOM: 16,
      CHARISMA: 10
    }
   };
   
   // DRUIDA ÉLFICO DE LA NATURALEZA
   const elvenDruid = {
    name: "Thalorin Ramaantiqua",
    race: "ELF",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 36,
    maxHitPoints: 36,
    armorClass: 13,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "NEUTRAL",
    background: "Ermitaño",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 10,
      DEXTERITY: 14,
      CONSTITUTION: 14,
      INTELLIGENCE: 12,
      WISDOM: 17,
      CHARISMA: 11
    }
   };
   
   // BARDO MEDIANO SOCIAL
   const halflingBard = {
    name: "Pip Cantaalegre",
    race: "HALFLING",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 32,
    maxHitPoints: 32,
    armorClass: 14,
    proficiencyBonus: 3,
    speed: 25,
    alignment: "CHAOTIC_GOOD",
    background: "Artista",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 9,
      DEXTERITY: 15,
      CONSTITUTION: 13,
      INTELLIGENCE: 13,
      WISDOM: 11,
      CHARISMA: 17
    }
   };
   
   // WARLOCK HUMANO MISTERIOSO
   const humanWarlock = {
    name: "Morgrim Pactosombra",
    race: "HUMAN",
    level: 5,
    experiencePoints: 6500,
    hitPoints: 34,
    maxHitPoints: 34,
    armorClass: 13,
    proficiencyBonus: 3,
    speed: 30,
    alignment: "CHAOTIC_NEUTRAL",
    background: "Ermitaño",
    currentState: 1,
    version: 1,
    abilities: {
      STRENGTH: 10,
      DEXTERITY: 14,
      CONSTITUTION: 15,
      INTELLIGENCE: 12,
      WISDOM: 11,
      CHARISMA: 17
    }
   };
   
   // Array principal con todos los templates
   export const characterTemplates = [
    {
      id: 'tank-fighter',
      name: 'Guerrero Tank',
      description: 'Tanque resistente con alta AC y HP, perfecto para la primera línea',
      icon: '🛡️',
      category: 'tank',
      suggestedClass: 'FIGHTER',
      template: tankFighter
    },
    {
      id: 'elven-wizard',
      name: 'Mago Controlador',
      description: 'Hechicero élfico especializado en control y magia arcana',
      icon: '🔮',
      category: 'caster',
      suggestedClass: 'WIZARD',
      template: elvenWizard
    },
    {
      id: 'halfling-rogue',
      name: 'Pícaro Sigiloso',
      description: 'Especialista en sigilo, trampas y ataques precisos',
      icon: '🗡️',
      category: 'stealth',
      suggestedClass: 'ROGUE',
      template: halflingRogue
    },
    {
      id: 'dwarf-cleric',
      name: 'Clérigo Sanador',
      description: 'Sanador devoto con capacidades de apoyo y curación',
      icon: '⚕️',
      category: 'support',
      suggestedClass: 'CLERIC',
      template: dwarfCleric
    },
    {
      id: 'halforc-barbarian',
      name: 'Bárbaro Devastador',
      description: 'Guerrero salvaje con increíble poder de ataque cuerpo a cuerpo',
      icon: '⚡',
      category: 'damage',
      suggestedClass: 'BARBARIAN',
      template: halfOrcBarbarian
    },
    {
      id: 'elven-ranger',
      name: 'Ranger Arquero',
      description: 'Explorador élfico experto en combate a distancia y supervivencia',
      icon: '🏹',
      category: 'ranged',
      suggestedClass: 'RANGER',
      template: elvenRanger
    },
    {
      id: 'dragonborn-paladin',
      name: 'Paladín Sagrado',
      description: 'Guerrero santo con poderes divinos y gran carisma',
      icon: '⚔️',
      category: 'hybrid',
      suggestedClass: 'PALADIN',
      template: dragonbornPaladin
    },
    {
      id: 'tiefling-sorcerer',
      name: 'Hechicero Caótico',
      description: 'Mago innato con poderosa magia espontánea y herencia infernal',
      icon: '🔥',
      category: 'caster',
      suggestedClass: 'SORCERER',
      template: tieflingSorcerer
    },
    {
      id: 'human-monk',
      name: 'Monje Equilibrado',
      description: 'Artista marcial disciplinado con extraordinaria movilidad',
      icon: '👊',
      category: 'mobility',
      suggestedClass: 'MONK',
      template: humanMonk
    },
    {
      id: 'elven-druid',
      name: 'Druida Natural',
      description: 'Guardián de la naturaleza con poder de transformación',
      icon: '🌿',
      category: 'support',
      suggestedClass: 'DRUID',
      template: elvenDruid
    },
    {
      id: 'halfling-bard',
      name: 'Bardo Social',
      description: 'Artista carismático con habilidades de apoyo y versatilidad',
      icon: '🎵',
      category: 'support',
      suggestedClass: 'BARD',
      template: halflingBard
    },
    {
      id: 'human-warlock',
      name: 'Warlock Misterioso',
      description: 'Pactado con entidades sobrenaturales, poder mágico limitado pero potente',
      icon: '👁️',
      category: 'caster',
      suggestedClass: 'WARLOCK',
      template: humanWarlock
    }
   ];
   
   // Función helper para obtener template por ID
   export const getTemplateById = (templateId) => {
    const templateData = characterTemplates.find(t => t.id === templateId);
    return templateData ? { ...templateData.template } : null;
   };
   
   // Función helper para obtener templates por categoría
   export const getTemplatesByCategory = (category) => {
    return characterTemplates.filter(t => t.category === category);
   };
   
   // Función para aplicar template manteniendo ciertos valores del formulario actual
   export const applyCharacterTemplate = (template, currentData = {}) => {
    return {
      ...template,
      // Mantener algunos valores específicos si existen
      characterId: currentData.characterId || null,
      playerId: currentData.playerId || null,
      campaignId: currentData.campaignId || null,
      // Permitir override del nombre si el usuario ya escribió algo
      name: currentData.name && currentData.name.trim() !== '' ? currentData.name : template.name,
      // El resto viene del template
      ...template
    };
   };
   
   // Categorías disponibles
   export const templateCategories = [
    { id: 'all', name: 'Todos', icon: '⭐' },
    { id: 'tank', name: 'Tanque', icon: '🛡️' },
    { id: 'damage', name: 'Daño', icon: '⚡' },
    { id: 'caster', name: 'Hechicero', icon: '🔮' },
    { id: 'support', name: 'Apoyo', icon: '⚕️' },
    { id: 'stealth', name: 'Sigilo', icon: '🗡️' },
    { id: 'ranged', name: 'A Distancia', icon: '🏹' },
    { id: 'hybrid', name: 'Híbrido', icon: '⚔️' },
    { id: 'mobility', name: 'Movilidad', icon: '👊' }
   ];