package kal.com.rolegames.repositories.combat;

import kal.com.rolegames.models.combat.ActionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActionResultRepository extends JpaRepository<ActionResult, Long> {

    List<ActionResult> findBySuccess(Boolean success);

    List<ActionResult> findByDamageDealtGreaterThan(Integer minDamage);

    @Query("SELECT ar FROM ActionResult ar WHERE ar.action.combat.combatStateId = :combatId")
    List<ActionResult> findByCombatId(@Param("combatId") Long combatId);

    @Query("SELECT ar FROM ActionResult ar WHERE ar.action.character.characterId = :characterId")
    List<ActionResult> findByCharacterId(@Param("characterId") Long characterId);

    @Query("SELECT AVG(ar.damageDealt) FROM ActionResult ar WHERE ar.success = true AND ar.damageDealt > 0")
    Double getAverageDamageDealt();

    @Query("SELECT SUM(ar.damageDealt) FROM ActionResult ar WHERE ar.action.combat.combatStateId = :combatId AND ar.success = true")
    Long getTotalDamageInCombat(@Param("combatId") Long combatId);
}