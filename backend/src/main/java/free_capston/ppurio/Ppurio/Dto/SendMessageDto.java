package free_capston.ppurio.Ppurio.Dto;

import lombok.Data;
import java.util.Map;

import java.util.List;

@Data
public class SendMessageDto {
    private String account;
    private String messageType;
    //private String from;
    private String content;
    private String duplicateFlag;
    private String rejectType;
    private int targetCount;
    private List<TargetDto> targets;
    private List<FileDto> files;
    private String refKey;
    private Long userId;
    @Data
    public static class TargetDto {
        private String to;
        private String name;
        private Map<String, String> changeWord;
    }

}
