package free_capston.ppurio.Util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
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

//    public String uploadFile(InputStream inputStream, String fileName, String contentType) throws IOException {
//        String uniqueFileName = UUID.randomUUID() + "_" + fileName;
//
//
//        s3Client.putObject(PutObjectRequest.builder()
//                        .bucket(bucket)
//                        .key(uniqueFileName)
//                        .contentType(contentType)
//                        .build(),
//                RequestBody.fromInputStream(inputStream, inputStream.available()));
//        System.out.println("inputStream222 === " + inputStream);
//        return String.format("%s%s", s3Url, uniqueFileName);
//    }
public String uploadFile(InputStream inputStream, String fileName, String contentType) throws IOException {
    String uniqueFileName = UUID.randomUUID() + "_" + fileName;

    // InputStream의 길이를 가져오는 대신, FileInputStream을 사용하여 파일을 업로드합니다.
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

    return String.format("%s%s", s3Url, uniqueFileName);
}
}