package free_capston.ppurio.Ppurio;

import free_capston.ppurio.Dto.SendMessageDto;
import free_capston.ppurio.Repository.ImageRepository;
import free_capston.ppurio.Repository.MessageRepository;
import free_capston.ppurio.Repository.UserRepository;
import free_capston.ppurio.model.Image;
import free_capston.ppurio.model.Message;
import free_capston.ppurio.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SaveService {

    private final MessageRepository messageRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    public void saveMessageAndImage(SendMessageDto sendMessageDto) {
        // userId로 User 엔티티 조회
        User user = userRepository.findById(sendMessageDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + sendMessageDto.getUserId()));

        // 이미지 URL을 저장하고 Image 엔티티 리스트를 생성
        Set<Image> images = new HashSet<>();
        sendMessageDto.getFiles().forEach(fileDto -> {
            Image image = buildImageEntity(fileDto.getFileUrl());
            imageRepository.save(image); // Image 엔티티 저장
            images.add(image);           // 이미지 리스트에 추가
        });

        // Message 엔티티 생성 및 저장
        Message message = buildMessageEntity(sendMessageDto.getContent(), user, images);
        messageRepository.save(message);
    }

    // 이미지 URL을 기반으로 Image 엔티티 빌드
    private Image buildImageEntity(String fileUrl) {
        return Image.builder()
                .url(fileUrl)
                .build();
    }

    // 메시지 내용과 사용자, 이미지를 기반으로 Message 엔티티 빌드
    private Message buildMessageEntity(String content, User user, Set<Image> images) {
        return Message.builder()
                .messageContent(content)
                .user(user)    // User 엔티티 설정
                .images(images) // Message와 Image 관계 설정
                .build();
    }
}