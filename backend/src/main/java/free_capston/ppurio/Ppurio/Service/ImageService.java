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
import java.awt.image.WritableRenderedImage;
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

    static {
            ImageIO.scanForPlugins();
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

    private String cleanBase64Data(String base64Data){
        if(base64Data.startsWith("data:image/")){
            int commaIndex = base64Data.indexOf(',');
            return commaIndex > 0 ? base64Data.substring((commaIndex + 1)) : base64Data;
        }
        return base64Data;
    }

    public String uploadBase64ToS3(String base64Data) throws IOException {
        base64Data = cleanBase64Data(base64Data);

        if(base64Data == null || base64Data.isEmpty()){
            throw new IllegalArgumentException("Base 64 데이터가 없습니다.");
        }

        byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
        try(ByteArrayInputStream inputStream = new ByteArrayInputStream(decodedBytes)){
            BufferedImage inputImage = ImageIO.read(inputStream);
            if(inputImage == null){
                throw new IOException("이미지 디코딩 실패");
            }

            String fileName = UUID.randomUUID() + ".jpg";
            String contentType = "image/jpeg";

            try(ByteArrayOutputStream outputStream = new ByteArrayOutputStream()){
                ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
                try(ImageOutputStream ios = ImageIO.createImageOutputStream(outputStream)){
                    writer.setOutput(ios);
                    ImageWriteParam writeParam = writer.getDefaultWriteParam();
                    writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);

                    writer.write(null, new javax.imageio.IIOImage(inputImage, null, null), writeParam);
                    writer.dispose();
                }
                return s3Service.uploadFile(new ByteArrayInputStream(outputStream.toByteArray()), fileName, contentType);
            }

        }
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