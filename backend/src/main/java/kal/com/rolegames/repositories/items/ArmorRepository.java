package kal.com.rolegames.repositories.items;

import kal.com.rolegames.models.items.Armor;
import kal.com.rolegames.models.util.ArmorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArmorRepository extends JpaRepository<Armor, Long> {
    List<Armor> findByArmorType(ArmorType armorType);
    List<Armor> findByStrengthRequirementLessThanEqual(Integer maxStrengthRequired);
    List<Armor> findByStealthDisadvantage(Boolean hasDisadvantage);
}