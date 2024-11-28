package free_capston.ppurio.Ppurio.Dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.Map;

import java.util.List;
import java.util.PrimitiveIterator;

@Data
public class SendMessageDto {
    private String account;
    private String messageType;
    private String content;
    private String rejectType;
    private int targetCount;
    private List<TargetDto> targets = new ArrayList<>(); // 기본값 설정
    private List<FileDto> files = new ArrayList<>();     // 기본값 설정
    private Long userId;
    private String prompt;
    private String category;
    // private String from;
    //private String refKey;
    //private String duplicateFlag;
    @Data
    public static class TargetDto {
        private String to;
        private String name;
        //private Map<String, String> changeWord;
    }
}
