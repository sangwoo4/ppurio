package free_capston.ppurio.Ppurio.Dto;

import lombok.Data;

import java.util.List;

@Data
public class GenerateMessageDto {
    private String text;
    private List<String> keyword;
    private String field;
    private  List<String> mood;
    private Long userId;
    private String category;
}
