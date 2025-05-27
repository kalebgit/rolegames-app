package kal.com.rolegames.repositories.sessions;

import kal.com.rolegames.models.sessions.Encounter;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.users.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EncounterRepository extends JpaRepository<Encounter, Long> {
    List<Encounter> findBySessionSessionId(Long sessionId);
    List<Encounter> findByIsCompleted(Boolean isCompleted);

    /**
     * Encuentra todos los encounters organizados por un Dungeon Master específico.
     * Navega a través de Session -> Campaign -> DungeonMaster
     */
    @Query("SELECT e FROM Encounter e " +
            "WHERE e.session.campaign.dungeonMaster = :dungeonMaster")
    List<Encounter> findByDungeonMaster(@Param("dungeonMaster") DungeonMaster dungeonMaster);

    /**
     * Encuentra todos los encounters organizados por un Dungeon Master específico usando su ID.
     */
    @Query("SELECT e FROM Encounter e " +
            "WHERE e.session.campaign.dungeonMaster.dungeonMasterId = :dmId")
    List<Encounter> findByDungeonMasterId(@Param("dmId") Long dmId);

    /**
     * Encuentra todos los encounters donde alguno de los personajes del Player participa.
     * Busca en los participants del encounter cualquier PlayerCharacter que pertenezca al Player.
     */
    @Query("SELECT DISTINCT e FROM Encounter e " +
            "JOIN e.participants p " +
            "WHERE TYPE(p) = PlayerCharacter AND p.player = :player")
    List<Encounter> findByPlayerParticipation(@Param("player") Player player);

    /**
     * Encuentra todos los encounters donde alguno de los personajes del Player participa usando su ID.
     */
    @Query("SELECT DISTINCT e FROM Encounter e " +
            "JOIN e.participants p " +
            "WHERE TYPE(p) = PlayerCharacter AND p.player.playerId = :playerId")
    List<Encounter> findByPlayerParticipationId(@Param("playerId") Long playerId);

    /**
     * Encuentra todos los encounters donde alguno de los personajes del Player participa usando el User ID.
     */
    @Query("SELECT DISTINCT e FROM Encounter e " +
            "JOIN e.participants p " +
            "WHERE TYPE(p) = PlayerCharacter AND p.player.user.userId = :userId")
    List<Encounter> findByPlayerParticipationUserId(@Param("userId") Long userId);

    /**
     * Método alternativo para buscar por Player usando JOIN más específico
     */
    @Query("SELECT DISTINCT e FROM Encounter e " +
            "JOIN e.participants pc " +
            "JOIN PlayerCharacter pchar ON pc = pchar " +
            "WHERE pchar.player = :player")
    List<Encounter> findEncountersByPlayer(@Param("player") Player player);

    /**
     * Busca encounters por Player ID con una consulta más directa
     */
    @Query("SELECT DISTINCT e FROM Encounter e " +
            "WHERE EXISTS (SELECT 1 FROM PlayerCharacter pc " +
            "WHERE pc MEMBER OF e.participants AND pc.player.playerId = :playerId)")
    List<Encounter> findEncountersByPlayerId(@Param("playerId") Long playerId);
}