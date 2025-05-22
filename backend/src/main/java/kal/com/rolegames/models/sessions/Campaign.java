package kal.com.rolegames.models.sessions;

import jakarta.persistence.*;
import kal.com.rolegames.models.characters.NonPlayerCharacter;
import kal.com.rolegames.models.characters.PlayerCharacter;
import kal.com.rolegames.models.users.DungeonMaster;
import kal.com.rolegames.models.users.Player;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "campaigns")
//lombok annotations
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(includeFieldNames = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "campaign_id")
    @EqualsAndHashCode.Include
    private Long campaignId;

    @Basic(optional = false)
    private String name;

    @Lob
    private String description;

    @ManyToOne
    @JoinColumn(name = "dm_id", nullable = false)
    private DungeonMaster dungeonMaster;

    @ManyToMany
    @JoinTable(
            name = "campaign_players",
            joinColumns = @JoinColumn(name = "campaign_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    private Set<Player> players = new HashSet<>();

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Session> sessions = new HashSet<>();

    @Temporal(TemporalType.DATE)
    private LocalDate startDate;

    @Temporal(TemporalType.DATE)
    private LocalDate endDate;

    private Boolean isActive;

    @Lob
    private String globalNotes;

    @ManyToMany
    @JoinTable(
            name = "campaign_important_npcs",
            joinColumns = @JoinColumn(name = "campaign_id"),
            inverseJoinColumns = @JoinColumn(name = "npc_id")
    )
    private Set<NonPlayerCharacter> importantNPCs = new HashSet<>();

    @OneToMany(mappedBy = "currentCampaign")
    private Set<PlayerCharacter> activeCharacters = new HashSet<>();

    @Version
    @Setter(AccessLevel.NONE)
    private Long version;

    public void addPlayer(Player player) {
        players.add(player);
    }

    public void removePlayer(Player player) {
        players.remove(player);
    }

    public void addSession(Session session) {
        sessions.add(session);
        session.setCampaign(this);
    }

    public void removeSession(Session session) {
        sessions.remove(session);
        session.setCampaign(null);
    }

    public void addImportantNPC(NonPlayerCharacter npc) {
        importantNPCs.add(npc);
    }

    public void removeImportantNPC(NonPlayerCharacter npc) {
        importantNPCs.remove(npc);
    }
}