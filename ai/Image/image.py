    # image.py (ai/Image)
import os
import logging
from typing import List
from fastapi import HTTPException
from openai import AsyncOpenAI
from dotenv import load_dotenv
from Utils.schemas import ImageCreateRequest, ImageCreateResponse

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

# 비동기 이미지 생성 및 텍스트 생성 함수
async def generate_image_and_text(request: ImageCreateRequest) -> ImageCreateResponse:
    try:
        logger.info(f"요청받음 - {ImageCreateRequest}\n")

        # Chat 형식 메시지 작성
        messages = (
            "당신은 제공된 요청을 문자 메시지를 작성하는 데 도움을 주는 유용한 도우미입니다. "
            f"내용: {request.text}\n"
            f"해시태그: {', '.join(request.hashtag or [])}\n"
            "해당 해시태그를 반드시 문자 메세지 본문에 단어로 포함해서 적절하게 생성해줘.\n"
            f"업종명: {request.field}\n"
            f"분위기: {', '.join(request.mood or [])}\n"
            "전달 받은 업종명과 분위기에 따라 텍스트의 분위기를 설정해줘"
        )

        # 비동기 OpenAI 텍스트 생성 API 호출
        text_response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 제공된 해시태그를 문자 메시지 본문에 추가하여 작성하는 데 도움을 주는 유용한 도우미입니다."},
                {"role": "user", "content": messages}
            ],
            max_tokens=1000,
            temperature=0.5,
            top_p=0.5,
            frequency_penalty=0.5,
            presence_penalty=0.5,
        )

        text = text_response.choices[0].message.content.strip()
        logger.info(f"OpenAI로부터 받은 텍스트: {text}")

        # prompt를 문자열로 변환
        prompt = (
            "You are a helpful assistant creating images for text messages"
            f"내용: {request.text}\n"
            f"해시태그: {', '.join(request.hashtag or [])}\n"
            "해당 해시태그를 핵심 내용으로 적절한 이미지를 생성해줘.\n"
            f"업종명: {request.field}\n"
            f"분위기: {', '.join(request.mood or [])}\n"
            "전달 받은 업종명과 분위기에 따라 이미지의 분위기를 설정해줘"
        )

        # 비동기 OpenAI 이미지 생성 API 호출
        image_response = await client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,  # 생성할 이미지 수
            size="1024x1024"
        )

        url = image_response.data[0].url
        logger.info(f"OpenAI로부터 받은 이미지 URL: {url}")

        # 변환된 이미지 파일 경로 및 생성된 텍스트 반환
        return ImageCreateResponse(url=url, text=text)

    except Exception as e:
        logger.error(f"오류 발생: {e}")
        raise HTTPException(status_code=500, detail="이미지 및 텍스트 생성 중 오류가 발생했습니다.")