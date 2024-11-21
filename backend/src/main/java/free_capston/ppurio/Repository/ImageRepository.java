package free_capston.ppurio.Repository;

import free_capston.ppurio.model.Image;
import free_capston.ppurio.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    boolean existsByMessageAndUrl(Message message, String url);
}
