from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

class OpenAIClient:
    def __init__(self):
        # .env 파일 로드
        load_dotenv()

        # OpenAI API 키 설정
        self.api_key = os.getenv("openai_api_key")
        if not self.api_key:
            raise ValueError("OpenAI API 키가 설정되지 않았습니다.")

        # AsyncOpenAI 클라이언트 생성
        self.client = AsyncOpenAI(api_key=self.api_key)

    def get_client(self):
        return self.client


# 전역 OpenAIClient 인스턴스 생성
openai_client_instance = OpenAIClient()
openai_client = openai_client_instance.get_client()
