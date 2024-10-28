# image.py (ai/Image)
import os
import logging
import requests
import uuid
from fastapi import HTTPException
from openai import AsyncOpenAI
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
from ai.Utils.schemas import ImageCreateRequest, ImageCreateResponse, ImageEditRequest, ImageEditResponse

# .env 파일 로드
load_dotenv()

# OpenAI API Key 설정
openai_api_key = os.getenv("openai_api_key")
if not openai_api_key:
    raise ValueError("API 키가 설정되지 않았습니다.")

# OpenAI 클라이언트 설정
client = AsyncOpenAI(api_key=openai_api_key)

# 로그 설정
def logger_setup():
    logging.basicConfig(level=logging.INFO)
    return logging.getLogger(__name__)

logger = logger_setup()

# 이미지 저장 디렉토리 설정
IMAGE_STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ImageStorage'))

# 디렉토리가 없으면 생성
if not os.path.exists(IMAGE_STORAGE_DIR):
    os.makedirs(IMAGE_STORAGE_DIR)

# 비동기 이미지 생성 함수
async def generate_image(request: ImageCreateRequest) -> ImageCreateResponse:
    try:
        logger.info(f"요청받음 - 설명: {request.prompt}")

        # 비동기 OpenAI 이미지 생성 API 호출
        response = await client.images.generate(
            model="dall-e-3",
            prompt=request.prompt,
            n=1,  # 생성할 이미지 수
            size="1024x1024"
        )

        image_url = response.data[0].url
        logger.info(f"OpenAI로부터 받은 이미지 URL: {image_url}")

        # 이미지 다운로드 및 JPG로 변환
        image = download_image(image_url)
        jpg_image_path = convert_image_to_jpg(image)

        # 이미지 파일 이름 추출
        image_filename = os.path.basename(jpg_image_path)

        # 접근 가능한 URL 생성(AWS 미구현으로 임시로 localhost로 지정)
        image_access_url = f"http://localhost:8000/images/{image_filename}"

        # 변환된 이미지 파일 경로 반환
        return ImageCreateResponse(image_url=image_access_url)

    except Exception as e:
        logger.error(f"오류 발생: {e}")
        raise HTTPException(status_code=500, detail="이미지 생성 중 오류가 발생했습니다.")

# 이미지 URL에서 이미지를 다운로드하는 함수
def download_image(image_url):
    response = requests.get(image_url)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="이미지 다운로드 실패")
    return Image.open(BytesIO(response.content))


# 이미지를 JPG 형식으로 변환하고 저장하는 함수
def convert_image_to_jpg(image):
    if image.mode in ("RGBA", "LA"):
        # RGBA 또는 LA 모드를 RGB 모드로 변환하여 배경을 하얗게 설정
        background = Image.new("RGB", image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[3])  # 알파 채널을 마스크로 사용하여 붙여넣기
    else:
        background = image.convert("RGB")  # RGB 모드로 변환

    # 이미지 파일 저장 경로 생성 (절대 경로 확인 및 출력)
    image_filename = f"{uuid.uuid4()}.jpg"
    image_path = os.path.join(IMAGE_STORAGE_DIR, image_filename)
    image_path = os.path.abspath(image_path)  # 절대 경로로 변환하여 저장 위치 명확히 확인
    logger.info(f"이미지 저장 경로: {image_path}")

    # JPG 형식으로 변환 및 저장 (용량을 줄이기 위해 품질과 최적화 설정)
    background.save(image_path, format="JPEG", quality=50, optimize=True)

    return image_path

# 이미지 편집 기능은 현재 미완성
# DALL·E 2 API를 사용하여 이미지를 수정하는 함수
async def edit_image_with_dalle(image, mask, description):
    try:
        # PIL 이미지 객체를 PNG로 변환
        png_image = convert_image_to_jpg(image)
        png_mask = convert_image_to_jpg(mask)
        
        # DALL·E 2 API 호출
        response = await client.images.edit(
            image=png_image,   # PNG 형식의 이미지 전달
            mask=png_mask,     # PNG 형식의 마스크 전달
            prompt=description,  # 한국어로 자연어 설명
            n=1,
            size="1024x1024"
        )

        # 수정된 이미지 URL 반환
        return response.data[0].url
    except Exception as e:
        logger.error(f"DALL·E 2 처리 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="DALL·E 2 이미지 편집 실패")

# POST 요청을 처리하는 엔드포인트
async def modify_image(request: ImageEditRequest):
    try:
        logger.info(f"요청 받음 - 이미지 URL: {request.url}, 마스크 URL: {request.mask_url}, 설명: {request.description}")

        # 1단계: URL로부터 이미지를 다운로드
        image = download_image(request.url)
        mask = download_image(request.mask_url)  # 마스크 이미지 다운로드

        # 2단계: DALL·E 2를 사용하여 이미지 수정 (description에 따라)
        modified_image_url = await edit_image_with_dalle(image, mask, request.description)

        # 3단계: 수정된 이미지의 URL 반환
        return ImageEditResponse(modified_image_url=modified_image_url)

    except Exception as e:
        logger.error(f"오류 발생: {e}")
        raise HTTPException(status_code=500, detail="이미지 변형 실패")