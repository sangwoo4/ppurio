package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.RequestAiMessageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiTextAndMessageDto;
import free_capston.ppurio.Ppurio.MessageGenerationStrategy;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@AllArgsConstructor
@Service
public class TestAndMessageGenerationStrategy implements MessageGenerationStrategy<ResponseAiTextAndMessageDto> {
    private final RestTemplate restTemplate;


    @Override
    public ResponseAiTextAndMessageDto generateMessage(RequestAiMessageDto requestAiMessageDto, String apiUrl) {
        ResponseEntity<ResponseAiTextAndMessageDto> responseEntity = restTemplate.postForEntity(apiUrl, requestAiMessageDto, ResponseAiTextAndMessageDto.class);
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode());
        }
    }
}
