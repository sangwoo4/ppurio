package free_capston.ppurio.Ppurio;

import free_capston.ppurio.Dto.GenerateMessageDto;
import free_capston.ppurio.Dto.RequestAiMessageDto;
import free_capston.ppurio.Dto.ResponseAiTextAndMessageDto;
import free_capston.ppurio.Dto.ResponseAiTextDto;
import free_capston.ppurio.Repository.UserRepository;
import free_capston.ppurio.model.User;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
public class MessageService {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final String AiTextUrl = "http://localhost:8000/text";
    private final String AiTextAndImageUrl = "http://localhost:8000/text";

    public ResponseAiTextDto generateAiText(GenerateMessageDto generateMessageDto) {
        RequestAiMessageDto requestAiMessageDto = setRequestAiMessageDto(new RequestAiMessageDto(), generateMessageDto);
        System.out.println("requestAiMessageDto" + requestAiMessageDto);
        ResponseEntity<ResponseAiTextDto> responseEntity = restTemplate.postForEntity(AiTextUrl, requestAiMessageDto, ResponseAiTextDto.class);

        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode());
        }
    }

    public ResponseAiTextAndMessageDto generateAiTextAndMessage(GenerateMessageDto generateMessageDto) {
        RequestAiMessageDto requestAiMessageDto = setRequestAiMessageDto(new RequestAiMessageDto(), generateMessageDto);
        System.out.println("requestAiMessageDto" + requestAiMessageDto);
        ResponseEntity<ResponseAiTextAndMessageDto> responseEntity = restTemplate.postForEntity(AiTextAndImageUrl, requestAiMessageDto, ResponseAiTextAndMessageDto.class);

        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            return responseEntity.getBody();
        } else {
            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode());
        }
    }

    private RequestAiMessageDto setRequestAiMessageDto(RequestAiMessageDto requestAiMessageDto, GenerateMessageDto generateMessageDto) {
        User user = userRepository.findById(generateMessageDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + generateMessageDto.getUserId()));
        requestAiMessageDto.setText(generateMessageDto.getText());
        requestAiMessageDto.setField(user.getField());
        requestAiMessageDto.setMood(generateMessageDto.getMood());
        requestAiMessageDto.setHashTag(generateMessageDto.getHashTag());
        return requestAiMessageDto;
    }
}