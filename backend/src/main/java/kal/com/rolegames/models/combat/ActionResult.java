package kal.com.rolegames.models.combat;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "action_results")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ActionResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    @EqualsAndHashCode.Include
    private Long resultId;

    @Basic(optional = false)
    private Boolean success;

    private Integer damageDealt;

    @Lob
    private String description;

    private String damageRoll;

    @ElementCollection
    @CollectionTable(name = "action_result_dice",
            joinColumns = @JoinColumn(name = "result_id"))
    @MapKeyColumn(name = "dice_name")
    @Column(name = "dice_value")
    @Builder.Default
    private Map<String, Integer> diceResults = new HashMap<>();


    @OneToOne(mappedBy = "result")
    private CombatAction action;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

}