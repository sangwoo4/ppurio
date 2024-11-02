# text.py (ai/Text)
import os
import logging
from typing import List
from fastapi import HTTPException
from openai import AsyncOpenAI
from dotenv import load_dotenv
from ai.Utils.schemas import TextRequest, TextResponse

# .env 파일 로드
load_dotenv()
# OpenAI API Key 설정
openai_api_key = os.getenv("openai_api_key")
if not openai_api_key:
    raise ValueError("API 키가 설정되지 않았습니다.")

# OpenAI 클라이언트 설정
client = AsyncOpenAI(api_key=openai_api_key)

def logger_setup():
    logging.basicConfig(level=logging.INFO)
    return logging.getLogger(__name__)

logger = logger_setup()

async def generate_text(request: TextRequest) -> TextResponse:
    try:
        logger.info(f"요청받음 - 입력: {request.text}\n해시태그: {request.hashtag}\n"
                    f"업종명: {request.field}\n 분위기:{request.mood}\n")

        # Chat 형식 메시지 작성
        messages = [
            {"role": "system", "content": "You are a helpful assistant for creating text messages"},
            {"role": "user", "content": 
             f"내용: {request.text}\n"
             f"해시태그: {', '.join(request.hashtag or [])}\n"
            "해당 해시태그를 반드시 문자 메세지 본문에 단어로 포함해서 적절하게 생성해줘.\n"
             f"업종명: {request.field}\n"
             f"분위기: {', '.join(request.mood or [])}\n"
            "전달 받은 업종명과 분위기에 따라 텍스트의 분위기를 설정해줘"
             } 
        ]
        # OpenAI Chat API 요청
        text = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1000,
            temperature=0.5,
            top_p=0.5,
            frequency_penalty=0.5,
            presence_penalty=0.5,
        )

        # 응답 처리
        text_response = text.choices[0].message.content.strip()
        logger.info(f"OpenAI로부터 받은 응답: {text_response}")

        if not text_response:
            raise HTTPException(status_code=500, detail="OpenAI로부터 응답이 없습니다")

        return TextResponse(text=text_response)

    except Exception as e:
        logger.error(f"오류 발생: {e}")
        raise HTTPException(status_code=500, detail="OpenAI 응답 처리 중 오류가 발생했습니다.")