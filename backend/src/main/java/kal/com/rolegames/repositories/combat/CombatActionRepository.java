package kal.com.rolegames.repositories.combat;

import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.combat.CombatAction;
import kal.com.rolegames.models.combat.CombatState;
import kal.com.rolegames.models.util.ActionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CombatActionRepository extends JpaRepository<CombatAction, Long> {

    List<CombatAction> findByCombat(CombatState combat);

    List<CombatAction> findByCharacter(GameCharacter character);

    List<CombatAction> findByActionType(ActionType actionType);

    List<CombatAction> findByCombatOrderByTimestampAsc(CombatState combat);

    @Query("SELECT ca FROM CombatAction ca WHERE ca.combat.combatStateId = :combatId ORDER BY ca.timestamp DESC")
    List<CombatAction> findByCombatIdOrderByTimestampDesc(@Param("combatId") Long combatId);

    @Query("SELECT ca FROM CombatAction ca WHERE ca.character.characterId = :characterId AND ca.timestamp BETWEEN :startTime AND :endTime")
    List<CombatAction> findByCharacterAndTimePeriod(
            @Param("characterId") Long characterId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT COUNT(ca) FROM CombatAction ca WHERE ca.combat = :combat AND ca.actionType = :actionType")
    Long countByActionTypeInCombat(@Param("combat") CombatState combat, @Param("actionType") ActionType actionType);
}