package kal.com.rolegames.services.users;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.users.DungeonMasterDTO;
import kal.com.rolegames.dto.users.UserDTO;
import kal.com.rolegames.mappers.users.DungeonMasterMapper;
import kal.com.rolegames.mappers.users.UserMapper;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.repositories.users.DungeonMasterRepository;
import kal.com.rolegames.repositories.users.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class DungeonMasterService {

    private final DungeonMasterRepository dungeonMasterRepository;
    private final UserRepository userRepository;
    private final DungeonMasterMapper dungeonMasterMapper;
    private final UserMapper userMapper;

    private static final Logger logger = LoggerFactory.getLogger(DungeonMasterService.class);

    /**
     * Obtiene todos los DMs
     */
    public List<DungeonMasterDTO> getAllDungeonMasters() {
        List<DungeonMaster> dms = dungeonMasterRepository.findAll();
        return dungeonMasterMapper.toDungeonMasterDtoList(dms);
    }

    /**
     * Obtiene un DM por ID
     */
    public DungeonMasterDTO getDungeonMasterById(Long dmId) {
        DungeonMaster dm = dungeonMasterRepository.findById(dmId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found with id: " + dmId));
        return dungeonMasterMapper.toDto(dm);
    }

    /**
     * Obtiene un DM por su ID de usuario
     */
    public DungeonMasterDTO getDungeonMasterByUserId(Long userId) {
        DungeonMaster dm = dungeonMasterRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found for user ID: " + userId));
        return dungeonMasterMapper.toDto(dm);
    }

    @Transactional
    public DungeonMasterDTO createDungeonMasterFromUser(UserDTO user) {
        logger.info("[DM_SERVICE] Creando dm a partir del usuario: {}", user.getUsername());

        if (dungeonMasterRepository.findByEmail(user.getEmail()).isPresent()) {
            logger.warn("[DM_SERVICE] DungeonMaster ya existe para este usuario");
            throw new IllegalStateException("DungeonMaster already exists for this user");
        }

        try {
            User registeredUser = userRepository.getReferenceById(user.getUserId());

            DungeonMaster newDm = DungeonMaster.builder()
                    .user(registeredUser)
                    .dmStyle("Standard")
                    .rating(0.0f)
                    .build();

            DungeonMaster savedDm = dungeonMasterRepository.save(newDm);
            logger.info("[DM_SERVICE] ✅DM guardado exitosamente con ID: {}", savedDm.getDungeonMasterId());

            return dungeonMasterMapper.toDto(savedDm);

        } catch (Exception exc) {
            logger.error("[DM_SERVICE] Error al crear DungeonMaster: {} - {}",
                    exc.getClass().getSimpleName(), exc.getMessage(), exc);
            throw new RuntimeException("Error al crear DungeonMaster: " + exc.getMessage(), exc);
        }
    }
    /**
     * Crea un DM desde un DTO
     */
    @Transactional
    public DungeonMasterDTO createDungeonMaster(DungeonMasterDTO dmDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));

        return createDungeonMasterFromUser(userMapper.toDto(user));
    }

    /**
     * Actualiza un DM existente
     */
    @Transactional
    public DungeonMasterDTO updateDungeonMaster(Long dmId, DungeonMasterDTO dmDTO) {
        DungeonMaster existingDm = dungeonMasterRepository.findById(dmId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found with id: " + dmId));

        dungeonMasterMapper.updateDungeonMasterFromDto(dmDTO, existingDm);
        DungeonMaster updatedDm = dungeonMasterRepository.save(existingDm);

        logger.info("[DM_SERVICE] DM actualizado: {}", updatedDm.getDungeonMasterId());
        return dungeonMasterMapper.toDto(updatedDm);
    }

    /**
     * Agrega una campaña al DM
     */
    @Transactional
    public DungeonMasterDTO addCampaignToDM(Long dmId, Campaign campaign) {
        DungeonMaster dm = dungeonMasterRepository.findById(dmId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found with id: " + dmId));

        dm.addCampaign(campaign);
        DungeonMaster updatedDm = dungeonMasterRepository.save(dm);

        logger.info("[DM_SERVICE] Campaña agregada al DM: {}", dmId);
        return dungeonMasterMapper.toDto(updatedDm);
    }

    /**
     * Agrega una campaña al DM por userId
     */
    @Transactional
    public DungeonMasterDTO addCampaignToDMByUserId(Long userId, Campaign campaign) {
        DungeonMaster dm = dungeonMasterRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found for user ID: " + userId));

        dm.addCampaign(campaign);
        DungeonMaster updatedDm = dungeonMasterRepository.save(dm);

        logger.info("[DM_SERVICE] Campaña agregada al DM por userId: {}", userId);
        return dungeonMasterMapper.toDto(updatedDm);
    }

    /**
     * Agrega un NPC creado al DM
     */
    @Transactional
    public DungeonMasterDTO addCreatedNpcToDM(Long dmId, NonPlayerCharacter npc) {
        DungeonMaster dm = dungeonMasterRepository.findById(dmId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found with id: " + dmId));

        dm.createNpc(npc);
        DungeonMaster updatedDm = dungeonMasterRepository.save(dm);

        logger.info("[DM_SERVICE] NPC agregado al DM: {}", dmId);
        return dungeonMasterMapper.toDto(updatedDm);
    }

    /**
     * Agrega un NPC creado al DM por userId
     */
    @Transactional
    public DungeonMasterDTO addCreatedNpcToDMByUserId(Long userId, NonPlayerCharacter npc) {
        DungeonMaster dm = dungeonMasterRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found for user ID: " + userId));

        dm.createNpc(npc);
        DungeonMaster updatedDm = dungeonMasterRepository.save(dm);

        logger.info("[DM_SERVICE] NPC agregado al DM por userId: {}", userId);
        return dungeonMasterMapper.toDto(updatedDm);
    }

    /**
     * Agrega un item creado al DM
     */
    @Transactional
    public DungeonMasterDTO addCreatedItemToDM(Long dmId, Item item) {
        DungeonMaster dm = dungeonMasterRepository.findById(dmId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found with id: " + dmId));

        dm.createItem(item);
        DungeonMaster updatedDm = dungeonMasterRepository.save(dm);

        logger.info("[DM_SERVICE] Item agregado al DM: {}", dmId);
        return dungeonMasterMapper.toDto(updatedDm);
    }

    /**
     * Elimina un DM
     */
    @Transactional
    public void deleteDungeonMaster(Long dmId) {
        if (!dungeonMasterRepository.existsById(dmId)) {
            throw new NoSuchElementException("DungeonMaster not found with id: " + dmId);
        }

        dungeonMasterRepository.deleteById(dmId);
        logger.info("[DM_SERVICE] DM eliminado con ID: {}", dmId);
    }

    /**
     * Verifica si un DM existe por userId
     */
    public boolean existsByUserId(Long userId) {
        return dungeonMasterRepository.findByUserId(userId).isPresent();
    }

    /**
     * Verifica si un DM existe por ID
     */
    public boolean existsById(Long dmId) {
        return dungeonMasterRepository.existsById(dmId);
    }

    /**
     * Obtiene la instancia DungeonMaster si existe
     */
    public Optional<DungeonMaster> getDungeonMasterInstance(Long userId) {
        return dungeonMasterRepository.findByUserId(userId);
    }

    /**
     * Calcula estadísticas del DM
     */
    public DMStatsDTO getDMStats(Long dmId) {
        DungeonMaster dm = dungeonMasterRepository.findById(dmId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster not found with id: " + dmId));

        return DMStatsDTO.builder()
                .totalCampaigns(dm.getCampaigns().size())
                .activeCampaigns((int) dm.getCampaigns().stream()
                        .filter(campaign -> campaign.getIsActive() != null && campaign.getIsActive())
                        .count())
                .totalNpcsCreated(dm.getCreatedNpcs().size())
                .totalItemsCreated(dm.getCreatedItems().size())
                .rating(dm.getRating())
                .dmStyle(dm.getDmStyle())
                .build();
    }

    /**
     * Clase auxiliar para estadísticas del DM
     */
    @Data
    @Builder
    public static class DMStatsDTO {
        private int totalCampaigns;
        private int activeCampaigns;
        private int totalNpcsCreated;
        private int totalItemsCreated;
        private Float rating;
        private String dmStyle;
    }
}