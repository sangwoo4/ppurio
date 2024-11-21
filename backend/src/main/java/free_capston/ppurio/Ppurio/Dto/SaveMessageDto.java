package free_capston.ppurio.Ppurio.Dto;

import lombok.Data;
import org.w3c.dom.Text;

import java.awt.*;

@Data
public class SaveMessageDto {
    Long userId;
    Long messageId;
    Long categoryId;
    String messageContent;
    String prompt;
}
