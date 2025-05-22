//package kal.com.rolegames.models.characters;
//
//import jakarta.persistence.*;
//import kal.com.rolegames.models.util.DialogueType;
//import lombok.*;
//
//import java.util.HashSet;
//import java.util.Set;
//
//@Entity
//@Table(name = "dialogue_options")
////lombok annotations
//@Getter @Setter
//@NoArgsConstructor @AllArgsConstructor
//@Builder
//@ToString(includeFieldNames = true)
//@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//public class DialogueOption {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "dialogue_id")
//    @EqualsAndHashCode.Include
//    private Long dialogueId;
//
//    @Lob
//    @Basic(optional = false)
//    private String playerPrompt;
//
//    @Lob
//    @Basic(optional = false)
//    private String npcResponse;
//
//    @Enumerated(EnumType.STRING)
//    @Basic(optional = false)
//    private DialogueType dialogueType;
//
//    private String requirements; // Conditions that must be met for this option to be available
//
//    @ManyToMany
//    @JoinTable(
//            name = "dialogue_next_options",
//            joinColumns = @JoinColumn(name = "dialogue_id"),
//            inverseJoinColumns = @JoinColumn(name = "next_dialogue_id")
//    )
//    private Set<DialogueOption> nextOptions = new HashSet<>();
//
//    @Version
//    @Setter(AccessLevel.NONE)
//    private Long version;
//
//    // Method to add a dialogue option that follows this one
//    // Should add the DialogueOption to the nextOptions set
//    public void addNextOption(DialogueOption nextOption) {
//        // TODO: Add nextOption to nextOptions set
//    }
//
//    // Method to remove a dialogue option that follows this one
//    // Should remove the DialogueOption from the nextOptions set
//    public void removeNextOption(DialogueOption nextOption) {
//        // TODO: Remove nextOption from nextOptions set
//    }
//
//    // Method to check if this dialogue option has any next options
//    // Should return true if the nextOptions set is not empty
//    public boolean hasNextOptions() {
//        // TODO: Return true if nextOptions is not empty
//        return false; // Default return for compilation
//    }
//
//    // Method to check if this dialogue option is an endpoint (no further dialogue)
//    // Should return true if the nextOptions set is empty
//    public boolean isEndpoint() {
//        // TODO: Return true if nextOptions is empty
//        return false; // Default return for compilation
//    }
//}