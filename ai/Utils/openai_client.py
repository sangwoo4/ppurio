# openai_client.py
from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

# OpenAI 클라이언트 초기화 및 관리 클래스.
# .env 파일 로드 및 API 키 초기화.
class OpenAIClient:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("openai_api_key")
        if not self.api_key:
            raise ValueError("OpenAI API 키가 설정되지 않았습니다.")
        self.client = AsyncOpenAI(api_key=self.api_key)

    def get_client(self):
        return self.client

# 다른 모듈에서 재사용할 수 있도록 전역 클라이언트 인스턴스 제공.
openai_client_instance = OpenAIClient().get_client()
