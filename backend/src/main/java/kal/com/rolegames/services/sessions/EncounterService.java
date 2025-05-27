package kal.com.rolegames.services.sessions;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.combat.CombatStateDTO;
import kal.com.rolegames.dto.combat.InitiativeDTO;
import kal.com.rolegames.dto.items.RewardDTO;
import kal.com.rolegames.dto.sessions.EncounterDTO;
import kal.com.rolegames.mappers.items.RewardMapper;
import kal.com.rolegames.mappers.sessions.EncounterMapper;
import kal.com.rolegames.models.characters.GameCharacter;
import kal.com.rolegames.models.combat.CombatState;
import kal.com.rolegames.models.combat.Initiative;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.items.Reward;
import kal.com.rolegames.models.sessions.Encounter;
import kal.com.rolegames.models.sessions.Session;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.EncounterType;
import kal.com.rolegames.models.util.RewardType;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.characters.GameCharacterRepository;
import kal.com.rolegames.repositories.combat.CombatStateRepository;
import kal.com.rolegames.repositories.combat.InitiativeRepository;
import kal.com.rolegames.repositories.items.ItemRepository;
import kal.com.rolegames.repositories.sessions.EncounterRepository;
import kal.com.rolegames.repositories.sessions.SessionRepository;
import kal.com.rolegames.repositories.users.DungeonMasterRepository;
import kal.com.rolegames.repositories.users.PlayerRepository;
import kal.com.rolegames.services.combat.CombatService;
import kal.com.rolegames.websockets.EncounterWebSocketService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class EncounterService {

    private final EncounterRepository encounterRepository;
    private final SessionRepository sessionRepository;
    private final GameCharacterRepository characterRepository;
    private final ItemRepository itemRepository ;
    private final CombatStateRepository combatStateRepository;
    private final DungeonMasterRepository dungeonMasterRepository;
    private final PlayerRepository playerRepository;
    private final InitiativeRepository initiativeRepository;

    private final CombatService combatService;
    private final EncounterWebSocketService webSocketService;


    private final EncounterMapper encounterMapper;
    private final RewardMapper rewardMapper;

    private static final Logger logger = LoggerFactory.getLogger(EncounterService.class);

    public List<EncounterDTO> getAllEncounters(User user) {

        //refactorizar para hacer usar el mapper (todavia no implementado)
        Long id = user.getUserId();

        if(user.getUserType() == UserType.PLAYER){
            return encounterRepository.findByPlayerParticipation(
                            playerRepository.findByUserId(id)
                                    .orElseThrow(()->new NoSuchElementException("No existe el jugador"))
                    ).stream()
                    .map(encounterMapper::toDTO)
                    .collect(Collectors.toList());
        }else if (user.getUserType() == UserType.DUNGEON_MASTER){
            return encounterRepository.findByDungeonMaster(
                    dungeonMasterRepository.findByUserId(id)
                            .orElseThrow(()->new NoSuchElementException("No existe el jugador"))
                    ).stream()
                    .map(encounterMapper::toDTO)
                    .collect(Collectors.toList());
        }

        throw new NoSuchElementException("No se encontraron campañas");
    }

    public List<EncounterDTO> getEncountersBySession(Long sessionId) {
        return encounterMapper.toEncounterListDto(new ArrayList<>(encounterRepository.findBySessionSessionId(sessionId)));
    }

    public List<EncounterDTO> getCompletedEncounters() {
        return encounterMapper.toEncounterListDto(new ArrayList<>(encounterRepository.findByIsCompleted(true)));
    }

    public List<EncounterDTO> getPendingEncounters() {
        return encounterMapper.toEncounterListDto(new ArrayList<>(encounterRepository.findByIsCompleted(false)));
    }

    public EncounterDTO getEncounterById(Long id) {
        Encounter encounter = encounterRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));
        return mapToDetailedDTO(encounter);
    }

    @Transactional
    public EncounterDTO createEncounter(EncounterDTO dto, Long sessionId) {
        logger.info("[ENCOUNTER SERVICE] Creating encounter for session ID: {}", sessionId);

        if (sessionId == null) {
           throw new IllegalArgumentException("El usuario de la sesion es nulo");
        }

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        Encounter encounter = encounterMapper.toEntity(dto);

        //se agrega el encuentro a la sesion
        encounter.setSession(session);
        session.addEncounter(encounter);

        if (encounter.getIsCompleted() == null) {
            encounter.setIsCompleted(false);
        }

        Encounter savedEncounter = encounterRepository.save(encounter);

        logger.info("[ENCOUNTER SERVICE] Encounter created successfully with ID: {}", savedEncounter.getEncounterId());
        return mapToDetailedDTO(savedEncounter);
    }

    @Transactional
    public EncounterDTO updateEncounter(Long encounterId, EncounterDTO dto) {
        Encounter existingEncounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        encounterMapper.updateEncounterFromDto(dto, existingEncounter);
        Encounter updatedEncounter = encounterRepository.save(existingEncounter);
        return mapToDetailedDTO(updatedEncounter);
    }

    @Transactional
    public void deleteEncounter(Long encounterId) {
        if (!encounterRepository.existsById(encounterId)) {
            throw new NoSuchElementException("Encounter not found");
        }
        encounterRepository.deleteById(encounterId);
    }


    /*
    CON MAS RELACIONES A OTROS SERVICES O REPOSITORIES
     */

    // USO DE TEMPLATE
    @Transactional
    public EncounterDTO completeEncounterBase(Long encounterId, boolean endCombatIfActive) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        encounter.setIsCompleted(true);

        if (endCombatIfActive &&
                encounter.getCombatState() != null &&
                encounter.getCombatState().getIsActive()) {
            encounter.getCombatState().endCombat();
        }

        Encounter updatedEncounter = encounterRepository.save(encounter);
        logger.info("[ENCOUNTER SERVICE] Encounter {} marked as completed", encounterId);
        return mapToDetailedDTO(updatedEncounter);
    }

    @Transactional
    public EncounterDTO completeEncounter(Long id) {
        return completeEncounterBase(id, false);
    }

    @Transactional
    public EncounterDTO completeEncounterAndEndCombat(Long id) {
        return completeEncounterBase(id, true);
    }



    // CUANDO NO SE USO TEMPLATE
//    @Transactional
//    public EncounterDTO completeEncounter(Long encounterId) {
//        Encounter encounter = encounterRepository.findById(encounterId)
//                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));
//
//        encounter.setIsCompleted(true);
//
//        Encounter updatedEncounter = encounterRepository.save(encounter);
//        logger.info("[ENCOUNTER SERVICE] Encounter {} marked as completed", encounterId);
//        return mapToDetailedDTO(updatedEncounter);
//    }
//
//    @Transactional
//    public EncounterDTO completeEncounterAndEndCombat(Long encounterId) {
//        Encounter encounter = encounterRepository.findById(encounterId)
//                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));
//
//        encounter.setIsCompleted(true);
//
//        //TERMINAR COMBATES
//        if (encounter.getCombatState() != null && encounter.getCombatState().getIsActive()) {
//            encounter.getCombatState().endCombat();
//        }
//
//        Encounter updatedEncounter = encounterRepository.save(encounter);
//        logger.info("[ENCOUNTER SERVICE] Encounter {} marked as completed", encounterId);
//        return mapToDetailedDTO(updatedEncounter);
//    }
//

    // solo lo que hace: iniciar el combate que tiene asociado con las iniciativas
    // e indicar el primer turno
    @Transactional
    public EncounterDTO startCombat(Long encounterId, Map<Long, Integer> diceThrows) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        if(encounter.getEncounterType() != EncounterType.COMBAT){
            throw new IllegalArgumentException("El encuentro no tiene tipo combato");
        }else if(diceThrows.isEmpty()){
            throw new IllegalArgumentException("No hay tiradas asi que no podemos establecer un orden en combate");
        }

        //creacion de combate e iniciativa
        //crear combate:
        CombatState createdCombat =  combatService.createCombatForEncounter(encounter.getEncounterId());
        logger.warn("❗ ❗ ❗  Se ha creado el combate e iniciado [combat: {}]", createdCombat);


        //❗falta incializar los turnos
        //inicializar turnos (necesita resultado de dados)
        //va sobre cada character en encounter y crea un nuevo Initiative con intiativeRoll
        List<Initiative> initiatives  = encounter.getParticipants().stream().map( (GameCharacter character)->{
            Initiative newInitiative = Initiative.builder()
                    .combatState(createdCombat)
                    .initiativeRoll(diceThrows.get(character.getCharacterId()))
                    .character(character)
                    .build();
            return initiativeRepository.save(newInitiative);
            //ademas abajo los ordenamos
        }).sorted(Comparator.comparing(Initiative::getInitiativeRoll)).collect(Collectors.toList());
        createdCombat.setInitiativeOrder(initiatives);


        //inicializar el primer turno
        initiatives.get(0).setCurrentTurn(true);

        //guardar combat
        CombatState updatedCombatWithInitiatives = combatStateRepository.save(createdCombat);
        logger.warn("❗❗️❗️❗️❗️️ Se ha inicializado el combate con iniciativas [combate: {}]",
                updatedCombatWithInitiatives);

        Encounter updatedEncounter = encounterRepository.save(encounter);
        logger.info("[ENCOUNTER SERVICE] Combat se ha iniciado para encuentro {}", encounterId);
        EncounterDTO result = mapToDetailedDTO(updatedEncounter);

        // Notificar por WebSocket
        webSocketService.notifyCombatStarted(encounterId,
                combatService.getCurrentCombat());

        return result;
    }

    @Transactional
    public EncounterDTO nextTurn(Long encounterId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encuentro no encontrado"));

        if (encounter.getEncounterType() != EncounterType.COMBAT) {
            throw new IllegalArgumentException("Encuentro no es de tipo COMBAT");
        }

        if (encounter.getCombatState() == null || !encounter.getCombatState().getIsActive()) {
            throw new IllegalStateException("No se encontro combate active para este encuentro");
        }

        combatService.nextTurn();

        logger.info("[ENCOUNTER SERVICE] siguiente turno para el encuentro {}", encounterId);

        Encounter refreshedEncounter = encounterRepository.findById(encounterId).orElseThrow();


        EncounterDTO result = mapToDetailedDTO(refreshedEncounter);

        // Notificar cambio de turno
        webSocketService.notifyTurnChanged(encounterId,
                getCurrentTurnInfo(encounterId));

        return result;
    }

    private InitiativeDTO getCurrentTurnInfo(Long encounterId) {
        try {
            // Obtener el combate activo del encounter
            Encounter encounter = encounterRepository.findById(encounterId)
                    .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

            if (encounter.getCombatState() != null && encounter.getCombatState().getIsActive()) {
                CombatStateDTO combatState = combatService.getCurrentCombat();

                // Buscar la iniciativa con currentTurn = true
                return combatState.getInitiativeOrder().stream()
                        .filter(InitiativeDTO::getCurrentTurn)
                        .findFirst()
                        .orElse(null);
            }

            return null;
        } catch (Exception e) {
            logger.warn("Error obteniendo información del turno actual: {}", e.getMessage());
            return null;
        }
    }

    @Transactional
    public EncounterDTO addParticipant(Long encounterId, Long characterId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encuentro no encontrado"));

        GameCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new NoSuchElementException("Personaje no encontrado"));

        encounter.addParticipant(character);
        Encounter updatedEncounter = encounterRepository.save(encounter);

        if (encounter.getEncounterType() == EncounterType.COMBAT &&
                encounter.getCombatState() != null &&
                encounter.getCombatState().getIsActive()) {

            // Delegar al CombatService: necesitaremos una tirada de iniciativa
            // Por ahora usamos un valor por defecto, pero deberías pasarlo como parámetro
            try {
                combatService.addParticipant(characterId, 10);
                logger.info("[ENCOUNTER SERVICE] Character {} se ha añadido al combato", characterId);
            } catch (Exception e) {
                logger.warn("[ENCOUNTER SERVICE] Could not add character to combat: {}", e.getMessage());
            }
        }

        logger.info("[ENCOUNTER SERVICE] Character {} added to encounter {}", characterId, encounterId);
        EncounterDTO result = mapToDetailedDTO(updatedEncounter);

        // Notificar nuevo participante
        webSocketService.notifyParticipantAdded(encounterId, characterId);

        return result;
    }

    @Transactional
    public EncounterDTO removeParticipant(Long encounterId, Long characterId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        GameCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new NoSuchElementException("Character not found"));

        // Remover del encuentro
        encounter.removeParticipant(character);

        if (encounter.getEncounterType() == EncounterType.COMBAT &&
                encounter.getCombatState() != null &&
                encounter.getCombatState().getIsActive()) {

            try {
                combatService.removeParticipant(characterId);
                logger.info("[ENCOUNTER SERVICE] Character {} se ha removido del combate actual", characterId);
            } catch (Exception e) {
                logger.warn("[ENCOUNTER SERVICE] No se pudo remover del combate: {}", e.getMessage());
            }
        }

        Encounter updatedEncounter = encounterRepository.save(encounter);
        logger.info("[ENCOUNTER SERVICE] Character {} removed from encounter {}", characterId, encounterId);
        return mapToDetailedDTO(updatedEncounter);
    }

    @Transactional
    public EncounterDTO addReward(Long encounterId, RewardDTO rewardDTO) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        Reward reward = rewardMapper.toEntity(rewardDTO);

        if (rewardDTO.getRewardType() == RewardType.ITEM && rewardDTO.getItemId() != null) {
            Item item = itemRepository.findById(rewardDTO.getItemId())
                    .orElseThrow(() -> new NoSuchElementException("Item not found"));
            reward.setItemReward(item);
        }

        if (reward.getClaimed() == null) {
            reward.setClaimed(false);
        }

        encounter.addReward(reward);
        Encounter updatedEncounter = encounterRepository.save(encounter);
        logger.info("[ENCOUNTER SERVICE] Reward added to encounter {}", encounterId);
        return mapToDetailedDTO(updatedEncounter);
    }

    @Transactional
    public EncounterDTO removeReward(Long encounterId, Long rewardId) {
        Encounter encounter = encounterRepository.findById(encounterId)
                .orElseThrow(() -> new NoSuchElementException("Encounter not found"));

        Reward rewardToRemove = encounter.getRewards().stream()
                .filter(reward -> reward.getRewardId().equals(rewardId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Reward not found in this encounter"));

        encounter.removeReward(rewardToRemove);
        Encounter updatedEncounter = encounterRepository.save(encounter);
        logger.info("[ENCOUNTER SERVICE] Reward {} removed from encounter {}", rewardId, encounterId);
        return mapToDetailedDTO(updatedEncounter);
    }

    private EncounterDTO mapToDetailedDTO(Encounter encounter) {
        EncounterDTO dto = encounterMapper.toDTO(encounter);

        dto.setParticipantIds(encounter.getParticipants().stream()
                .map(GameCharacter::getCharacterId)
                .collect(Collectors.toSet()));

        dto.setRewards(encounter.getRewards().stream()
                .map(rewardMapper::toDTO)
                .collect(Collectors.toSet()));

        return dto;
    }
}