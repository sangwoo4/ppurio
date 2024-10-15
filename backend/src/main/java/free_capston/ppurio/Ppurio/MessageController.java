package free_capston.ppurio.Ppurio;

import free_capston.ppurio.Dto.SendMessageDto;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class MessageController {

    private final RequestService requestService;


    @PostMapping("/send-message")
    public String sendMessage(@RequestBody SendMessageDto sendMessageDto) {
        requestService.requestSend(sendMessageDto);
        return "Message sent successfully!";
    }
}