### window 및 mac 에서 실행 방법 (과정 동일)

1. git clone https://github.com/sangwoo4/ppurio.git
2. git fetch origin
3. git checkout frontend
4. npm install
5. npm start
<br/><br/>

#### npm install 후 설치 오류가 생길 경우 의존성 무시 강제 설치

- `npm install --legacy-peer-deps`: 편집기 라이브러리 toast-ui의 버전이 호환되지 않아 생기는 문제이므로 의존성 무시 강제설치를 해준다.

***

### 프로젝트 개발 환경

`"react": "18.3.1"`
<br/><br/>


***

### 파일 디렉토리

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

- **assets**: 이미지 모음
- **components**: 헤더 푸터 영역 표시
- **hooks**: Context API를 활용하여 애플리케이션 전역에서 사용자 ID를 관리
- **pages**: 
   - *loginpage*: 로그인, 회원가입
   - *mainpage*: 메인 홈 화면 페이지
   - *chatbotPage*: 챗봇으로 AI 텍스트 및 이미지를 생성할 수 있는 페이지
   - *editProduct*: 생성된 이미지를 편집할 수 있는 페이지(색감, 보정, 텍스트 삽입, 그리기 등 다양한 기능)
   - *messagePage*: 뿌리오 api를 통해 LMS 혹은 MMS로 문자 전송할 수 있는 페이지 