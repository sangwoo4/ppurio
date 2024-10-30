package free_capston.ppurio.Ppurio;

import free_capston.ppurio.Dto.*;
import free_capston.ppurio.Ppurio.Dto.*;
import free_capston.ppurio.Ppurio.Service.ImageService;
import free_capston.ppurio.Ppurio.Service.MessageService;
import free_capston.ppurio.Ppurio.Service.RequestService;
import free_capston.ppurio.Ppurio.Service.SaveService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/message")
public class MessageController {
    private final RequestService requestService;
    private final SaveService saveService;
    private final ImageService imageService;
    private final MessageService messageService;

    @PostMapping("/send")
    public ResponseDto<?> sendMessage(@RequestBody SendMessageDto sendMessageDto) {
        List<String> newUrls = imageService.changeUrlAndUploadImages(sendMessageDto); //새로운 url을 생성 후 s3에 업로드
        SendMessageDto newSendMessageDto = imageService.updateFileUrls(sendMessageDto, newUrls); //변경된 url로 dto 수정
        requestService.requestSend(newSendMessageDto);
        saveService.saveMessageAndImage(newSendMessageDto);

        return ResponseDto.setSuccess("메세지 전송 성공");
    }

    @PostMapping("/generate/text")
    public ResponseDto<?> generateText(@RequestBody GenerateMessageDto generateMessageDto){
        ResponseAiTextDto responseAiTextDto = messageService.generateAiText(generateMessageDto);
        return ResponseDto.setSuccessData("메세지 생성 성공", responseAiTextDto);
    }

    @PostMapping("/generate/image")
    public ResponseDto<?> generateTextAndMessage(@RequestBody GenerateMessageDto generateMessageDto){
        ResponseAiTextAndMessageDto responseAiTextDto = messageService.generateAiTextAndMessage(generateMessageDto);
        return ResponseDto.setSuccessData("메세지, 이미지 생성 성공", responseAiTextDto);
    }
}