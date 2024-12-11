
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

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

