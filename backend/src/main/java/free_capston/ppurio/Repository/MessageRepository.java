package free_capston.ppurio.Repository;

import free_capston.ppurio.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

}
