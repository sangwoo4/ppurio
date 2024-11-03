package free_capston.ppurio.Ppurio.Dto;

import lombok.Data;

import java.util.List;

@Data
public class GenerateMessageDto {
    private String text;
    private List<String> hashtag;
    private String field;
    private  List<String> mood;
    private Long userId;
}
