package free_capston.ppurio.Dto;

import lombok.Data;

@Data
public class LoginResponseDto {
    private Long userId;

    public LoginResponseDto(Long userId){
        this.userId = userId;
    }

}
