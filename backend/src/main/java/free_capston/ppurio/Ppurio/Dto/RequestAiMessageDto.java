package free_capston.ppurio.Ppurio.Dto;

import lombok.Data;

import java.util.List;

@Data
public class RequestAiMessageDto {
    private String text;
    private List<String> keyword;
    private String field;
    private String category;
    private  List<String> mood;
}
