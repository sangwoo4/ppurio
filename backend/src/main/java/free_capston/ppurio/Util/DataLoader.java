package free_capston.ppurio.Util;

import free_capston.ppurio.Repository.CategoryRepository;
import free_capston.ppurio.model.Category;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    ApplicationRunner initDate(CategoryRepository categoryRepository){
        return args -> {
            if(categoryRepository.count() == 0){
                categoryRepository.save(new Category("재난 경고"));
                categoryRepository.save(new Category("광고 및 홍보"));
                categoryRepository.save(new Category("일반 안내"));
                categoryRepository.save(new Category("정당 관련"));
                categoryRepository.save(new Category("증권 관련"));
                categoryRepository.save(new Category("실종"));
                categoryRepository.save(new Category("명함"));
                categoryRepository.save(new Category("건강 정보"));
            }
        };
    }
}
