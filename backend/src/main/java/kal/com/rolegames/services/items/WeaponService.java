package kal.com.rolegames.services.items;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.items.WeaponDTO;
import kal.com.rolegames.mappers.items.ItemMapper;
import kal.com.rolegames.mappers.items.WeaponMapper;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.effects.ItemEffect;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.items.Range;
import kal.com.rolegames.models.items.Weapon;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import kal.com.rolegames.repositories.items.WeaponRepository;
import kal.com.rolegames.repositories.users.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class WeaponService {

    private final WeaponRepository weaponRepository;
    private final UserRepository userRepository;
    private final WeaponMapper weaponMapper;
    private final WebApplicationContext webApplicationContext;

    public List<WeaponDTO> getAllWeapons() {
        return weaponMapper.toItemListDto(weaponRepository.findAll());
    }

    public WeaponDTO getWeaponById(Long id) {
        Weapon weapon = weaponRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Weapon not found"));
        return weaponMapper.toDTO(weapon);
    }

    @Transactional
    public WeaponDTO createWeapon(WeaponDTO dto, Long creatorId){
        Weapon weapon = weaponMapper.toEntity(dto);
        User creator = userRepository.findById(creatorId).orElseThrow(()->new NoSuchElementException("el creador no existe como usuario en el sistema"));
        weapon.setCreator(creator);
        return weaponMapper.toDTO(weaponRepository.save(weapon));
    }

    @Transactional
    public WeaponDTO updateWeapon(Long weaponId, WeaponDTO dto) {
        Weapon existingWeapon = weaponRepository.findById(weaponId)
                .orElseThrow(() -> new NoSuchElementException("Weapon not found"));
        weaponMapper.updateWeaponFromDto(dto, existingWeapon);
        Weapon updatedWeapon = weaponRepository.save(existingWeapon);
        return weaponMapper.toDTO(updatedWeapon);
    }
}