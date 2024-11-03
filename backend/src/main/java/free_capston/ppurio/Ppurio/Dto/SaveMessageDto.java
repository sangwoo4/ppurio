package free_capston.ppurio.Ppurio.Dto;

import lombok.Data;

import java.awt.*;

@Data
public class SaveMessageDto {
    Long userId;
    Long messageId;
    String messageContent;
}
