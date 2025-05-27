package kal.com.rolegames.services.sessions;

import jakarta.transaction.Transactional;
import kal.com.rolegames.dto.sessions.SessionDTO;
import kal.com.rolegames.mappers.sessions.SessionMapper;
import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.sessions.Campaign;
import kal.com.rolegames.models.sessions.Session;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.users.Player;
import kal.com.rolegames.models.users.User;
import kal.com.rolegames.models.util.UserType;
import kal.com.rolegames.repositories.characters.PlayerCharacterRepository;
import kal.com.rolegames.repositories.sessions.CampaignRepository;
import kal.com.rolegames.repositories.sessions.SessionRepository;
import kal.com.rolegames.repositories.users.DungeonMasterRepository;
import kal.com.rolegames.repositories.users.PlayerRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor=@__({@Autowired}))
public class SessionService {

    private final SessionRepository sessionRepository;
    private final CampaignRepository campaignRepository;
    private final PlayerRepository playerRepository;
    private final DungeonMasterRepository dungeonMasterRepository;
    private final PlayerCharacterRepository characterRepository;
    private final SessionMapper sessionMapper;

    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    public List<SessionDTO> getAllSessions(User user) {
        //refactorizar para hacer usar el mapper (todavia no implementado)
        Long id = user.getUserId();

        if(user.getUserType() == UserType.PLAYER){
            Player player = playerRepository.findByUserId(id)
                    .orElseThrow(()->new NoSuchElementException("No existe el jugador"));
            return sessionRepository.findByAttendingPlayer(player.getPlayerId())
                    .stream()
                    .map(sessionMapper::toDTO)
                    .collect(Collectors.toList());
        }else if (user.getUserType() == UserType.DUNGEON_MASTER){

            DungeonMaster dm = dungeonMasterRepository.findByUserId(id)
                    .orElseThrow(()->new NoSuchElementException("No existe el jugador"));
            return sessionRepository.findByDungeonMaster(dm.getDungeonMasterId()
                    ).stream()
                    .map(sessionMapper::toDTO)
                    .collect(Collectors.toList());
        }

        throw new NoSuchElementException("No se encontraron campañas");
    }

    public List<SessionDTO> getSessionsByCampaign(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        return sessionMapper.toSessionListDto(new ArrayList<>(campaign.getSessions()));
    }

    public SessionDTO getSessionById(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));
        return mapToDetailedDTO(session);
    }

    @Transactional
    public SessionDTO createSession(SessionDTO dto, Long campaignId) {
        logger.info("[SESSION SERVICE] Creating session for campaign ID: {}", campaignId);

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new NoSuchElementException("Campaign not found"));

        Session session = sessionMapper.toEntity(dto);
        session.setCampaign(campaign);

        if (session.getSessionNumber() == null) {
            int nextSessionNumber = campaign.getSessions().size() + 1;
            session.setSessionNumber(nextSessionNumber);
        }

        campaign.addSession(session);
        Session savedSession = sessionRepository.save(session);

        logger.info("[SESSION SERVICE] Session created successfully with ID: {}", savedSession.getSessionId());
        return mapToDetailedDTO(savedSession);
    }

    @Transactional
    public SessionDTO updateSession(Long sessionId, SessionDTO dto) {
        Session existingSession = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        sessionMapper.updateSessionFromDto(dto, existingSession);
        Session updatedSession = sessionRepository.save(existingSession);
        return mapToDetailedDTO(updatedSession);
    }

    @Transactional
    public void deleteSession(Long sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw new NoSuchElementException("Session not found");
        }
        sessionRepository.deleteById(sessionId);
    }

    @Transactional
    public SessionDTO addPlayerToSession(Long sessionId, Long playerId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found"));

        session.addAttendingPlayer(player);
        Session updatedSession = sessionRepository.save(session);
        return mapToDetailedDTO(updatedSession);
    }

    @Transactional
    public SessionDTO removePlayerFromSession(Long sessionId, Long playerId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new NoSuchElementException("Player not found"));

        session.removeAttendingPlayer(player);
        Session updatedSession = sessionRepository.save(session);
        return mapToDetailedDTO(updatedSession);
    }

    @Transactional
    public SessionDTO addCharacterToSession(Long sessionId, Long characterId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        PlayerCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new NoSuchElementException("Character not found"));

        session.addAttendingCharacter(character);
        Session updatedSession = sessionRepository.save(session);
        return mapToDetailedDTO(updatedSession);
    }

    @Transactional
    public SessionDTO removeCharacterFromSession(Long sessionId, Long characterId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        PlayerCharacter character = characterRepository.findById(characterId)
                .orElseThrow(() -> new NoSuchElementException("Character not found"));

        session.removeAttendingCharacter(character);
        Session updatedSession = sessionRepository.save(session);
        return mapToDetailedDTO(updatedSession);
    }

    @Transactional
    public SessionDTO swapCharacterInSession(Long sessionId, Long newCharacterId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found"));

        PlayerCharacter newCharacter = characterRepository.findById(newCharacterId)
                .orElseThrow(() -> new NoSuchElementException("Character not found"));

        session.swapAttendingCharacter(newCharacter);
        Session updatedSession = sessionRepository.save(session);
        return mapToDetailedDTO(updatedSession);
    }

    private SessionDTO mapToDetailedDTO(Session session) {
        SessionDTO dto = sessionMapper.toDTO(session);

        dto.setAttendingPlayerIds(session.getAttendingPlayers().stream()
                .map(Player::getPlayerId)
                .collect(Collectors.toSet()));
        dto.setAttendingPlayerNames(session.getAttendingPlayers().stream()
                .map(Player::getUsername)
                .collect(Collectors.toSet()));

        dto.setAttendingCharacterIds(session.getAttendingCharacters().stream()
                .map(PlayerCharacter::getCharacterId)
                .collect(Collectors.toSet()));
        dto.setAttendingCharacterNames(session.getAttendingCharacters().stream()
                .map(PlayerCharacter::getName)
                .collect(Collectors.toSet()));

        dto.setEncounterIds(session.getEncountersCompleted().stream()
                .map(encounter -> encounter.getEncounterId())
                .collect(Collectors.toSet()));

        return dto;
    }
}