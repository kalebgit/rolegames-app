package kal.com.rolegames.models.users;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.users.User;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name ="players")
//lombok annotations
@Builder
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
@ToString(callSuper = true, exclude = {"characters"})
public class Player{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playerId;

    @OneToMany(mappedBy = "player", cascade = {CascadeType.ALL}, fetch=FetchType.LAZY, orphanRemoval=true)
    @Setter(AccessLevel.NONE)
    @Builder.Default
    private Set<PlayerCharacter> characters = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "user_id", unique = true)
    private User user;

    @Basic(optional = false)
    @Setter(AccessLevel.NONE)
    private int experience = 0;

    //metodos producto de composicion
    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }

    public String getUsername() {
        return user != null ? user.getUsername() : null;
    }

    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }


    /**
     * Adds a character to this player's list of characters.
     * Sets the character's player to this player and adds it to the characters set.
     *
     * @param character The character to add
     */
    public void addCharacter(PlayerCharacter character) {
        character.setPlayer(this);
        characters.add(character);
    }

    /**
     * Removes a character from this player's list.
     * Removes the character from the set and sets its player to null.
     *
     * @param character The character to remove
     */
    public void removeCharacter(PlayerCharacter character) {
        if (characters.contains(character)) {
            characters.remove(character);
            character.setPlayer(null);
        }
    }

    /**
     * Adds experience to this player.
     * Adds the specified amount to the player's experience.
     *
     * @param amount The amount of experience to add
     */
    public void addExperience(int amount) {
        if (amount > 0) {
            this.experience += amount;
        }
    }

    /**
     * Gets the player's level based on experience.
     * Calculates the level based on D&D's experience progression.
     *
     * @return The player's level
     */
    public int getLevel() {
        if (experience < 300) return 1;
        if (experience < 900) return 2;
        if (experience < 2700) return 3;
        if (experience < 6500) return 4;
        if (experience < 14000) return 5;
        if (experience < 23000) return 6;
        if (experience < 34000) return 7;
        if (experience < 48000) return 8;
        if (experience < 64000) return 9;
        if (experience < 85000) return 10;
        if (experience < 100000) return 11;
        if (experience < 120000) return 12;
        if (experience < 140000) return 13;
        if (experience < 165000) return 14;
        if (experience < 195000) return 15;
        if (experience < 225000) return 16;
        if (experience < 265000) return 17;
        if (experience < 305000) return 18;
        if (experience < 355000) return 19;
        return 20;
    }
}