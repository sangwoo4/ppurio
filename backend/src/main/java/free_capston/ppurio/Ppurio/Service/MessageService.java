package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.*;
import free_capston.ppurio.Ppurio.MessageGenerationStrategy;
import free_capston.ppurio.Repository.UserRepository;
import free_capston.ppurio.model.User;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final UserRepository userRepository;
    private final MessageGenerationStrategy<ResponseAiTextDto> textStrategy;
    private final MessageGenerationStrategy<ResponseAiTextAndMessageDto> textAndMessageStrategy;
    private final MessageGenerationStrategy<ResponseAiImageDto> imageStrategy;
//    private final String AiTextUrl = "http://localhost:8000/text";
//    private final String AiTextAndImageUrl = "http://localhost:8000/image";

    @Value("${ai.text-url}")
    private String aiTextUrl;

    @Value("${ai.image-url}")
    private String aiImageUrl;

    @Value("${ai.text-and-image-url}")
    private String aiTextAndImageUrl;


    public ResponseAiTextDto generateAiText(GenerateMessageDto generateMessageDto) throws Exception {
        RequestAiMessageDto requestAiMessageDto = setRequestAiMessageDto(new RequestAiMessageDto(), generateMessageDto);
        return textStrategy.generateMessage(requestAiMessageDto, aiTextUrl);
    }

    public ResponseAiImageDto generateAiImage(GenerateMessageDto generateMessageDto) throws Exception {
        RequestAiMessageDto requestAiMessageDto = setRequestAiMessageDto(new RequestAiMessageDto(), generateMessageDto);
        return imageStrategy.generateMessage(requestAiMessageDto, aiImageUrl);
    }

    public ResponseAiTextAndMessageDto generateAiTextAndImage(GenerateMessageDto generateMessageDto) throws Exception {
        RequestAiMessageDto requestAiMessageDto = setRequestAiMessageDto(new RequestAiMessageDto(), generateMessageDto);
        return textAndMessageStrategy.generateMessage(requestAiMessageDto, aiTextAndImageUrl);
    }


    private RequestAiMessageDto setRequestAiMessageDto(RequestAiMessageDto requestAiMessageDto, GenerateMessageDto generateMessageDto) {
        User user = userRepository.findById(generateMessageDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + generateMessageDto.getUserId()));
        requestAiMessageDto.setText(generateMessageDto.getText());
        requestAiMessageDto.setField(user.getField());
        requestAiMessageDto.setMood(generateMessageDto.getMood());
        requestAiMessageDto.setKeyword(generateMessageDto.getKeyword());
        requestAiMessageDto.setCategory(generateMessageDto.getCategory());
        return requestAiMessageDto;
    }
}