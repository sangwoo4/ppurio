package free_capston.ppurio.Dto;

import lombok.Data;

import java.awt.*;

@Data
public class SaveMessageDto {
    Long userId;
    Long messageId;
    String messageContent;
}
