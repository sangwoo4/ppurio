package free_capston.ppurio.Account;

import free_capston.ppurio.Dto.LoginDto;
import free_capston.ppurio.Dto.ResponseDto;
import free_capston.ppurio.Dto.SignUpDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController

@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/signup")
    public ResponseDto<?> signUp(@RequestBody SignUpDto signUpDto){
        ResponseDto<?> result = accountService.signUp(signUpDto);
        return result;
    }

    @PostMapping("/login")
    public ResponseDto<?> login(@RequestBody LoginDto loginDto){
        ResponseDto<?> result = accountService.login(loginDto);
        return result;
    }

}
