package free_capston.ppurio.Repository;

import free_capston.ppurio.model.Category;
import free_capston.ppurio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategory(String category);
}
