package kal.com.rolegames.repositories.items;

import kal.com.rolegames.models.items.Weapon;
import kal.com.rolegames.models.util.WeaponType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeaponRepository extends JpaRepository<Weapon, Long> {
    List<Weapon> findByWeaponType(WeaponType weaponType);
    List<Weapon> findByIsMagical(Boolean isMagical);
}