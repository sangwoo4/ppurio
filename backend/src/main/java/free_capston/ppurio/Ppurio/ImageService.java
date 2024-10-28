package free_capston.ppurio.Ppurio;

import free_capston.ppurio.Dto.FileDto;
import free_capston.ppurio.Dto.SendMessageDto;
import free_capston.ppurio.Repository.ImageRepository;
import free_capston.ppurio.Util.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

    public List<String> saveImages(SendMessageDto sendMessageDto) {
        List<String> uploadedUrls = new ArrayList<>();
        if (sendMessageDto.getFiles() != null && !sendMessageDto.getFiles().isEmpty()) {
            for (FileDto fileDto : sendMessageDto.getFiles()) {
                String fileUrl = fileDto.getFileUrl();
                try {
                    System.out.println("file url ==== " + fileUrl);
                    String newUrl = uploadFileToS3(fileUrl);
                    uploadedUrls.add(newUrl);
                    System.out.println("Uploaded file URL: " + newUrl);
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

        String contentType = connection.getContentType();
        String fileName = extractFileName(fileUrl);

        // ByteArrayOutputStream을 사용하여 InputStream을 읽기
        try (InputStream inputStream = connection.getInputStream();
             ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

            byte[] data = new byte[1024];
            int bytesRead;

            while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, bytesRead);
            }

            // ByteArrayOutputStream에서 바이트 배열을 가져옴
            byte[] fileBytes = buffer.toByteArray();

            // S3에 업로드
            return s3Service.uploadFile(new ByteArrayInputStream(fileBytes), fileName, contentType);
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