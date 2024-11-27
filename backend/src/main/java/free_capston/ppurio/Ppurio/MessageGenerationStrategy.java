package free_capston.ppurio.Ppurio;

import free_capston.ppurio.Ppurio.Dto.RequestAiMessageDto;

public interface MessageGenerationStrategy<T> {
    T generateMessage(RequestAiMessageDto requestAiMessageDto, String apiUrl) throws Exception;
}
