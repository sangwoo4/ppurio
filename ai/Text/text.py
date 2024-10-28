# text.py (ai/Text)
import os
import logging
from typing import List
from fastapi import HTTPException
from openai import AsyncOpenAI
from ai.Utils.schemas import TextRequest, TextResponse

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

async def categorize(request: TextRequest) -> dict:
    try:
        logger.info(f"요청받음 - 입력: {request.input}\n해시태그: {request.hashtag}")

        # Chat 형식 메시지 작성
        messages = [
            {"role": "system", "content": "You are a helpful assistant for creating text messages that must include the provided hashtags."},
            {"role": "user", "content": f"내용: {request.input}\n해시태그: {', '.join(request.hashtag)}\n이 해시태그를 반드시 포함하여 적절한 문자 메세지 형식을 제안해 주세요."} 
        ]

        # OpenAI Chat API 요청
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=500,
            temperature=0.5,
            top_p=0.5,
            frequency_penalty=0.5,
            presence_penalty=0.5,
        )

        # 응답 처리
        text_response = response.choices[0].message.content.strip()
        logger.info(f"OpenAI로부터 받은 응답: {text_response}")

        # 서두 제거: 첫 번째 빈 줄 이후 내용만 추출
        split_response = text_response.split("\n\n", 1)
        if len(split_response) > 1:
            text_response = split_response[1].strip()
        logger.info(f"OpenAI로부터 받은 응답(서두 제거 후): {text_response}")

        # 마지막 문장 제거: 마지막 빈 줄 이전 내용만 추출
        split_response = text_response.rsplit("\n\n", 1)
        text_response = split_response[0].strip()
        logger.info(f"OpenAI로부터 받은 응답(서두 및 마지막 문장 제거 후): {text_response}")

        if not text_response:
            raise HTTPException(status_code=500, detail="OpenAI로부터 응답이 없습니다")

        return {"response": text_response}

    except Exception as e:
        logger.error(f"오류 발생: {e}")
        raise HTTPException(status_code=500, detail="OpenAI 응답 처리 중 오류가 발생했습니다.")