package kal.com.rolegames.controllers.spells;

import kal.com.rolegames.dto.spells.SpellDTO;
import kal.com.rolegames.models.util.SpellSchool;
import kal.com.rolegames.services.spells.SpellService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spells")
@CrossOrigin(origins = "*")
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class SpellController {

    private final SpellService spellService;

    @GetMapping
    public ResponseEntity<List<SpellDTO>> getAllSpells() {
        return ResponseEntity.ok(spellService.getAllSpells());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpellDTO> getSpellById(@PathVariable Long id) {
        return ResponseEntity.ok(spellService.getSpellById(id));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<SpellDTO>> getSpellsByLevel(@PathVariable Integer level) {
        return ResponseEntity.ok(spellService.getSpellsByLevel(level));
    }

    @GetMapping("/school/{school}")
    public ResponseEntity<List<SpellDTO>> getSpellsBySchool(@PathVariable SpellSchool school) {
        return ResponseEntity.ok(spellService.getSpellsBySchool(school));
    }

    @PostMapping
    public ResponseEntity<SpellDTO> createSpell(@RequestBody SpellDTO spellDTO) {
        return ResponseEntity.ok(spellService.createSpell(spellDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpellDTO> updateSpell(
            @PathVariable Long id,
            @RequestBody SpellDTO spellDTO) {
        return ResponseEntity.ok(spellService.updateSpell(id, spellDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpell(@PathVariable Long id) {
        spellService.deleteSpell(id);
        return ResponseEntity.noContent().build();
    }
}