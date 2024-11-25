# PPURIO 프로젝트

ai폴더는 FastAPI를 기반으로 하는 AI 기반 이미지 생성 및 텍스트 생성 API 서버입니다. 이 프로젝트는 OpenAI의 API를 사용하여 이미지 및 텍스트를 생성하는 기능을 제공합니다. 이 문서는 프로젝트의 구조와 사용 방법을 설명합니다.

## 프로젝트 구조

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

- **ai/Image/**: 이미지 생성 및 관련 로직이 포함된 디렉토리입니다.
- **ai/Text/**: 텍스트 생성과 관련된 로직이 포함된 디렉토리입니다.
- **ai/Utils/**: 공통적으로 사용되는 유틸리티 함수 및 Pydantic 모델이 포함되어 있습니다.
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

이 프로젝트를 실행하기 위해 필요한 라이브러리는 `requirements.txt` 파일에 포함되어 있습니다. 다음 명령어로 필요한 라이브러리를 설치할 수 있습니다.

```bash
pip install -r requirements.txt
```

### 주요 라이브러리 목록

- `fastapi`: FastAPI 프레임워크를 사용하여 API 서버를 구축
- `uvicorn`: FastAPI 서버를 실행하기 위한 ASGI 서버
- `aiomysql`: 비동기 MySQL 연결을 위한 라이브러리
- `pydantic`: 데이터 검증 및 설정 관리를 위한 라이브러리
- `python-dotenv`: 환경 변수를 로드하기 위한 라이브러리
- `openai`: OpenAI API와의 통신을 위한 라이브러리
- `scikit-learn`: 머신러닝 모델 및 코사인 유사도 계산을 위한 라이브러리
- `pecab`: 한국어 형태소 분석을 위한 라이브러리

### requirements.txt

```
fastapi
uvicorn
aiomysql
pydantic
python-dotenv
openai
scikit-learn
pecab
```

## 주요 기능

### 1. 텍스트 생성

`ai/Text/text_service.py` 파일에는 텍스트 생성을 위한 함수가 포함되어 있습니다. OpenAI의 GPT4o-mini 모델을 사용해 주어진 입력, 해시태그, 키워드, 분위기를 기반으로 텍스트 메시지를 생성합니다.

- **API 경로**: `/text`
- **HTTP 메서드**: `POST`
- **요청 형식**:
  ```json
  {
    "text": "쓰나미 경보 발령으로 신속 대피를 촉구하는 문자를 보내줘.",
    "mood": ["무거운", "진지함"],
    "category": "재난/경고성 문자",
    "keyword": ["대피", "쓰나미"]
  }
  ```
- **응답 형식**:
  ```json
  {
    "text": "안녕하세요. 긴급 상황입니다. 쓰나미 경보가 발령되었습니다. 모든 직원은 즉시 안전한 고지대로 대피해 주시기 바랍니다. 농업 작업 중인 지역은 특히 위험하니, 신속하게 대피하여 안전을 확보하시기 바랍니다. 추가 안내는 추후 전달드리겠습니다. 여러분의 안전이 최우선입니다."
  }
  ```

### 2. 이미지 생성

`ai/Text/image_service.py` 파일에는 이미지 생성을 위한 함수가 포함되어 있습니다. OpenAI에서 지원하는 DALL-E-3 모델을 사용해 주어진 입력, 해시태그, 업종명, 키워드, 분위기를 기반으로 이미지를 생성합니다.

- **API 경로**: `/image`
- **HTTP 메서드**: `POST`
- **요청 형식**:
  ```json
  {
    "text": "쓰나미 경보 발령으로 신속 대피를 촉구하는 문자를 보내줘.",
    "mood": ["무거운", "진지함"],
    "category": "재난/경고성 문자",
    "keyword": ["대피", "쓰나미"]
  }
  ```
- **응답 형식**:
  ```json
  {
    "url": "https://oaidalleapiprodscus.blob.core.windows.net/"
  }
  ```

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

## 그 외 참고 사항

이 프로젝트의 주요 파일 중 `text_service.py`와 `image_service.py`를 제외한 파일에 대한 간략한 설명입니다.

### **common_service.py**

- **역할**: 공통 서비스 로직과 로깅 기능을 제공합니다.
- **주요 기능**:
  - `LoggerManager`: 로거 설정 및 관리를 위한 클래스.
  - `CommonService`: 로깅, 데이터 유효성 검증, 공통 예외 처리 로직을 포함합니다.

---

### **schemas.py**

- **역할**: API 요청 및 응답 데이터 구조를 정의합니다.
- **모델 정의**:
  - `TextRequest`/`TextResponse`: 텍스트 생성 API용 데이터 모델.
  - `ImageCreateRequest`/`ImageCreateResponse`: 이미지 생성 API용 데이터 모델.

---

### **openai_client.py**

- **역할**: OpenAI API와 통신하기 위한 클라이언트를 설정합니다.
- **주요 기능**:
  - `.env` 파일에서 API 키를 불러와 OpenAI 클라이언트(`AsyncOpenAI`)를 초기화합니다.
  - `openai_client_instance`: 전역 OpenAI 클라이언트 인스턴스를 제공합니다.

---

### **similar.py**

- **역할**: 텍스트 유사도를 계산하고, 데이터베이스의 항목과 입력 텍스트를 비교합니다.
- **주요 클래스**:
  - `CosineSimilarity`: 코사인 유사도를 계산하는 클래스.
  - `SimilarityService`: 입력 텍스트와 가장 유사한 항목을 데이터베이스에서 찾습니다.

---

### **db.py**

- **역할**: MySQL 데이터베이스 연결과 데이터 조회/저장을 담당합니다.
- **주요 클래스**:
  - `DatabaseConnection`: 비동기 MySQL 연결 풀 설정.
  - `DataService`: 쿼리 실행 및 데이터 조회 기능.
  - `MessageImageService`: 메시지 및 이미지 데이터를 관리하는 클래스.

---

### **main.py**

- **역할**: FastAPI 애플리케이션의 진입점입니다.
- **주요 기능**:
  - 텍스트 생성 및 이미지 생성 API 엔드포인트(`/text`, `/image`) 정의.
  - 데이터베이스 연결 및 서비스 초기화.
  - `uvicorn`을 통해 FastAPI 서버 실행.

---

### **환경 관련 파일**

- **`.env`**: OpenAI API 키와 같은 환경 변수를 설정합니다.
- **`requirements.txt`**: 프로젝트 실행에 필요한 Python 라이브러리 목록을 포함합니다.

---
