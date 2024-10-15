package free_capston.ppurio.Account;

import free_capston.ppurio.Dto.LoginDto;
import free_capston.ppurio.Dto.ResponseDto;
import free_capston.ppurio.Dto.SignUpDto;
import free_capston.ppurio.Repository.UserRepository;
import free_capston.ppurio.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AccountService {
    private final UserRepository userRepository;
    @Transactional
    public ResponseDto<?> signUp(SignUpDto signUpDto){
        User user = buildUserEntity(signUpDto);
        userRepository.save(user);
        return ResponseDto.setSuccess("회원 생성 성공");
    }

    @Transactional(readOnly = true)
    public ResponseDto<?> login(LoginDto loginDto){
        Optional<User> user = userRepository.findByEmail(loginDto.getEmail());
        if (!user.isPresent()) {
            return ResponseDto.setFailed("해당 이메일의 사용자가 존재하지 않습니다.");
        }
        Boolean loginResult = matchingPassword(user.get().getPassword(), loginDto.getPassword());
        if(loginResult) return ResponseDto.setSuccess("로그인 성공");
        else return ResponseDto.setFailed("로그인 실패");
    }

    public Boolean matchingPassword(String userPassword, String loginPassword){
        return userPassword.equals(loginPassword);
    }

    private User buildUserEntity(SignUpDto signUpDto){
        return User.builder()
                .email(signUpDto.getEmail())
                .password(signUpDto.getPassword())
                .field(signUpDto.getField())
                .owner(signUpDto.getOwner())
                .ownerNum(signUpDto.getOwnerNum())
                .businessNum(signUpDto.getBusinessNum())
                .companyName(signUpDto.getCompanyName())
                .build();
    }
}
