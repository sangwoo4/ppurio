### window 및 mac 에서 실행 방법 (과정 동일)

1. git clone https://github.com/sangwoo4/ppurio.git
2. git fetch origin
3. git checkout frontend
4. npm install
5. npm start
<br/><br/>

#### npm install 후 설치 오류가 생길 경우 직접 설치 라이브러리

- `npm install react-router-dom`: 페이지 이동 라이브러리 설치
- `npm install axios`: 리액트 서버 요청 라이브러리 설치
- `npm install react-icons`: 리액트 아이콘 라이브러리 설치

***

### 프로젝트 개발 환경

`"react": "18.3.1"`
<br/><br/>


***

### 파일 디렉토리

```
src/
|── assets/
|── components/
|    |── Footer.jsx
|    |── Header.jsx
|── database/
|    |── data.json
|── pages/
|    |── editmap/
|    |    |── EditMap.jsx
|    |── loginpage/
|    |    |── Login.jsx
|    |    |── SignUp.jsx
|    |── mainpage/
|    |    |── MainHome.jsx
|    |── randomstationpage/
|    |    |── RamdinStation.jsx
|    |    |── StationData.jsx
|    |── seoulmap/
|    |    |── SeoulMap.jsx
|    |── stationmemo/
|    |    |── StationMemo.jsx
|── styles/
|── App.css
|── App.js
|── index.js
|── package.json
|── README.md
```

- **assets**: 이미지 모음
- **components**: 헤더 푸터 영역 표시
- **database**: 회원가입 유저 정보 관리 데이터베이스
- **pages**: 
   - *editmap*: 자치구 별 이미지를 삽입하여 지도에 저장하는 페이지
   - *loginpage*: 로그인, 회원가입
   - *mainpage*: 메인 홈 화면 페이지
   - *randomstationpage*: 서울의 모든 지하철 역을 랜덤으로 돌리는 페이지
   - *seoulmap*: 서울의 25개 자치구 영역을 나누어 지도를 편집할 수 있는 페이지
   - *stationmemo*: 랜덤 역이 걸렸을 때 역을 저장하여 간단한 메모를 남길 수 있는 페이지