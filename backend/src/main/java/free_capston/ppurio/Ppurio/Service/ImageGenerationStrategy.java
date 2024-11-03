package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.RequestAiMessageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiImageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiTextDto;
import free_capston.ppurio.Ppurio.MessageGenerationStrategy;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@AllArgsConstructor
@Service
public class ImageGenerationStrategy implements MessageGenerationStrategy<ResponseAiImageDto> {
    private final RestTemplate restTemplate;

    @Override
    public ResponseAiImageDto generateMessage(RequestAiMessageDto requestAiMessageDto, String apiUrl) {
        System.out.println("전송할 요청 DTO: " + requestAiMessageDto); // 요청 DTO 로그
        ResponseEntity<ResponseAiImageDto> responseEntity = restTemplate.postForEntity(apiUrl, requestAiMessageDto, ResponseAiImageDto.class);
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode());
        }
    }
}
