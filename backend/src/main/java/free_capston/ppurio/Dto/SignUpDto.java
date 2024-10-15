package free_capston.ppurio.Dto;

import lombok.Data;

@Data
public class SignUpDto {
    private Long userId;
    private Integer businessNum;
    private String email;
    private String password;
    private String owner;
    private String field;
    private String ownerNum;
    private String companyName;
}
