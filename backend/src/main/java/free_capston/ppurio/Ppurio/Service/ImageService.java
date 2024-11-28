package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.FileDto;
import free_capston.ppurio.Ppurio.Dto.SendMessageDto;
import free_capston.ppurio.Repository.ImageRepository;
import free_capston.ppurio.Util.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    private final ImageRepository imageRepository;
    private final S3Service s3Service;

    @Autowired
    public ImageService(S3Service s3Service, ImageRepository imageRepository) {
        this.s3Service = s3Service;
        this.imageRepository = imageRepository;
    }

    // Static block to load ImageIO plugins for TwelveMonkeys support
    static {
        try {
            // Enable TwelveMonkeys plugins for various image formats
            ImageIO.scanForPlugins();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<String> changeUrlAndUploadImages(SendMessageDto sendMessageDto) {
        List<String> uploadedUrls = new ArrayList<>();
        if (sendMessageDto.getFiles() != null && !sendMessageDto.getFiles().isEmpty()) {
            for (FileDto fileDto : sendMessageDto.getFiles()) {
                String fileUrl = fileDto.getFileUrl();
                try {
                    String newUrl = uploadBase64ToS3(fileUrl);
                    uploadedUrls.add(newUrl);
                } catch (IOException e) {
                    System.err.println("파일 업로드 중 오류 발생: " + e.getMessage());
                }
            }
        }
        return uploadedUrls;
    }

    // Base64 데이터에서 불필요한 부분 제거 (data:image/png;base64, 부분)
    private String cleanBase64Data(String base64Data) {
        if (base64Data.startsWith("data:image/")) {
            int commaIndex = base64Data.indexOf(',');
            if (commaIndex > 0) {
                base64Data = base64Data.substring(commaIndex + 1);
            }
        }
        return base64Data;
    }

    public String uploadBase64ToS3(String base64Data) throws IOException {
        // Base64 데이터 정리
        base64Data = cleanBase64Data(base64Data);

        // Base64 데이터 유효성 검사
        if (base64Data == null || base64Data.isEmpty()) {
            throw new IllegalArgumentException("Base64 data is empty or null.");
        }

        // Base64 데이터 앞부분 제거 (예: data:image/png;base64, 부분)
        base64Data = base64Data.replaceFirst("^data:image\\/[^;]+;base64,", "");

        byte[] decodedBytes;
        try {
            decodedBytes = Base64.getDecoder().decode(base64Data);
            // 로그에 전체 Base64 데이터를 출력하지 않고, 데이터의 길이만 출력
            System.out.println("Decoded bytes length: " + decodedBytes.length);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid Base64 data provided.", e);
        }

        // 디버깅: Base64 데이터를 파일로 저장 (디버깅용)
        saveBase64ToFile(base64Data, "debug_image.png");

        // InputStream 변환 및 이미지 디코딩
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(decodedBytes)) {
            BufferedImage inputImage = ImageIO.read(inputStream);
            if (inputImage == null) {
                System.out.println("Failed to decode image. Unsupported or corrupted data.");
                throw new IOException("Failed to decode image from Base64 data.");
            }

            // 이미지가 PNG일 경우 JPG로 변환하여 저장
            String fileName = UUID.randomUUID() + ".jpg";
            String contentType = "image/jpeg";

            // JPG 이미지를 바이트 배열로 변환 후 압축 및 화질 조정
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                // JPEGWriter를 사용하여 화질 설정
                ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
                ImageOutputStream ios = ImageIO.createImageOutputStream(outputStream);
                writer.setOutput(ios);

                // 화질 설정
                ImageWriteParam writeParam = writer.getDefaultWriteParam();
                writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                writeParam.setCompressionQuality(0.7f);  // 화질 0.0f ~ 1.0f 사이, 1.0f는 원본 품질

                // 이미지 저장
                writer.write(null, new javax.imageio.IIOImage(inputImage, null, null), writeParam);
                byte[] jpgBytes = outputStream.toByteArray();

                // S3에 업로드
                return s3Service.uploadFile(new ByteArrayInputStream(jpgBytes), fileName, contentType);
            }
        } catch (IOException e) {
            // 예외 로그 출력
            System.out.println("Error during image processing: " + e.getMessage());
            throw new IOException("Error processing the image", e);
        }
    }

    // 디버깅 용도로 Base64 데이터를 파일로 저장하는 메서드 (파일 저장 확인)
    public void saveBase64ToFile(String base64Data, String filePath) throws IOException {
        base64Data = cleanBase64Data(base64Data);  // Clean the Base64 data
        byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

        try (FileOutputStream fileOutputStream = new FileOutputStream(filePath)) {
            fileOutputStream.write(decodedBytes);
        }
    }

    // 랜덤 파일 이름 생성 메서드
    private String generateRandomFileName() {
        return UUID.randomUUID().toString(); // UUID를 사용하여 고유 이름 생성
    }

    // SendMessageDto에 파일 URL 업데이트
    public SendMessageDto updateFileUrls(SendMessageDto sendMessageDto, List<String> newUrls) {
        if (sendMessageDto.getFiles() != null && !sendMessageDto.getFiles().isEmpty()) {
            for (int i = 0; i < sendMessageDto.getFiles().size(); i++) {
                FileDto fileDto = sendMessageDto.getFiles().get(i);
                if (i < newUrls.size()) {
                    fileDto.setFileUrl(newUrls.get(i));
                }
            }
        }
        return sendMessageDto;
    }
}