package free_capston.ppurio.Dto;

import lombok.Data;

import java.util.List;

@Data
public class GenerateMessageDto {
    private String text;
    private List<String> hashTag;
    private String field;
    private  List<String> mood;
    private Long userId;
}
