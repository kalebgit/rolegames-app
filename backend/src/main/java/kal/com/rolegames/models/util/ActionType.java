package kal.com.rolegames.models.util;

/**
 * Tipos de acciones que un personaje puede realizar durante el combate.
 * Basado en las acciones de D&D 5e.
 */
public enum ActionType {
    /**
     * Ataque con arma o desarmado
     * Requiere: target (obligatorio), item (opcional - arma)
     * Consume: Acción principal
     */
    ATTACK,

    /**
     * Lanzar un hechizo
     * Requiere: spell (obligatorio), target (opcional)
     * Consume: Acción principal
     */
    CAST_SPELL,

    /**
     * Correr - duplica la velocidad de movimiento
     * Requiere: ninguno
     * Consume: Acción principal
     */
    DASH,

    /**
     * Desengancharse - no provoca ataques de oportunidad (NO IMPLEMENTADO)
     * Requiere: ninguno
     * Consume: Acción principal
     */
    DISENGAGE,

    /**
     * Esquivar - otorga ventaja en tiradas de salvación (NO IMPLEMENTADO)
     * Requiere: ninguno
     * Consume: Acción principal
     */
    DODGE,

    /**
     * Ayudar a otro personaje
     * Requiere: target (obligatorio)
     * Consume: Acción principal
     */
    HELP,

    /**
     * Esconderse
     * Requiere: diceResult (éxito/fallo del stealth check)
     * Consume: Acción principal
     */
    HIDE,

    /**
     * Preparar una acción para un trigger específico
     * Requiere: ninguno
     * Consume: Acción principal
     */
    READY,

    /**
     * Buscar objetos o enemigos ocultos
     * Requiere: diceResult (éxito/fallo del perception check)
     * Consume: Acción principal
     */
    SEARCH,

    /**
     * Usar un objeto del inventario
     * Requiere: item (obligatorio), target (opcional)
     * Consume: Acción principal
     */
    USE_ITEM,

    /**
     * Acción adicional (bonus action)
     * Requiere: item o spell (opcional)
     * Consume: Acción adicional
     */
    BONUS_ACTION,

    /**
     * Reacción a una acción de otro personaje
     * Requiere: target (opcional)
     * Consume: Reacción
     */
    REACTION
}