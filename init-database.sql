-- NOTAS DEL DESARROLLADOR
-- Hibernate se encargará de agregar constraints cuando sea necesario
-- Script actualizado con sistema de roles y tablas faltantes

CREATE DATABASE IF NOT EXISTS rolegames;
USE rolegames;

-- Tabla de usuarios base
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (user_id)
);

-- Tabla de roles de usuario (sistema flexible de roles múltiples)
CREATE TABLE IF NOT EXISTS user_roles (
    role_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (role_id),
    INDEX idx_user_roles_user_id (user_id),
    INDEX idx_user_roles_type_active (role_type, is_active)
);

-- Tabla de jugadores (herencia)
CREATE TABLE IF NOT EXISTS players (
    player_id BIGINT NOT NULL,
    experience INT NOT NULL DEFAULT 0,
    PRIMARY KEY (player_id)
);

-- Tabla de dungeon masters (herencia)
CREATE TABLE IF NOT EXISTS dungeon_masters (
    dm_id BIGINT NOT NULL,
    dm_style VARCHAR(255),
    rating FLOAT,
    PRIMARY KEY (dm_id)
);

-- Tabla de personajes base
CREATE TABLE IF NOT EXISTS characters (
    character_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    race VARCHAR(50) NOT NULL,
    level INT NOT NULL,
    experience_points INT NOT NULL,
    hit_points INT NOT NULL,
    max_hit_points INT NOT NULL,
    armor_class INT NOT NULL,
    proficiency_bonus INT NOT NULL,
    speed INT NOT NULL,
    alignment VARCHAR(50) NOT NULL,
    background VARCHAR(255),
    current_state_id BIGINT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (character_id)
);

-- Tabla de habilidades de personajes (ElementCollection)
CREATE TABLE IF NOT EXISTS character_abilities (
    character_id BIGINT NOT NULL,
    ability_type VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    PRIMARY KEY (character_id, ability_type)
);

-- Tabla de personajes jugadores (herencia)
CREATE TABLE IF NOT EXISTS player_characters (
    player_character_id BIGINT NOT NULL,
    player_id BIGINT,
    character_class VARCHAR(50) NOT NULL,
    subclass VARCHAR(255),
    backstory TEXT,
    campaign_id BIGINT,
    death_save_id BIGINT,
    PRIMARY KEY (player_character_id)
);

-- Tabla de NPCs (herencia)
CREATE TABLE IF NOT EXISTS non_player_characters (
    npc_id BIGINT NOT NULL,
    creator_id BIGINT,
    npc_type VARCHAR(50) NOT NULL,
    challenge_rating FLOAT,
    behavior_id BIGINT,
    motivation TEXT,
    is_hostile BOOLEAN,
    PRIMARY KEY (npc_id)
);

-- Tabla de hechizos
CREATE TABLE IF NOT EXISTS spells (
    spell_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL,
    school VARCHAR(50) NOT NULL,
    casting_time VARCHAR(255) NOT NULL,
    spell_range VARCHAR(255) NOT NULL,  
    duration VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    higher_level_effects TEXT,
    damage_type VARCHAR(50),
    damage_dice VARCHAR(50),
    saving_throw VARCHAR(50),
    ritual BOOLEAN NOT NULL DEFAULT FALSE,
    concentration BOOLEAN NOT NULL DEFAULT FALSE,
    material_components TEXT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (spell_id)
);

-- Tabla de componentes de hechizos (ElementCollection)
CREATE TABLE IF NOT EXISTS spell_components (
    spell_id BIGINT NOT NULL,
    component VARCHAR(50) NOT NULL,
    PRIMARY KEY (spell_id, component)
);

-- Tabla de campañas
CREATE TABLE IF NOT EXISTS campaigns (
    campaign_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dm_id BIGINT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    global_notes TEXT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (campaign_id)
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS sessions (
    session_id BIGINT NOT NULL AUTO_INCREMENT,
    campaign_id BIGINT NOT NULL,
    session_number INT NOT NULL,
    date TIMESTAMP NOT NULL,
    duration INT,
    summary TEXT,
    dm_notes TEXT,
    next_session_objectives TEXT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (session_id)
);

-- Tabla de encuentros
CREATE TABLE IF NOT EXISTS encounters (
    encounter_id BIGINT NOT NULL AUTO_INCREMENT,
    session_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    encounter_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    combat_state_id BIGINT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (encounter_id)
);

-- Tabla de estados de combate
CREATE TABLE IF NOT EXISTS combat_states (
    combat_state_id BIGINT NOT NULL AUTO_INCREMENT,
    current_round INT NOT NULL,
    is_active BOOLEAN NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (combat_state_id)
);

-- Tabla de iniciativa
CREATE TABLE IF NOT EXISTS initiatives (
    initiative_id BIGINT NOT NULL AUTO_INCREMENT,
    combat_state_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    initiative_roll INT NOT NULL,
    current_turn BOOLEAN NOT NULL DEFAULT FALSE,
    has_acted BOOLEAN NOT NULL DEFAULT FALSE,
    bonus_actions_used INT NOT NULL DEFAULT 0,
    reactions_used INT NOT NULL DEFAULT 0,
    movement_used INT NOT NULL DEFAULT 0,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (initiative_id)
);

-- Tabla de items base
CREATE TABLE IF NOT EXISTS items (
    item_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    weight FLOAT,
    value INT,
    rarity VARCHAR(50),
    requires_attunement BOOLEAN DEFAULT FALSE,
    is_attuned BOOLEAN DEFAULT FALSE,
    owner_id BIGINT,
    creator_id BIGINT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (item_id)
);

-- Tabla de tags de items (ElementCollection)
CREATE TABLE IF NOT EXISTS item_tags (
    item_id BIGINT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    PRIMARY KEY (item_id, tag)
);

-- Tabla de armas (herencia)
CREATE TABLE IF NOT EXISTS weapons (
    weapon_id BIGINT NOT NULL,
    weapon_type VARCHAR(50) NOT NULL,
    damage_type VARCHAR(50) NOT NULL,
    damage_dice VARCHAR(50) NOT NULL,
    damage_bonus INT,
    normal INT,  -- Para Range embeddable
    maximum INT, -- Para Range embeddable
    is_magical BOOLEAN DEFAULT FALSE,
    attack_bonus INT,
    PRIMARY KEY (weapon_id)
);

-- Tabla de propiedades de armas (ElementCollection)
CREATE TABLE IF NOT EXISTS weapon_properties (
    weapon_id BIGINT NOT NULL,
    property VARCHAR(50) NOT NULL,
    PRIMARY KEY (weapon_id, property)
);

-- Tabla de armaduras (herencia)
CREATE TABLE IF NOT EXISTS armors (
    armor_id BIGINT NOT NULL,
    armor_type VARCHAR(50) NOT NULL,
    base_armor_class INT NOT NULL,
    strength_requirement INT,
    stealth_disadvantage BOOLEAN DEFAULT FALSE,
    magical_bonus INT,
    PRIMARY KEY (armor_id)
);

-- Tabla de estados de personajes
CREATE TABLE IF NOT EXISTS character_states (
    state_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    state_type VARCHAR(50) NOT NULL,
    description TEXT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (state_id)
);

-- Tabla de death saves
CREATE TABLE IF NOT EXISTS death_save_trackers (
    death_save_id BIGINT NOT NULL AUTO_INCREMENT,
    successes INT NOT NULL DEFAULT 0,
    failures INT NOT NULL DEFAULT 0,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (death_save_id)
);

-- Tabla de comportamientos de NPCs
CREATE TABLE IF NOT EXISTS npc_behaviors (
    behavior_id BIGINT NOT NULL AUTO_INCREMENT,
    personality_description TEXT,
    aggressiveness INT,
    friendliness INT,
    honesty INT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (behavior_id)
);

-- Tabla de traits de comportamiento de NPCs (ElementCollection)
CREATE TABLE IF NOT EXISTS npc_behavior_traits (
    behavior_id BIGINT NOT NULL,
    trait VARCHAR(50) NOT NULL,
    PRIMARY KEY (behavior_id, trait)
);

-- Tabla de traits/rasgos
CREATE TABLE IF NOT EXISTS traits (
    trait_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (trait_id)
);

-- Tabla de habilidades/skills
CREATE TABLE IF NOT EXISTS skills (
    skill_id BIGINT NOT NULL AUTO_INCREMENT,
    character_id BIGINT NOT NULL,
    skill_type VARCHAR(50) NOT NULL,
    proficiency_level VARCHAR(50) NOT NULL,
    bonus_modifier INT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (skill_id)
);

-- Tabla de saving throws
CREATE TABLE IF NOT EXISTS saving_throws (
    saving_throw_id BIGINT NOT NULL AUTO_INCREMENT,
    character_id BIGINT NOT NULL,
    ability_type VARCHAR(50) NOT NULL,
    is_proficient BOOLEAN NOT NULL,
    advantage BOOLEAN,
    disadvantage BOOLEAN,
    bonus_modifier INT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (saving_throw_id)
);

-- Tabla de efectos
CREATE TABLE IF NOT EXISTS effects (
    effect_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    effect_type VARCHAR(50) NOT NULL,
    description TEXT,
    source_id BIGINT,
    target_id BIGINT,
    spell_id BIGINT,
    duration INT NOT NULL,
    is_active BOOLEAN NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    combat_state_id BIGINT, -- Para efectos activos en combate
    state_id BIGINT,        -- Para efectos de estado
    version BIGINT DEFAULT 0,
    PRIMARY KEY (effect_id)
);

-- Tabla de efectos de items
CREATE TABLE IF NOT EXISTS item_effects (
    item_effect_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    effect_type VARCHAR(50) NOT NULL,
    description TEXT,
    affected_ability VARCHAR(50),
    bonus_value INT,
    damage_dice VARCHAR(50),
    charges_per_day INT,
    current_charges INT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (item_effect_id)
);

-- Tabla de recompensas
CREATE TABLE IF NOT EXISTS rewards (
    reward_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    experience_amount INT,
    gold_amount INT,
    item_id BIGINT,
    claimed BOOLEAN NOT NULL DEFAULT FALSE,
    encounter_id BIGINT, -- Para recompensas de encuentros
    version BIGINT DEFAULT 0,
    PRIMARY KEY (reward_id)
);

-- Tabla de acciones de combate
CREATE TABLE IF NOT EXISTS combat_actions (
    action_id BIGINT NOT NULL AUTO_INCREMENT,
    combat_state_id BIGINT,
    character_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_id BIGINT,
    item_id BIGINT,
    spell_id BIGINT,
    result_id BIGINT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (action_id)
);

-- Tabla de resultados de acciones
CREATE TABLE IF NOT EXISTS action_results (
    result_id BIGINT NOT NULL AUTO_INCREMENT,
    success BOOLEAN NOT NULL,
    damage_dealt INT,
    description TEXT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (result_id)
);

-- Tabla de spell slots
CREATE TABLE IF NOT EXISTS spell_slots (
    spell_slot_id BIGINT NOT NULL AUTO_INCREMENT,
    character_id BIGINT NOT NULL,
    level INT NOT NULL,
    total_slots INT NOT NULL,
    used_slots INT NOT NULL,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (spell_slot_id)
);

-- Tabla de features
CREATE TABLE IF NOT EXISTS features (
    feature_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    feature_type VARCHAR(50) NOT NULL,
    description TEXT,
    level_required INT NOT NULL,
    uses_per_day INT,
    current_uses INT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (feature_id)
);

-- Tabla de asociaciones entre NPCs
CREATE TABLE IF NOT EXISTS npc_associations (
    association_id BIGINT NOT NULL AUTO_INCREMENT,
    other_npc_id BIGINT NOT NULL,
    relationship VARCHAR(255) NOT NULL,
    relationship_strength INT,
    version BIGINT DEFAULT 0,
    PRIMARY KEY (association_id)
);

-- TABLAS DE RELACIONES MANY-TO-MANY

-- Relación campaigns - players
CREATE TABLE IF NOT EXISTS campaign_players (
    campaign_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    PRIMARY KEY (campaign_id, player_id)
);

-- Relación campaigns - important NPCs
CREATE TABLE IF NOT EXISTS campaign_important_npcs (
    campaign_id BIGINT NOT NULL,
    npc_id BIGINT NOT NULL,
    PRIMARY KEY (campaign_id, npc_id)
);

-- Relación sessions - attending players
CREATE TABLE IF NOT EXISTS session_players (
    session_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    PRIMARY KEY (session_id, player_id)
);

-- Relación sessions - attending characters
CREATE TABLE IF NOT EXISTS session_characters (
    session_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    PRIMARY KEY (session_id, character_id)
);

-- Relación encounters - participants
CREATE TABLE IF NOT EXISTS encounter_participants (
    encounter_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    PRIMARY KEY (encounter_id, character_id)
);

-- Relación characters - traits
CREATE TABLE IF NOT EXISTS character_traits (
    character_id BIGINT NOT NULL,
    trait_id BIGINT NOT NULL,
    PRIMARY KEY (character_id, trait_id)
);

-- Relación characters - spells (para player characters)
CREATE TABLE IF NOT EXISTS character_spells (
    character_id BIGINT NOT NULL,
    spell_id BIGINT NOT NULL,
    PRIMARY KEY (character_id, spell_id)
);

-- Relación characters - features (para player characters)
CREATE TABLE IF NOT EXISTS character_features (
    character_id BIGINT NOT NULL,
    feature_id BIGINT NOT NULL,
    PRIMARY KEY (character_id, feature_id)
);

-- Tabla para items equipados en player characters (MapKey por slot)
CREATE TABLE IF NOT EXISTS character_equipped_items (
    character_id BIGINT NOT NULL,
    equip_slot VARCHAR(50) NOT NULL,
    item_id BIGINT NOT NULL,
    PRIMARY KEY (character_id, equip_slot)
);

-- ÍNDICES ADICIONALES PARA PERFORMANCE

-- Índices para búsquedas frecuentes
CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_characters_race ON characters(race);
CREATE INDEX idx_characters_level ON characters(level);
CREATE INDEX idx_spells_level ON spells(level);
CREATE INDEX idx_spells_school ON spells(school);
CREATE INDEX idx_items_rarity ON items(rarity);
CREATE INDEX idx_items_owner ON items(owner_id);
CREATE INDEX idx_items_creator ON items(creator_id);
CREATE INDEX idx_campaigns_dm ON campaigns(dm_id);
CREATE INDEX idx_campaigns_active ON campaigns(is_active);
CREATE INDEX idx_npcs_type ON non_player_characters(npc_type);
CREATE INDEX idx_npcs_creator ON non_player_characters(creator_id);

-- Insertar datos iniciales básicos
INSERT IGNORE INTO character_states (name, state_type, description) VALUES 
('Normal', 'NORMAL', 'Character is in normal state'),
('Dead', 'DEAD', 'Character has died'),
('Unconscious', 'UNCONSCIOUS', 'Character is unconscious'),
('Paralyzed', 'PARALYZED', 'Character is paralyzed'),
('Poisoned', 'POISONED', 'Character is poisoned'),
('Frightened', 'FRIGHTENED', 'Character is frightened'),
('Charmed', 'CHARMED', 'Character is charmed'),
('Stunned', 'STUNNED', 'Character is stunned'),
('Inspired', 'INSPIRED', 'Character is inspired');

-- Commit de transacción
COMMIT;
