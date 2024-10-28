package free_capston.ppurio.Dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.Data;

@Data
public class FileDto {
    private String fileUrl;

    // 필요한 경우 추가 필드 예시
    // private String fileName;
    // private long fileSize;
    @JsonCreator
    public FileDto(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}