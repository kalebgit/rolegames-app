package kal.com.rolegames.models.characters;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "traits")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Trait {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trait_id")
    @EqualsAndHashCode.Include
    private Long traitId;

    @Basic(optional = false)
    private String name;

    @Lob
    private String description;

    // notar que character es el que afecta a traits pues cuando se elimina un personaje
    // todas las entradas que tuviesen su llave primaria son eliminadas por el parametro
    // cascade
    @ManyToMany(mappedBy = "traits")
    private Set<GameCharacter> characters = new HashSet<>();

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

}