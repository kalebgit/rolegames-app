package kal.com.rolegames.repositories.spells;

import kal.com.rolegames.models.spells.Spell;
import kal.com.rolegames.models.util.SpellSchool;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpellRepository extends JpaRepository<Spell, Long> {
    List<Spell> findByLevel(Integer level);
    List<Spell> findBySchool(SpellSchool school);
    List<Spell> findByLevelLessThanEqual(Integer maxLevel);
}