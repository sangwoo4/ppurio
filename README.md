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

<br>

## frontend 실행 방법
### window 및 mac 에서 실행 방법 (과정 동일)

1. git clone https://github.com/sangwoo4/ppurio.git
2. git fetch origin
3. git checkout frontend
4. npm install
5. npm start
<br/><br/>

#### npm install 후 설치 오류가 생길 경우 의존성 무시 강제 설치

- `npm install --legacy-peer-deps`: 편집기 라이브러리 toast-ui의 버전이 호환되지 않아 생기는 문제이므로 의존성 무시 강제설치를 해준다.