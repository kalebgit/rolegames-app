package kal.com.rolegames.services.spells;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.spells.SpellDTO;
import kal.com.rolegames.mappers.spells.SpellMapper;
import kal.com.rolegames.models.spells.Spell;
import kal.com.rolegames.models.util.SpellSchool;
import kal.com.rolegames.repositories.spells.SpellRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class SpellService {

    private final SpellRepository spellRepository;
    private final SpellMapper spellMapper;

    public List<SpellDTO> getAllSpells() {
        return spellMapper.toSpellListDto(new ArrayList<>(spellRepository.findAll()));
    }

    public List<SpellDTO> getSpellsByLevel(Integer level) {
        return spellMapper.toSpellListDto(new ArrayList<>(spellRepository.findByLevel(level)));
    }

    public List<SpellDTO> getSpellsBySchool(SpellSchool school) {
        return spellMapper.toSpellListDto(new ArrayList<>(spellRepository.findBySchool(school)));
    }

    public SpellDTO getSpellById(Long id) {
        Spell spell = spellRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Spell not found"));
        return spellMapper.toDTO(spell);
    }

    @Transactional
    public SpellDTO createSpell(SpellDTO dto) {
        Spell spell = spellMapper.toEntity(dto);
        Spell savedSpell = spellRepository.save(spell);
        return spellMapper.toDTO(savedSpell);
    }

    @Transactional
    public SpellDTO updateSpell(Long spellId, SpellDTO dto) {
        Spell existingSpell = spellRepository.findById(spellId)
                .orElseThrow(() -> new NoSuchElementException("Spell not found"));

        spellMapper.updateSpellFromDto(dto, existingSpell);
        Spell updatedSpell = spellRepository.save(existingSpell);
        return spellMapper.toDTO(updatedSpell);
    }

    @Transactional
    public void deleteSpell(Long spellId) {
        if (!spellRepository.existsById(spellId)) {
            throw new NoSuchElementException("Spell not found");
        }
        spellRepository.deleteById(spellId);
    }
}