package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.GenerateMessageDto;
import free_capston.ppurio.Ppurio.Dto.RequestAiMessageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiTextAndMessageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiTextDto;
import free_capston.ppurio.Ppurio.MessageGenerationStrategy;
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
    private final MessageGenerationStrategy<ResponseAiTextDto> textMessageStrategy;
    private final MessageGenerationStrategy<ResponseAiTextAndMessageDto> textAndMessageStrategy;
//    private final String AiTextUrl = "http://localhost:8000/text";
//    private final String AiTextAndImageUrl = "http://localhost:8000/image";
    private final String AiTextUrl = "http://fastapi:8000/text";
    private final String AiTextAndImageUrl = "http://fastapi:8000/image";
    public ResponseAiTextDto generateAiText(GenerateMessageDto generateMessageDto) {
        RequestAiMessageDto requestAiMessageDto = setRequestAiMessageDto(new RequestAiMessageDto(), generateMessageDto);
        return textMessageStrategy.generateMessage(requestAiMessageDto, AiTextUrl);
    }

    public ResponseAiTextAndMessageDto generateAiTextAndMessage(GenerateMessageDto generateMessageDto) {
        RequestAiMessageDto requestAiMessageDto = setRequestAiMessageDto(new RequestAiMessageDto(), generateMessageDto);
        return textAndMessageStrategy.generateMessage(requestAiMessageDto, AiTextAndImageUrl);
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