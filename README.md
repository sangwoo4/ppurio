## 사전 준비

1. **Python 설치**: Python 3.7 이상이 필요합니다.
2. **Docker 설치**: Docker가 설치되어 있어야 합니다.
3. **Java JDK설치**: Java 17

## 환경 설정

### 1. backend 디렉토리
- 백엔드 애플리케이션을 빌드합니다:
  ```bash
  cd backend
  ./build clean build

### 2. ai 디렉토리
- ai env 파일 생성
  ```bash
  cd ai
  vi .env
  openai_api_key=YOUR_OPENAI_API_KEY

### 3. root 디렉토리
- docker build, run
  ```bash
    docker compose up --build

