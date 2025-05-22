package kal.com.rolegames.models.combat;

import jakarta.persistence.*;
import lombok.*;

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

    @OneToOne(mappedBy = "result")
    private CombatAction action;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

}