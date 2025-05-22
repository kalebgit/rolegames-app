package kal.com.rolegames.models.util;

public enum SkillType {
    ACROBATICS(AbilityType.DEXTERITY),
    ANIMAL_HANDLING(AbilityType.WISDOM),
    ARCANA(AbilityType.INTELLIGENCE),
    ATHLETICS(AbilityType.STRENGTH),
    DECEPTION(AbilityType.CHARISMA),
    HISTORY(AbilityType.INTELLIGENCE),
    INSIGHT(AbilityType.WISDOM),
    INTIMIDATION(AbilityType.CHARISMA),
    INVESTIGATION(AbilityType.INTELLIGENCE),
    MEDICINE(AbilityType.WISDOM),
    NATURE(AbilityType.INTELLIGENCE),
    PERCEPTION(AbilityType.WISDOM),
    PERFORMANCE(AbilityType.CHARISMA),
    PERSUASION(AbilityType.CHARISMA),
    RELIGION(AbilityType.INTELLIGENCE),
    SLEIGHT_OF_HAND(AbilityType.DEXTERITY),
    STEALTH(AbilityType.DEXTERITY),
    SURVIVAL(AbilityType.WISDOM);

    private final AbilityType associatedAbility;

    SkillType(AbilityType associatedAbility) {
        this.associatedAbility = associatedAbility;
    }

    public AbilityType getAssociatedAbility() {
        return associatedAbility;
    }
}