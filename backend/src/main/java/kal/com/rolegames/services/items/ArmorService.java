package kal.com.rolegames.services.items;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.items.ArmorDTO;
import kal.com.rolegames.mappers.items.ArmorMapper;
import kal.com.rolegames.mappers.items.WeaponMapper;
import kal.com.rolegames.models.items.Armor;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.repositories.items.ArmorRepository;
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
public class ArmorService {

    private final ArmorRepository armorRepository;
    private final UserRepository userRepository;
    private final ArmorMapper armorMapper;
    private final WebApplicationContext webApplicationContext;

    public List<ArmorDTO> getAllArmor() {
        return armorMapper.toArmorListDto(armorRepository.findAll());
    }

    public ArmorDTO getArmorById(Long id) {
        Armor armor = armorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("AArmor not found"));
        return armorMapper.toDTO(armor);
    }

    @Transactional
    public ArmorDTO createArmor(ArmorDTO dto, Long creatorId){
        Armor armor = armorMapper.toEntity(dto);
        User creator = userRepository.findById(creatorId).orElseThrow(()->new NoSuchElementException("el creador no existe como usuario en el sistema"));
        armor.setCreator(creator);
        return armorMapper.toDTO(armorRepository.save(armor));
    }

    @Transactional
    public ArmorDTO updateArmor(Long weaponId, ArmorDTO dto) {
        Armor existingWeapon = armorRepository.findById(weaponId)
                .orElseThrow(() -> new NoSuchElementException("AArmor not found"));
        armorMapper.updateArmorFromDto(dto, existingWeapon);
        Armor updatedWeapon = armorRepository.save(existingWeapon);
        return armorMapper.toDTO(updatedWeapon);
    }
}