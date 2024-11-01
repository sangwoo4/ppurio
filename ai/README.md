# PPURIO 프로젝트

ai폴더는 FastAPI를 기반으로 하는 AI 기반 이미지 생성 및 텍스트 생성 API 서버입니다. 이 프로젝트는 OpenAI의 API를 사용하여 이미지 및 텍스트를 생성하는 기능을 제공합니다. 이 문서는 프로젝트의 구조와 사용 방법을 설명합니다.

## 프로젝트 구조

```
ppurio/
|── ai/
|    |── Image/
|    |    |── image.py
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
    "text": "장도윤 할아버지 부고 문자, 너무 정중하거나 무겁지 않고 마지막 자리를 함께 해달라는 말투",
    "hashtag": ["애도", "추모"],
    "field": "장례식장",
    "mood": ["정적", "근엄"]
  }
  ```
- **응답 형식**:
  ```json
  {
    "text": "안녕하세요. 장도윤 할아버지께서 편안한 곳으로 가셨습니다. 마지막 자리를 함께 해주시면 감사하겠습니다. 고인의 삶을 기리며, 함께 나누는 시간이 되었으면 좋겠습니다. #장례식장\n\n부디 많은 분들이 오셔서 따뜻한 마음을 전해주시길 바랍니다."
  }
  ```

### 2. 이미지 생성

`ai/Image/image.py` 파일에는 이미지 생성을 위한 함수가 포함되어 있습니다. 이 기능은 OpenAI의 DALL-E 모델을 사용해 이미지를 PNG 형식으로 생성합니다, 또한 동시에 텍스트를 생성합니다.

- **API 경로**: `/image`
- **HTTP 메서드**: `POST`
- **요청 형식**:
  ```json
  {
    "text": "장도윤 할아버지 부고 문자, 너무 정중하거나 무겁지 않고 마지막 자리를 함께 해달라는 말투",
    "hashtag": ["애도", "추모"],
    "field": "장례식장",
    "mood": ["정적", "근엄"]
  }
  ```
- **응답 형식**:
  ```json
  {
    "text": "안녕하세요. 슬픈 소식을 전하게 되어 마음이 무겁습니다. 장도윤 할아버지께서 별세하셨습니다. 마지막 자리를 함께 해주시면 감사하겠습니다. 애도와 추모의 마음을 나누는 시간이 되었으면 합니다. 많은 분들이 함께 해주시면 좋겠습니다. 감사합니다.",
    "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-ehgMCemGO2ul4Qzq3gq7yZQf/user-e9qXNEvBOGclVlHumV8ZQ89k/img-hMVv9wLkjGUxHgaJc6ObmYlw.png?st=2024-11-01T14%3A01%3A59Z&se=2024-11-01T16%3A01%3A59Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-11-01T01%3A52%3A53Z&ske=2024-11-02T01%3A52%3A53Z&sks=b&skv=2024-08-04&sig=GnD80QlABIoy33VWq%2BUUyydEGc35T/vFEkfBrqif%2BIw%3D"
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
uvicorn ai.Utils.main:app --reload
```

## 로그 및 디버깅

모든 주요 동작은 로그로 기록됩니다. 로그는 프로젝트의 동작 상태를 확인하고 문제 발생 시 디버깅하는 데 도움이 됩니다.

## 참고 사항

- 생성된 이미지는 `ImageStorage` 폴더에 저장되며, 서버를 통해 접근 가능합니다.
- 이미지 용량을 줄이기 위해 JPG 파일은 품질 설정(`quality=50`)을 적용하여 저장됩니다.
