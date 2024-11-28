package free_capston.ppurio;

import free_capston.ppurio.Repository.CategoryRepository;
import free_capston.ppurio.Util.ResponseDto;
import free_capston.ppurio.model.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public ResponseDto<List<String>> getAllCategories() {
        List<Category> allCategories = categoryRepository.findAll();

        // Category 엔티티에서 name 필드만 추출하여 List<String>으로 변환
        List<String> categoryNames = allCategories.stream()
                .map(Category::getCategory)  // Category 엔티티에서 이름만 추출
                .collect(Collectors.toList());

        // 성공적인 응답 반환
        return ResponseDto.setSuccessData("카테고리 조회 성공", categoryNames);
    }
}
