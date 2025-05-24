package kal.com.rolegames.services.users;

import jakarta.transaction.Transactional;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.items.Item;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.users.DungeonMasterRepository;
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
    private final static Logger logger = LoggerFactory.getLogger(DungeonMasterService.class);

    /**
     * Encuentra un DM por su ID de usuario
     */
    public Optional<DungeonMaster> findByUserId(Long userId) {
        return dungeonMasterRepository.findByUserId(userId);
    }

    /**
     * Obtiene un DM por su ID de usuario, lanza excepción si no existe
     */
    public DungeonMaster getByUserId(Long userId) {
        return dungeonMasterRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster no encontrado con user ID: " + userId));
    }

    /**
     * Encuentra un DM por su ID
     */
    public Optional<DungeonMaster> findById(Long dmId) {
        return dungeonMasterRepository.findById(dmId);
    }

    /**
     * Obtiene un DM por su ID, lanza excepción si no existe
     */
    public DungeonMaster getById(Long dmId) {
        return dungeonMasterRepository.findById(dmId)
                .orElseThrow(() -> new NoSuchElementException("DungeonMaster no encontrado con ID: " + dmId));
    }

    /**
     * Crea un nuevo DM a partir de un usuario existente
     */
    @Transactional
    public DungeonMaster createDungeonMasterFromUser(User user) {
//        if (user.getUserType() != UserType.DUNGEON_MASTER) {
//            throw new IllegalArgumentException("User must be of type DUNGEON_MASTER");
//        }

        logger.info("[SERVICE] [DM] Creando dm a partir del usuario: {}", user);
        if (dungeonMasterRepository.findByUserId(user.getUserId()).isPresent()) {
            throw new IllegalStateException("DungeonMaster already exists for this user");
        }

        DungeonMaster dm = DungeonMaster.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .userType(user.getUserType())
                .createdAt(user.getCreatedAt())
//                .version(user.getVersion())
                .dmStyle("Standard")
                .rating(0.0f)
                .build();
        logger.info("[SERVICE] [DM] Dm craedo: {}", dm);
        DungeonMaster dmCreated = null;
        try{
            dmCreated = dungeonMasterRepository.save(dm);
        }catch(Exception exc){
            logger.info("Error {}: {}", exc.getCause(), exc.getMessage());
        }
        return dmCreated;
    }

    /**
     * Obtiene todos los DMs
     */
    public List<DungeonMaster> getAllDungeonMasters() {
        return dungeonMasterRepository.findAll();
    }

    /**
     * Agrega una campaña al DM
     */
    @Transactional
    public DungeonMaster addCampaignToDM(Long dmId, Campaign campaign) {
        DungeonMaster dm = getById(dmId);
        dm.addCampaign(campaign);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Agrega una campaña al DM por userId
     */
    @Transactional
    public DungeonMaster addCampaignToDMByUserId(Long userId, Campaign campaign) {
        DungeonMaster dm = getByUserId(userId);
        dm.addCampaign(campaign);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Remueve una campaña del DM
     */
    @Transactional
    public DungeonMaster removeCampaignFromDM(Long dmId, Campaign campaign) {
        DungeonMaster dm = getById(dmId);
        dm.removeCampaign(campaign);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Agrega un NPC creado al DM
     */
    @Transactional
    public DungeonMaster addCreatedNpcToDM(Long dmId, NonPlayerCharacter npc) {
        DungeonMaster dm = getById(dmId);
        dm.createNpc(npc);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Agrega un NPC creado al DM por userId
     */
    @Transactional
    public DungeonMaster addCreatedNpcToDMByUserId(Long userId, NonPlayerCharacter npc) {
        DungeonMaster dm = getByUserId(userId);
        dm.createNpc(npc);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Agrega un item creado al DM
     */
    @Transactional
    public DungeonMaster addCreatedItemToDM(Long dmId, Item item) {
        DungeonMaster dm = getById(dmId);
        dm.createItem(item);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Agrega un item creado al DM por userId
     */
    @Transactional
    public DungeonMaster addCreatedItemToDMByUserId(Long userId, Item item) {
        DungeonMaster dm = getByUserId(userId);
        dm.createItem(item);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Obtiene todas las campañas de un DM
     */
    public List<Campaign> getDMCampaigns(Long dmId) {
        DungeonMaster dm = getById(dmId);
        return dm.getCampaigns().stream().toList();
    }

    /**
     * Obtiene todas las campañas de un DM por userId
     */
    public List<Campaign> getDMCampaignsByUserId(Long userId) {
        DungeonMaster dm = getByUserId(userId);
        return dm.getCampaigns().stream().toList();
    }

    /**
     * Obtiene todos los NPCs creados por un DM
     */
    public List<NonPlayerCharacter> getDMCreatedNpcs(Long dmId) {
        DungeonMaster dm = getById(dmId);
        return dm.getCreatedNpcs().stream().toList();
    }

    /**
     * Obtiene todos los NPCs creados por un DM por userId
     */
    public List<NonPlayerCharacter> getDMCreatedNpcsByUserId(Long userId) {
        DungeonMaster dm = getByUserId(userId);
        return dm.getCreatedNpcs().stream().toList();
    }

    /**
     * Obtiene todos los items creados por un DM
     */
    public List<Item> getDMCreatedItems(Long dmId) {
        DungeonMaster dm = getById(dmId);
        return dm.getCreatedItems().stream().toList();
    }

    /**
     * Obtiene todos los items creados por un DM por userId
     */
    public List<Item> getDMCreatedItemsByUserId(Long userId) {
        DungeonMaster dm = getByUserId(userId);
        return dm.getCreatedItems().stream().toList();
    }

    /**
     * Actualiza el estilo de DM
     */
    @Transactional
    public DungeonMaster updateDMStyle(Long dmId, String newStyle) {
        DungeonMaster dm = getById(dmId);
        dm.setDmStyle(newStyle);
        return dungeonMasterRepository.save(dm);
    }

    /**
     * Actualiza la calificación del DM
     */
    @Transactional
    public DungeonMaster updateDMRating(Long dmId, Float newRating) {
        DungeonMaster dm = getById(dmId);
        if (newRating < 0.0f || newRating > 5.0f) {
            throw new IllegalArgumentException("Rating must be between 0.0 and 5.0");
        }
        dm.setRating(newRating);
        return dungeonMasterRepository.save(dm);
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
     * Actualiza la información del DM
     */
    @Transactional
    public DungeonMaster updateDungeonMaster(DungeonMaster dungeonMaster) {
        if (!existsById(dungeonMaster.getUserId())) {
            throw new NoSuchElementException("DungeonMaster not found with ID: " + dungeonMaster.getUserId());
        }
        return dungeonMasterRepository.save(dungeonMaster);
    }

    /**
     * Elimina un DM
     */
    @Transactional
    public void deleteDungeonMaster(Long dmId) {
        if (!existsById(dmId)) {
            throw new NoSuchElementException("DungeonMaster not found with ID: " + dmId);
        }
        dungeonMasterRepository.deleteById(dmId);
    }

    /**
     * Calcula estadísticas del DM
     */
    public DMStats getDMStats(Long dmId) {
        DungeonMaster dm = getById(dmId);
        return DMStats.builder()
                .totalCampaigns(dm.getCampaigns().size())
                .activeCampaigns((int) dm.getCampaigns().stream().filter(Campaign::getIsActive).count())
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
    public static class DMStats {
        private int totalCampaigns;
        private int activeCampaigns;
        private int totalNpcsCreated;
        private int totalItemsCreated;
        private Float rating;
        private String dmStyle;
    }
}