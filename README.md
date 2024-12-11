# PPURIO 프로젝트

## 사전 준비

	1.	Python 설치: Python 3.7 이상이 필요합니다.
	2.	Docker 설치: Docker가 설치되어 있어야 합니다.
	3.	Java JDK 설치: Java 17

Docker 서버 실행 방법

1. backend 디렉토리

	•	백엔드 애플리케이션을 빌드합니다:
```
cd backend
./build clean build
```

2. ai 디렉토리

	•	ai 환경 파일 생성:
```
cd ai
vi .env
openai_api_key=YOUR_OPENAI_API_KEY
```

3. root 디렉토리

	•	Docker build 및 실행:
```
docker compose up --build
```

Frontend 실행 방법 (Windows 및 Mac에서 동일)
```
	1.	git clone https://github.com/sangwoo4/ppurio.git
	2.	git fetch origin
	3.	git checkout frontend
	4.	npm install
	5.	npm start
```
npm install 후 설치 오류가 발생하는 경우 의존성 무시 강제 설치
	•	npm install --legacy-peer-deps: 편집기 라이브러리 toast-ui의 버전이 호환되지 않아 발생하는 문제 해결을 위해 의존성 무시 강제 설치.

## 프로젝트 구조

### ai 폴더
```
ppurio/
|── ai/
|    |── Image/
|    |    |── image_service.py
|    |── Text/
|    |    |── text_service.py
|    |── Utils/
|         |── category_des.py
|         |── common_service.py
|         |── db.py
|         |── main.py
|         |── openai_client.py
|         |── schemas.py
|         |── similar.py
|── README.md
```
common_service.py

	•	역할: 공통 서비스 로직과 로깅 기능을 제공합니다.
	•	주요 기능:
	•	LoggerManager: 로거 설정 및 관리를 위한 클래스.
	•	CommonService: 로깅, 데이터 유효성 검증, 공통 예외 처리 로직을 포함.

schemas.py

	•	역할: API 요청 및 응답 데이터 구조를 정의.
	•	모델 정의:
	•	TextRequest/TextResponse: 텍스트 생성 API용 데이터 모델.
	•	ImageCreateRequest/ImageCreateResponse: 이미지 생성 API용 데이터 모델.

openai_client.py

	•	역할: OpenAI API와 통신하기 위한 클라이언트를 설정.
	•	주요 기능:
	•	.env 파일에서 API 키를 불러와 OpenAI 클라이언트(AsyncOpenAI) 초기화.
	•	openai_client_instance: 전역 OpenAI 클라이언트 인스턴스 제공.

similar.py

	•	역할: 텍스트 유사도를 계산하고, 데이터베이스의 항목과 입력 텍스트를 비교.
	•	주요 클래스:
	•	CosineSimilarity: 코사인 유사도를 계산.
	•	SimilarityService: 입력 텍스트와 가장 유사한 항목을 데이터베이스에서 찾음.

db.py

	•	역할: MySQL 데이터베이스 연결과 데이터 조회/저장 담당.
	•	주요 클래스:
	•	DatabaseConnection: 비동기 MySQL 연결 풀 설정.
	•	DataService: 쿼리 실행 및 데이터 조회.
	•	MessageImageService: 메시지 및 이미지 데이터를 관리.

main.py

	•	역할: FastAPI 애플리케이션의 진입점.
	•	주요 기능:
	•	텍스트 생성 및 이미지 생성 API 엔드포인트(/text, /image) 정의.
	•	데이터베이스 연결 및 서비스 초기화.
	•	uvicorn을 통해 FastAPI 서버 실행.

 ### backend 폴더
 ```
├── Dockerfile
├── HELP.md
├── gradlew
└── src
    └── main
        └── java
            └── free_capston
                └── ppurio
                    ├── Account
                    ├── Ppurio
                    ├── PpurioApplication.java
                    ├── Repository
                    ├── Util
                    ├── category
                    └── model
```
Account

	•	계정 관련 요청을 처리하는 로직을 포함한 디렉토리.
	•	AccountController.java: 계정 관련 API 요청 처리.
	•	AccountService.java: 계정 비즈니스 로직 처리.
	•	Dto: 계정 데이터 전송 객체.

Repository

	•	데이터베이스와 상호작용하는 레이어.
	•	CategoryRepository.java: 카테고리 관련 DB 접근.
	•	ImageRepository.java: 이미지 관련 DB 접근.
	•	MessageRepository.java: 메시지 관련 DB 접근.
	•	UserRepository.java: 사용자 관련 DB 접근.

Util

	•	프로젝트 전반에서 사용하는 유틸리티 및 설정 파일.
	•	AppConfig.java: 애플리케이션 공통 설정.
	•	S3Service.java: AWS S3 연동 로직.
	•	ResponseDto.java: API 응답 형식 정의.

model

	•	데이터베이스와 매핑되는 엔티티 클래스.
	•	Category.java: 카테고리 엔티티.
	•	Image.java: 이미지 엔티티.
	•	Message.java: 메시지 엔티티.
	•	User.java: 사용자 엔티티.

PpurioApplication.java

	•	스프링 부트 애플리케이션의 진입점.


 ### frontend 폴더

 ```
 src/
|── assets/
|    |── fonts/
|    |── 이미지 모음
|── components/
|    |── Footer.jsx
|    |── Header.jsx
|── hooks/
|    |── UserContext.jsx
|── pages/
|    |── loginpage/
|    |    |── Login.jsx
|    |── mainpage/
|    |    |── MainHome.jsx
|    |── chatbotPage/
|    |    |── Chatbot.jsx
|    |── editProduct/
|    |    |── EditProduct.jsx
|    |── messagePage/
|    |    |──  Message.jsx
|── styles/
|── App.css
|── App.js
|── index.js
|── package.json
|── README.md
```

	•	assets: 이미지 모음
	•	components: 헤더 푸터 영역 표시
	•	hooks: Context API를 활용하여 애플리케이션 전역에서 사용자 ID를 관리
	•	pages:
  	•	loginpage: 로그인, 회원가입
  	•	mainpage: 메인 홈 화면 페이지
  	•	chatbotPage: 챗봇으로 AI 텍스트 및 이미지를 생성할 수 있는 페이지
  	•	editProduct: 생성된 이미지를 편집할 수 있는 페이지(색감, 보정, 텍스트 삽입, 그리기 등 다양한 기능)
  	•	messagePage: 뿌리오 api를 통해 LMS 혹은 MMS로 문자 전송할 수 있는 페이지

<hr>

## 프로젝트 주요 기능
 본 프로젝트는 AI 기반의 이미지 및 텍스트 자동 생성 시스템을 개발하여 사용자 편의성을 향상하는 것을 목표로 합니다.  
 사용자가 입력한 텍스트를 AI가 자동으로 분석하고 그에 맞는 메시지와 이미지를 생성하여 문자 발송을 위한 이미지를 자동으로 생성 및 편집할 수 있는 기능을 제공합니다.  
 특히, 다양한 상황과 환경에 최적화된 맞춤형 콘텐츠 제작을 지원함으로써 시간과 비용 절감 효과를 기대할 수 있습니다.

 <hr>
 2.3 시나리오
회원가입
Ⅰ. 회원가입 시, 사업자등록번호를 조회하여 등록 여부 확인합니다.
Ⅱ. 사업자 등록번호가 조회되면, 아이디(이메일), 비밀번호, 회사명, 대표자명, 업종명을
    입력합니다.
Ⅲ. 모두 입력했으면 <회원가입> 버튼을 눌러 회원가입을 완료합니다.

로그인
Ⅰ. 회원가입을 마친 후, 로그인 창으로 넘어와 아이디(이메일), 비밀번호를 입력합니다.
Ⅱ. 모두 입력했으면 <로그인> 버튼을 눌러 로그인을 시도합니다.

텍스트 생성 챗봇
Ⅰ. 챗봇 버튼을 눌러 챗봇을 활성화합니다.
Ⅱ. 챗봇이 <텍스트 생성> 버튼과 <이미지 생성> 버튼을 보이면 <텍스트 생성> 버튼을
    클릭합니다.
Ⅲ. 챗봇이 “메시지 발송 목적 및 내용을 입력해 주세요.” 문구를 띄우면 입력창에 메시지 
발송 목적에 맞는 텍스트를 입력 후 <확인> 버튼을 누릅니다.
Ⅳ. 챗봇이 “중요키워드가 있으면 입력해 주세요.” 문구를 띄우면 입력창에 메시지 내
    포함되어야 할 꼭 필요한 단어가 있으면 입력 후 <확인> 버튼을, 없으면 <건너뛰기>
    버튼을 누릅니다.
Ⅴ. 챗봇이 “원하는 어조가 있다면 선택하거나 직접입력 해주세요.” 문구와 함께 버튼 및
    직접입력 창이 나타나게 되는데, 이때 클릭하거나 직접 입력하여 원하는 어조를 선택합
    니다.
Ⅵ. 모든 입력이 완료되면 <AI 메시지 생성하기> 버튼을 누르면 AI가 발송 목적에 맞는
    텍스트를 완성해 줍니다.
Ⅶ. 이때 사용자는 텍스트를 편집할 것인지, 저장 후 메시지 전송을 할 것인지 선택할 수
   있습니다.

이미지 생성 챗봇
Ⅰ. 챗봇 버튼을 눌러 챗봇을 활성화합니다.
Ⅱ. 챗봇이 <텍스트 생성> 버튼과 <이미지 생성> 버튼을 보이면 <이미지 생성> 버튼을
    클릭합니다.
Ⅲ. 챗봇이 “원하는 이미지의 방향을 입력해 주세요” 문구를 띄우면 입력창에 사용자가
    원하는 이미지의 내용을 입력 후 <확인> 버튼을 누릅니다.
Ⅳ. 내용 입력이 완료되면 <AI 이미지 생성하기> 버튼을 누르면 AI가 목적에 맞는 이미지를
    완성해 줍니다.
Ⅴ. 이때 사용자는 이미지를 편집할 것인지, 메시지 전송을 할 것인지 버튼을 통해 선택할 
    수 있습니다.

편집 및 저장
Ⅰ. AI로 생성한 텍스트 및 이미지는 <편집하기> 버튼을 클릭하여 편집할 수 있습니다.
Ⅱ. <편집하기> 버튼을 누르면, 편집 화면으로 넘어가게 되고, 텍스트 편집의 경우 사용자
    는 이곳에서 텍스트를 직접 수정할 수 있습니다.
Ⅲ. 이미지 편집의 경우 사용자는 이미지의 컨셉을 다시 지정하여 처음부터 AI가 이미지를
    다시 생성해 주는 <다시 생성하기> 버튼을 클릭하거나 혹은, 사용자가 직접 이미지 내 
    들어갈 텍스트를 간단한 편집 기능을 이용하여 편집할 수 있습니다.
Ⅳ. 편집이 완료된 텍스트 및 이미지는 <발송하기> 버튼을 눌러 실제 문자 발송을 할 수 
    있습니다.

문자 발송
Ⅰ. 편집까지 완료된 텍스트 혹은 이미지는 <발송하기> 버튼을 누르면 메시지를 발송하는 
    화면으로 넘어가게 됩니다.
Ⅱ. 미리보기 기능을 통해 실제 발송 직전에 발송 메시지를 확인할 수 있으며, 전화번호를 
    입력 후 <발송하기> 버튼을 누르면 해당 전화번호로 문자가 전송됩니다.












