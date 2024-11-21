package free_capston.ppurio;


import free_capston.ppurio.Account.Dto.SignUpDto;
import free_capston.ppurio.Util.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/categories")
    public ResponseEntity<ResponseDto<?>> getCategories() {
        ResponseDto<?> result = categoryService.getAllCategories();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
