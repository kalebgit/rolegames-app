package kal.com.rolegames.dto.combat;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class ActionResultDTO {
    private Long resultId;
    private Boolean success;
    private Integer damageDealt;
    private String description;
    private String damageRoll; // Ejemplo: "1d8+3"
    private Map<String, Integer> diceResults; // Resultado de cada dado individual
}