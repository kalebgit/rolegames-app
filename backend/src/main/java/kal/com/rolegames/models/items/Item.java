package kal.com.rolegames.models.items;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.effects.ItemEffect;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.ItemRarity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "items")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    @EqualsAndHashCode.Include
    private Long itemId;

    @Basic(optional = false)
    private String name;

    @Lob
    private String description;

    private Float weight;

    private Integer value;

    @Enumerated(EnumType.STRING)
    private ItemRarity rarity;

    private Boolean requiresAttunement;

    private Boolean isAttuned;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private GameCharacter owner;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "item_id")
    private Set<ItemEffect> effects = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "item_tags", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public void addEffect(ItemEffect effect) {
        effects.add(effect);
    }

    public void removeEffect(ItemEffect effect) {
        effects.remove(effect);
    }

    public void addTag(String tag) {
        tags.add(tag);
    }

    public void removeTag(String tag) {
        tags.remove(tag);
    }
}