# openai_client.py

import requests
from fastapi import HTTPException
from dotenv import load_dotenv
import os

class OpenAIClient:
    BASE_URL = "https://api.openai.com/v1"

# OpenAI API 키를 기반으로 클라이언트 초기화.
    def __init__(self, api_key: str):

        if not api_key:
            raise ValueError("OpenAI API 키가 설정되지 않았습니다.")
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Connection": "keep-alive"  # 지속 연결 설정
        })

# OpenAI Chat API 요청을 보냅니다.
    def chat_completion(self, payload: dict) -> dict:

        url = f"{self.BASE_URL}/chat/completions"
        try:
            response = self.session.post(url, json=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API 요청 오류: {str(e)}")

# OpenAI 이미지 생성 API 요청을 보냅니다.
    def image_generation(self, payload: dict) -> dict:
        url = f"{self.BASE_URL}/images/generations"
        try:
            response = self.session.post(url, json=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API 요청 오류: {str(e)}")

# 클라이언트의 세션을 닫습니다.
    def close(self):
        self.session.close()


# 전역 OpenAIClient 객체 생성
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OpenAI API 키가 설정되지 않았습니다.")

# 전역 객체 생성
openai_client = OpenAIClient(api_key=api_key)
