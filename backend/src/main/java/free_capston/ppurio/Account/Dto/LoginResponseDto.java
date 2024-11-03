package free_capston.ppurio.Account.Dto;

import lombok.Data;

@Data
public class LoginResponseDto {
    private Long userId;

    public LoginResponseDto(Long userId){
        this.userId = userId;
    }

}
