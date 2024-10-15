package free_capston.ppurio.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import org.w3c.dom.Text;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "message")
@NoArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "image_id", nullable = false)
    private Image image;

    @Column(columnDefinition = "TEXT")
    private String messageContent;
}
