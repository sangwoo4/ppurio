package free_capston.ppurio.Ppurio.Service;

import free_capston.ppurio.Ppurio.Dto.FileDto;
import free_capston.ppurio.Ppurio.Dto.SendMessageDto;
import free_capston.ppurio.Repository.ImageRepository;
import free_capston.ppurio.Util.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {
    private final ImageRepository imageRepository;
    private final S3Service s3Service;

    @Autowired
    public ImageService(S3Service s3Service, ImageRepository imageRepository) {
        this.s3Service = s3Service;
        this.imageRepository = imageRepository;
    }

    public List<String> changeUrlAndUploadImages(SendMessageDto sendMessageDto) {
        List<String> uploadedUrls = new ArrayList<>();
        if (sendMessageDto.getFiles() != null && !sendMessageDto.getFiles().isEmpty()) {
            for (FileDto fileDto : sendMessageDto.getFiles()) {
                String fileUrl = fileDto.getFileUrl();
                try {
                    String newUrl = uploadFileToS3(fileUrl);
                    uploadedUrls.add(newUrl);
                } catch (IOException e) {
                    System.err.println("파일 업로드 중 오류 발생: " + e.getMessage());
                }
            }
        }
        return uploadedUrls;
    }

    private String uploadFileToS3(String fileUrl) throws IOException {
        URL url = new URL(fileUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.connect();

        if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            throw new IOException("Failed to download file: " + fileUrl + " with response code: " + connection.getResponseCode());
        }

        String fileName = extractFileName(fileUrl);
        if (!fileName.endsWith(".jpg")) {
            fileName = fileName.replace(".png", "") + ".jpg";  // 확장자를 .jpg로 변경하고 추가
        }
        String contentType = "image/jpeg";  // 이미지 타입을 JPG로 설정

        // PNG 이미지를 BufferedImage로 로드
        BufferedImage pngImage = ImageIO.read(connection.getInputStream());

        // JPG 이미지로 변환
        BufferedImage jpgImage = new BufferedImage(
                pngImage.getWidth(),
                pngImage.getHeight(),
                BufferedImage.TYPE_INT_RGB
        );
        jpgImage.createGraphics().drawImage(pngImage, 0, 0, null);

        // JPG 이미지 바이트 배열로 변환
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ImageIO.write(jpgImage, "jpg", outputStream);
            byte[] jpgBytes = outputStream.toByteArray();

            // S3에 업로드
            return s3Service.uploadFile(new ByteArrayInputStream(jpgBytes), fileName, contentType);
        }
    }

    private String extractFileName(String fileUrl) {
        return fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    }

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