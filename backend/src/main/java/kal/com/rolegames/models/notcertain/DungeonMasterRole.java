//package kal.com.rolegames.models.notcertain;
//
//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Entity;
//import jakarta.persistence.OneToMany;
//import kal.com.rolegames.models.characters.NonPlayerCharacter;
//import kal.com.rolegames.models.items.Item;
//import lombok.*;
//import lombok.experimental.SuperBuilder;
//
//import java.util.HashSet;
//import java.util.Set;
//
//
//@Entity
////lombok
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@SuperBuilder
//@ToString(includeFieldNames = true)
//public class DungeonMasterRole extends Role {
//
//    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<NonPlayerCharacter> createdNpcs = new HashSet<>();
//
//    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Item> createdItems = new HashSet<>();
//
//    private String dmStyle;
//
//    private Float rating;
//
//    public void createNpc(NonPlayerCharacter npc) {
//        createdNpcs.add(npc);
//        npc.setCreator(this);
//    }
//
//    public void createItem(Item item) {
//        createdItems.add(item);
//        item.setCreator(this);
//    }
//}
