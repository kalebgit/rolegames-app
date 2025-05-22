package kal.com.rolegames.models.effects;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.spells.Spell;
import kal.com.rolegames.models.util.EffectType;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "effects")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Effect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "effect_id")
    @EqualsAndHashCode.Include
    private Long effectId;

    @Basic(optional = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Basic(optional = false)
    private EffectType effectType;

    @Lob
    private String description;

    @ManyToOne
    @JoinColumn(name = "source_id")
    private GameCharacter source;

    @ManyToOne
    @JoinColumn(name = "target_id")
    private GameCharacter target;

    @ManyToOne
    @JoinColumn(name = "spell_id")
    private Spell spell;

    @Basic(optional = false)
    private Integer duration; // in rounds, -1 for until dispelled

    @Basic(optional = false)
    private Boolean isActive;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime startTime;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime endTime;

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public void activate() {
        this.isActive = true;
        this.startTime = LocalDateTime.now();
    }

    public void deactivate() {
        this.isActive = false;
        this.endTime = LocalDateTime.now();
    }

    public boolean isPermanent() {
        return duration < 0;
    }

    public boolean isTemporary() {
        return !isPermanent();
    }

    public boolean isFromSpell() {
        return spell != null;
    }

    public String getSourceName() {
        if (isFromSpell()) {
            return spell.getName();
        } else if (source != null) {
            return source.getName();
        } else {
            return "Unknown";
        }
    }
}