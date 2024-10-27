# PPURIO 프로젝트

ai폴더는 FastAPI를 기반으로 하는 AI 기반 이미지 생성 및 텍스트 생성 API 서버입니다. 이 프로젝트는 OpenAI의 API를 사용하여 이미지 및 텍스트를 생성하는 기능을 제공합니다. 이 문서는 프로젝트의 구조와 사용 방법을 설명합니다.

## 프로젝트 구조

```
ppurio/
|── ai/
|    |── Image/
|    |    |── image.py
|    |── ImageStorage/
|    |── __pycache__/
|    |── ...
|    |──
|    |── Text/
|    |    |── text.py
|    |── Utils/
|         |── main.py
|         |── schemas.py
|── README.md
```

- **ai/Image/**: 이미지 생성 및 편집과 관련된 로직이 포함된 디렉토리입니다. 생성된 이미지는 `ImageStorage` 디렉토리에 저장됩니다.
- **ai/Text/**: 텍스트 생성과 관련된 로직이 포함된 디렉토리입니다.
- **ai/Utils/**: 공통적으로 사용되는 유틸리티 함수와 Pydantic 모델이 포함되어 있습니다.
- **README.md**: 프로젝트 설명 문서입니다.

## 가상환경 설정

이 프로젝트는 Python 가상환경을 사용하는 것이 좋습니다. 다음 명령어로 가상환경을 생성하고 활성화할 수 있습니다.

```bash
# 가상환경 생성 (myenv라는 이름의 가상환경)
python -m venv myenv

# 가상환경 활성화 (Windows)
myenv\Scripts\activate

# 가상환경 활성화 (MacOS/Linux)
source myenv/bin/activate
```

## 필요 라이브러리 설치

이 프로젝트를 실행하기 위해 필요한 라이브러리는 `install.txt` 파일에 포함되어 있습니다. 다음 명령어로 필요한 라이브러리를 설치할 수 있습니다.

```bash
pip install -r install.txt
```

### 주요 라이브러리 목록

- `fastapi`: FastAPI 프레임워크를 사용하여 API 서버를 구축
- `uvicorn`: FastAPI 서버를 실행하기 위한 ASGI 서버
- `openai`: OpenAI API와의 통신을 위한 라이브러리
- `python-dotenv`: 환경 변수를 로드하기 위한 라이브러리
- `PIL`: 이미지 처리를 위한 라이브러리(pillow)
- `requests`: HTTP 요청을 보내기 위한 라이브러리
- `pydantic`: 데이터 검증 및 설정 관리를 위한 라이브러리
- `uuid`: 고유 식별자 생성을 위한 라이브러리

### install.txt

```
fastapi
uvicorn
openai
python-dotenv
Pillow
requests
pydantic
```

## 주요 기능

### 1. 텍스트 생성

`ai/Text/text.py` 파일에는 텍스트 생성을 위한 함수가 포함되어 있습니다. OpenAI의 GPT4o-mini 모델을 사용해 주어진 입력과 해시태그를 기반으로 텍스트 메시지를 생성합니다.

- **API 경로**: `/text`
- **HTTP 메서드**: `POST`
- **요청 형식**:
  ```json
  {
    "input": "행사 홍보",
    "hashtag": ["할인", "이벤트"]
  }
  ```
- **응답 형식**:
  ```json
  {
    "response": "이번 행사를 놓치지 마세요! 할인과 이벤트가 가득합니다."
  }
  ```

### 2. 이미지 생성(미완성)

`ai/Image/image.py` 파일에는 이미지 생성을 위한 함수가 포함되어 있습니다. 이 기능은 OpenAI의 DALL-E 모델을 사용해 이미지를 생성하고, JPG 형식으로 변환하여 저장합니다. 또한 jpg 변환시 이미지 용량을 축소 시킴으로 저장공간 확보에 도움이 됩니다.

- **API 경로**: `/image`
- **HTTP 메서드**: `POST`
- **요청 형식**:
  ```json
  {
    "prompt": "고양이 이미지"
  }
  ```
- **응답 형식**:
  ```json
  {
    "image_url": "http://localhost:8000/images/{filename}.jpg"
  }
  ```

이미지는 `ImageStorage` 폴더에 저장되며, 응답으로 해당 이미지에 접근 가능한 URL이 반환됩니다.

### 3. 이미지 편집 (미완성)

이미지 편집 기능은 현재 개발 중이며, 사용자가 제공한 마스크 이미지와 설명을 바탕으로 이미지를 수정하는 기능을 제공합니다. 이 기능 역시 OpenAI의 DALL-E 모델을 사용하여 구현됩니다.

- **API 경로**: `/test`
- **HTTP 메서드**: `POST`

## 사용 방법

### 1. 환경 변수 설정

이 프로젝트는 OpenAI API 키를 필요로 합니다. 프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음과 같이 API 키를 설정합니다.

```
openai_api_key=YOUR_OPENAI_API_KEY
```

### 2. 프로젝트 실행

이 프로젝트는 `uvicorn`을 사용하여 실행됩니다. 다음 명령어로 서버를 실행할 수 있습니다.

```bash
uvicorn ai.Utils.main:app -reload
```

## 로그 및 디버깅

모든 주요 동작은 로그로 기록됩니다. 로그는 프로젝트의 동작 상태를 확인하고 문제 발생 시 디버깅하는 데 도움이 됩니다.

## 참고 사항

- 생성된 이미지는 `ImageStorage` 폴더에 저장되며, 서버를 통해 접근 가능합니다.
- 이미지 용량을 줄이기 위해 JPG 파일은 품질 설정(`quality=50`)을 적용하여 저장됩니다.
