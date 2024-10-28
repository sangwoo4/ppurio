package free_capston.ppurio.Ppurio;

import free_capston.ppurio.Dto.ResponseDto;
import free_capston.ppurio.Dto.SendMessageDto;
import free_capston.ppurio.model.Message;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class MessageController {
    private final RequestService requestService;
    private final SaveService saveService;
    private final ImageService imageService;

    @PostMapping("/send-message")
    public ResponseDto<?> sendMessage(@RequestBody SendMessageDto sendMessageDto) {
        List<String> newUrls = imageService.changeUrlAndUploadImages(sendMessageDto); //새로운 url을 생성 후 s3에 업로드
        SendMessageDto newSendMessageDto = imageService.updateFileUrls(sendMessageDto, newUrls); //변경된 url로 dto 수정
        requestService.requestSend(newSendMessageDto);
        saveService.saveMessageAndImage(newSendMessageDto);

        return ResponseDto.setSuccess("메세지 전송 성공");
    }
}