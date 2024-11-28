package free_capston.ppurio.Util;

import free_capston.ppurio.Ppurio.Dto.FileDto;
import free_capston.ppurio.Ppurio.Dto.SendMessageDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class S3Service {
    private final S3Client s3Client;
    private final String bucket;
    private final String s3Url = "https://ppurio-1.s3.ap-northeast-2.amazonaws.com/";

    public S3Service(@Value("${cloud.aws.s3.bucket}") String bucket,
                     @Value("${cloud.aws.credentials.access-key}") String accessKey,
                     @Value("${cloud.aws.credentials.secret-key}") String secretKey) {
        this.s3Client = S3Client.builder()
                .region(Region.of("ap-northeast-2"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
        this.bucket = bucket;
    }

    public String uploadFile(InputStream inputStream, String fileName, String contentType) throws IOException {
//        String uniqueFileName = UUID.randomUUID() + "_" + fileName;
        String uniqueFileName = String.valueOf(UUID.randomUUID()) + ".jpg";
        long contentLength = inputStream.available();
        if (contentLength <= 0) {
            throw new IOException("Input stream is empty or could not determine the size.");
        }

        s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(uniqueFileName)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromInputStream(inputStream, contentLength));

        // URL을 올바르게 인코딩
        return String.format("%s%s", s3Url, URLEncoder.encode(uniqueFileName, StandardCharsets.UTF_8));
    }

}