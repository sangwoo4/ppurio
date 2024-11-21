package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.SendMessageDto;
import free_capston.ppurio.Repository.CategoryRepository;
import free_capston.ppurio.Repository.ImageRepository;
import free_capston.ppurio.Repository.MessageRepository;
import free_capston.ppurio.Repository.UserRepository;
import free_capston.ppurio.model.Category;
import free_capston.ppurio.model.Image;
import free_capston.ppurio.model.Message;
import free_capston.ppurio.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SaveService {

    private final MessageRepository messageRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public void saveMessageAndImage(SendMessageDto sendMessageDto) {
        // 사용자 정보 가져오기
        User user = userRepository.findById(sendMessageDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + sendMessageDto.getUserId()));

        // Message 엔티티 생성 및 저장
        Message message = buildMessageEntity(sendMessageDto, user);
        message = messageRepository.save(message); // 저장 후 ID가 설정됨

        // Image 엔티티 생성 및 저장
//        Message finalMessage = message;
//        sendMessageDto.getFiles().forEach(fileDto -> {
//            boolean imageExists = imageRepository.existsByMessageAndUrl(finalMessage, fileDto.getFileUrl());
//
//            if (!imageExists) { // 중복 확인
//                Image image = buildImageEntity(fileDto.getFileUrl(), finalMessage);
//                imageRepository.save(image); // Message와 연관된 Image 저장
//            }
//        });

        // Image 엔티티 생성 및 저장
        if (sendMessageDto.getFiles() != null && !sendMessageDto.getFiles().isEmpty()) {
            Message finalMessage = message;
            sendMessageDto.getFiles().forEach(fileDto -> {
                boolean imageExists = imageRepository.existsByMessageAndUrl(finalMessage, fileDto.getFileUrl());

                if (!imageExists) { // 중복 확인
                    Image image = buildImageEntity(fileDto.getFileUrl(), finalMessage);
                    imageRepository.save(image); // Message와 연관된 Image 저장
                }
            });
        } else {
            // Files가 null 또는 비어있을 때 로직 (필요하면 추가)
            System.out.println("No files provided for the message.");
        }

    }

    public Message buildMessageEntity(SendMessageDto sendMessageDto, User user) {
        // Category 이름으로 이미 존재하는 Category 엔티티 조회 (없으면 null 처리)
        Category categoryEntity = null;
        if (sendMessageDto.getCategory() != null && !sendMessageDto.getCategory().isEmpty()) {
            categoryEntity = categoryRepository.findByCategory(sendMessageDto.getCategory())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + sendMessageDto.getCategory()));
        }

        // Message 객체 빌드
        return Message.builder()
                .messageContent(sendMessageDto.getContent()) // SendMessageDto에서 content 가져옴
                .user(user) // 전달받은 User 객체
                .prompt(sendMessageDto.getPrompt()) // SendMessageDto에서 prompt 가져옴
                .category(categoryEntity) // categoryEntity가 null일 수도 있음
                .build();
    }

    // Image 엔티티 생성
    private Image buildImageEntity(String fileUrl, Message message) {
        return Image.builder()
                .url(fileUrl)
                .message(message) // Message와 관계 설정
                .build();
    }
}