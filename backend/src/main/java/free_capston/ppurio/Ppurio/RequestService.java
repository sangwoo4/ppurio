package free_capston.ppurio.Ppurio;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import free_capston.ppurio.Dto.SendMessageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class RequestService {
    private static final String URI = "https://message.ppurio.com";
    private static final String PPURIO_ACCOUNT = "hansung06";
    private static final String API_KEY = "2044bc5c49751a3951dc0e39cf1a512996b2a69dcce1f6fbb8d22e7f56fd7e95";
    private static final Integer TIME_OUT = 5000;
    private static final String FROM = "01051454202";
    private static final String FILE_PATH = "/Users/park/Desktop/purrio/ppurio/src/images/dog.jpg";

    private static SaveService saveService;


    public void requestSend(SendMessageDto sendMessageDto){
        String basicAuthorization = Base64.getEncoder().encodeToString((PPURIO_ACCOUNT + ":" + API_KEY).getBytes());

        Map<String, Object> tokenResponse = getToken(URI, basicAuthorization);
        Map<String, Object> sendResponse = send(URI, (String) tokenResponse.get("token"), sendMessageDto);
        System.out.println("send Response to String" + sendResponse.toString());
        saveService.saveMessageAndImage(sendMessageDto);

    }

    //메시지를 보내는 부분
    private Map<String, Object> send(String baseUri, String accessToken, SendMessageDto sendMessageDto) {
        HttpURLConnection conn = null;
        try {
            String bearerAuthorization = String.format("%s %s", "Bearer", accessToken);
            Request request = new Request(baseUri + "/v1/message", bearerAuthorization);

            // createSendTestParams를 호출하여 필요한 파라미터를 생성
            Map<String, Object> params = createSendTestParams(sendMessageDto);

            // DTO를 JSON으로 변환하여 HTTP 요청 생성
            conn = createConnection(request,  params);

            return getResponseBody(conn);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    private Map<String, Object> createFileTestParams(String filePath) throws RuntimeException, IOException {
        FileInputStream fileInputStream = null;
        try {
            File file = new File(filePath);
            byte[] fileBytes = new byte[ (int) file.length()];
            fileInputStream = new FileInputStream(file);
            int readBytes = fileInputStream.read(fileBytes);

            if (readBytes != file.length()) {
                throw new IOException();
            }

            String encodedFileData = Base64.getEncoder().encodeToString(fileBytes);
            System.out.println(encodedFileData);
            HashMap<String, Object> params = new HashMap<>();
            params.put("size", file.length());
            params.put("name", file.getName());
            params.put("data", encodedFileData);
            return params;
        } catch (IOException e) {
            throw new RuntimeException("파일을 가져오는데 실패했습니다.", e);
        } finally {
            if(fileInputStream != null) {
                fileInputStream.close();
            }
        }
    }

    private Map<String, Object> getToken(String baseUri, String BasicAuthorization) {
        HttpURLConnection conn = null;
        try {
            // 요청 파라미터 생성
            Request request = new Request(baseUri + "/v1/token", "Basic " + BasicAuthorization);

            // 요청 객체 생성
            conn = createConnection(request);

            // 응답 데이터 객체 변환
            return getResponseBody(conn);
        } catch (IOException e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private Map<String, Object> createSendTestParams(SendMessageDto sendMessageDto) throws IOException {
        HashMap<String, Object> params = new HashMap<>();
        params.put("account", sendMessageDto.getAccount());
        params.put("messageType", sendMessageDto.getMessageType());
        params.put("from", FROM);
        params.put("content", sendMessageDto.getContent());
        System.out.println("message" + sendMessageDto.getTargetCount());
        params.put("duplicateFlag", sendMessageDto.getDuplicateFlag());
//        params.put("rejectType", sendMessageDto.getRejectType());
        params.put("targetCount", sendMessageDto.getTargetCount());
        params.put("targets", sendMessageDto.getTargets());

        params.put("files", List.of(
                createFileTestParams(FILE_PATH)
        ));

        params.put("refKey", sendMessageDto.getRefKey());
        return params;
    }


    private Map<String, Object> getResponseBody(HttpURLConnection conn) throws IOException{
        InputStream inputStream = conn.getResponseCode() == 200 ? conn.getInputStream() : conn.getErrorStream();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            StringBuilder responseBody = new StringBuilder();
            String inputLine;
            while ((inputLine = br.readLine()) != null) {
                responseBody.append(inputLine);
            }
            return convertJsonToMap(responseBody.toString());
        } catch (IOException e) {
            throw new RuntimeException("API 응답을 읽는 데 실패했습니다.", e);
        }
    }

    private Map<String, Object> convertJsonToMap(String jsonString) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(jsonString, new TypeReference<>() {});
    }

    private HttpURLConnection createConnection(Request request, Map<String, Object> params) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonInputString = objectMapper.writeValueAsString(params); // Serialize the parameters map

        HttpURLConnection connect = createConnection(request);
        connect.setDoOutput(true);

        try (OutputStream os = connect.getOutputStream()) {
            byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return connect;
    }

    private HttpURLConnection createConnection(Request request) throws IOException {
        URL url = new URL(request.getRequestUri());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", request.getAuthorization());
        conn.setConnectTimeout(TIME_OUT);
        conn.setReadTimeout(TIME_OUT);
        return conn;
    }

    @Getter
    @AllArgsConstructor
    class Request{
        private String requestUri;
        private String authorization;

    }
}
