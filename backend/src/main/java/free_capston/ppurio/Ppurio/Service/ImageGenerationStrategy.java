package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.RequestAiMessageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiImageDto;
import free_capston.ppurio.Ppurio.Dto.ResponseAiTextDto;
import free_capston.ppurio.Ppurio.MessageGenerationStrategy;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.io.InputStream;
import java.net.URL;
import java.util.Base64;
import org.springframework.util.StreamUtils;


@AllArgsConstructor
@Service
public class ImageGenerationStrategy implements MessageGenerationStrategy<ResponseAiImageDto> {
    private final RestTemplate restTemplate;

    @Override
//    public ResponseAiImageDto generateMessage(RequestAiMessageDto requestAiMessageDto, String apiUrl) {
//        System.out.println("apiUrl" + apiUrl);
//        System.out.println("전송할 요청 DTO: " + requestAiMessageDto); // 요청 DTO 로그
//        ResponseEntity<ResponseAiImageDto> responseEntity = restTemplate.postForEntity(apiUrl, requestAiMessageDto, ResponseAiImageDto.class);
//        System.out.println("responseEntity" + responseEntity);
//        if (responseEntity.getStatusCode().is2xxSuccessful()) {
//            return responseEntity.getBody();
//        } else {
//            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode());
//        }
//    }
//    public ResponseAiImageDto generateMessage(RequestAiMessageDto requestAiMessageDto, String apiUrl) {
//        System.out.println("apiUrl: " + apiUrl);
//        System.out.println("전송할 요청 DTO: " + requestAiMessageDto); // 요청 DTO 로그
//
//        ResponseEntity<ResponseAiImageDto> responseEntity = restTemplate.postForEntity(apiUrl, requestAiMessageDto, ResponseAiImageDto.class);
//        System.out.println("responseEntity: " + responseEntity);
//
//        if (responseEntity.getStatusCode().is2xxSuccessful()) {
//            ResponseAiImageDto responseAiImageDto = responseEntity.getBody();
//
//            // 새로운 S3 URL 생성
//            String s3Url = "data:image/webp;base64,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";
//            System.out.println("변경 전 URL: " + responseAiImageDto.getUrl());
//
//            // URL 변경
//            responseAiImageDto.setUrl(s3Url);
//            System.out.println("변경 후 URL: " + responseAiImageDto.getUrl());
//
//            return responseAiImageDto;
//        } else {
//            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode());
//        }
//    }

    public ResponseAiImageDto generateMessage(RequestAiMessageDto requestAiMessageDto, String apiUrl) throws Exception {
//        System.out.println("apiUrl: " + apiUrl);
//        System.out.println("전송할 요청 DTO: " + requestAiMessageDto); // 요청 DTO 로그

        ResponseEntity<ResponseAiImageDto> responseEntity = restTemplate.postForEntity(apiUrl, requestAiMessageDto, ResponseAiImageDto.class);
        System.out.println("responseEntity: " + responseEntity);

        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            ResponseAiImageDto responseAiImageDto = responseEntity.getBody();

            // 새로운 S3 URL 생성
            String s3Url = responseAiImageDto.getUrl();
            String newUrl = convertUrlToBase64(s3Url);

            // URL 변경
            responseAiImageDto.setUrl(newUrl);
            String url = responseAiImageDto.getUrl();

            if (url != null && url.length() > 20) {
                String shortenedUrl = url.substring(0, 20) + "..." + url.substring(url.length() - 20);
                System.out.println("변경 후 URL: " + shortenedUrl);
            } else {
                System.out.println("변경 후 URL: " + url);
            }

            return responseAiImageDto;
        } else {
            // 실패 시 구체적인 예외 처리
            throw new RuntimeException("AI 메시지 요청 실패: " + responseEntity.getStatusCode() + ", 응답 본문: " + responseEntity.getBody());
        }
    }


    public String convertUrlToBase64(String imageUrl) throws Exception {
        try {
            // 이미지 URL을 읽어들여 InputStream으로 가져옵니다.
            URL url = new URL(imageUrl);
            try (InputStream inputStream = url.openStream()) {
                // InputStream을 byte[]로 변환
                byte[] imageBytes = StreamUtils.copyToByteArray(inputStream);

                // byte[]를 base64로 인코딩하여 반환
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);

                // 해당 이미지 형식에 맞는 data URL 형식으로 변경 (예: image/webp)
                String dataUrl = "data:image/jpeg;base64," + base64Image;
                return dataUrl;
            }
        } catch (Exception e) {
            throw new RuntimeException("이미지 변환 오류: " + e.getMessage(), e);
        }
    }

}
