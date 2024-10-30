package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.RequestAiMessageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiTextDto;
import free_capston.ppurio.Ppurio.MessageGenerationStrategy;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
class TextMessageGenerationStrategy implements MessageGenerationStrategy<ResponseAiTextDto> {
    private final RestTemplate restTemplate;

    @Override
    public ResponseAiTextDto generateMessage(RequestAiMessageDto requestAiMessageDto, String apiUrl) {
        ResponseEntity<ResponseAiTextDto> responseEntity = restTemplate.postForEntity(apiUrl, requestAiMessageDto, ResponseAiTextDto.class);
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode());
        }
    }
}