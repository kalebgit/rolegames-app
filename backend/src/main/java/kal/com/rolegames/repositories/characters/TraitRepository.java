package kal.com.rolegames.repositories.characters;

import kal.com.rolegames.models.characters.Trait;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TraitRepository extends JpaRepository<Trait, Long> {
}