package kal.com.rolegames.repositories.items;

import kal.com.rolegames.models.items.Reward;
import kal.com.rolegames.models.util.RewardType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {

    List<Reward> findByRewardType(RewardType rewardType);

    List<Reward> findByClaimed(Boolean claimed);

    List<Reward> findByExperienceAmountBetween(Integer minExp, Integer maxExp);

    List<Reward> findByGoldAmountBetween(Integer minGold, Integer maxGold);

    @Query("SELECT r FROM Reward r WHERE r.itemReward IS NOT NULL")
    List<Reward> findRewardsWithItems();

    @Query("SELECT SUM(r.experienceAmount) FROM Reward r JOIN Encounter e ON r MEMBER OF e.rewards WHERE e.encounterId = :encounterId AND r.claimed = false AND r.rewardType = 'EXPERIENCE'")
    Integer getTotalUnclaimedExperienceByEncounter(@Param("encounterId") Long encounterId);

    @Query("SELECT SUM(r.goldAmount) FROM Reward r JOIN Encounter e ON r MEMBER OF e.rewards WHERE e.encounterId = :encounterId AND r.claimed = false AND r.rewardType = 'GOLD'")
    Integer getTotalUnclaimedGoldByEncounter(@Param("encounterId") Long encounterId);
}