package kal.com.rolegames.models.items;

import jakarta.persistence.*;
import kal.com.rolegames.models.util.RewardType;
import lombok.*;

@Entity
@Table(name = "rewards")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reward_id")
    @EqualsAndHashCode.Include
    private Long rewardId;

    @Basic(optional = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private RewardType rewardType;

    private Integer experienceAmount;

    private Integer goldAmount;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item itemReward;

    @Basic(optional = false)
    private Boolean claimed;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public boolean isExperienceReward() {
        return rewardType == RewardType.EXPERIENCE;
    }

    public boolean isGoldReward() {
        return rewardType == RewardType.GOLD;
    }

    public boolean isItemReward() {
        return rewardType == RewardType.ITEM;
    }

    public void claim() {
        this.claimed = true;
    }

    public String getRewardDescription() {
        StringBuilder sb = new StringBuilder();

        sb.append(name).append(": ");

        switch (rewardType) {
            case EXPERIENCE:
                sb.append(experienceAmount).append(" XP");
                break;
            case GOLD:
                sb.append(goldAmount).append(" gold");
                break;
            case ITEM:
                if (itemReward != null) {
                    sb.append(itemReward.getName());
                    if (itemReward.getRarity() != null) {
                        sb.append(" (").append(itemReward.getRarity()).append(")");
                    }
                } else {
                    sb.append("Unknown item");
                }
                break;
            default:
                sb.append("Special reward");
        }

        if (claimed) {
            sb.append(" [Claimed]");
        } else {
            sb.append(" [Unclaimed]");
        }

        return sb.toString();
    }
}