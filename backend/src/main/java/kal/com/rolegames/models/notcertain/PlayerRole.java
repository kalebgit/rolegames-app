//package kal.com.rolegames.models.notcertain;
//
//import jakarta.persistence.*;
//import kal.com.rolegames.models.characters.PlayerCharacter;
//import lombok.*;
//import lombok.experimental.SuperBuilder;
//
//import java.util.HashSet;
//import java.util.Set;
//
//@Entity
////lombok
//@Getter @Setter
//@NoArgsConstructor @AllArgsConstructor
//@SuperBuilder
//@ToString(includeFieldNames = true)
//public class PlayerRole extends Role{
//    @OneToMany(mappedBy = "player", cascade = {CascadeType.ALL}, fetch= FetchType.LAZY, orphanRemoval=true)
//    @Setter(AccessLevel.NONE)
//    private Set<PlayerCharacter> characters = new HashSet<>();
//
//    @Basic(optional = false)
//    @Setter(AccessLevel.NONE)
//    private int experience = 0;
//
//    /**
//     * Adds a character to this player's list of characters.
//     * Sets the character's player to this player and adds it to the characters set.
//     *
//     * @param character The character to add
//     */
//    public void addCharacter(PlayerCharacter character) {
//        character.setPlayer(this);
//        characters.add(character);
//    }
//
//    /**
//     * Removes a character from this player's list.
//     * Removes the character from the set and sets its player to null.
//     *
//     * @param character The character to remove
//     */
//    public void removeCharacter(PlayerCharacter character) {
//        if (characters.contains(character)) {
//            characters.remove(character);
//            character.setPlayer(null);
//        }
//    }
//
//    /**
//     * Adds experience to this player.
//     * Adds the specified amount to the player's experience.
//     *
//     * @param amount The amount of experience to add
//     */
//    public void addExperience(int amount) {
//        if (amount > 0) {
//            this.experience += amount;
//        }
//    }
//
//    /**
//     * Gets the player's level based on experience.
//     * Calculates the level based on D&D's experience progression.
//     *
//     * @return The player's level
//     */
//    public int getLevel() {
//        if (experience < 300) return 1;
//        if (experience < 900) return 2;
//        if (experience < 2700) return 3;
//        if (experience < 6500) return 4;
//        if (experience < 14000) return 5;
//        if (experience < 23000) return 6;
//        if (experience < 34000) return 7;
//        if (experience < 48000) return 8;
//        if (experience < 64000) return 9;
//        if (experience < 85000) return 10;
//        if (experience < 100000) return 11;
//        if (experience < 120000) return 12;
//        if (experience < 140000) return 13;
//        if (experience < 165000) return 14;
//        if (experience < 195000) return 15;
//        if (experience < 225000) return 16;
//        if (experience < 265000) return 17;
//        if (experience < 305000) return 18;
//        if (experience < 355000) return 19;
//        return 20;
//    }
//}
