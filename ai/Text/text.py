# text.py

from ai.Utils.common_service import CommonService
from ai.Utils.schemas import TextRequest, TextResponse
from ai.Utils.category_des import CategoryDescription
from ai.Utils.openai_client import openai_client

class TextService(CommonService):
   async def generate_text(self, request: TextRequest) -> TextResponse:
        try:
            self.log_request(request.model_dump())

            category_description = self.validate_category(
                request.category, CategoryDescription.CATEGORY_DESCRIPTIONS_TEXT
            )
            self.logger.info(f"카테고리 설명: {category_description}")

            messages = [
                {"role": "system", "content": "You are a helpful assistant for creating text messages."},
                {"role": "user", "content": 
                 f"내용: {request.text}\n"
                 f"장문의 문자 메세지 형식으로 작성해줘\n"
                 f"키워드: {', '.join(request.keyword or [])}\n"
                 "해당 키워드들 중 2개를 반드시 문자 메세지 본문에 포함해서 생성해줘.\n"
                 f"업종명: {request.field}\n"
                 f"분위기: {', '.join(request.mood or [])}\n"
                 f"카테고리: {category_description}"
                 }
            ]

            payload = {
                "model": "gpt-4o-mini",
                "messages": messages,
                "max_tokens": 750,
                "temperature": 1.0,
                "top_p": 0.5,
                "frequency_penalty": 0.5,
                "presence_penalty": 0.5,
            }

            response = openai_client.session.post(
                f"{openai_client.BASE_URL}/chat/completions", json=payload
            )
            response.raise_for_status()
            response_data = response.json()

            text_response = response_data.get("choices", [])[0].get("message", {}).get("content", "").strip()
            self.logger.info(f"OpenAI 응답: {text_response}")
            return TextResponse(text=text_response)

        except Exception as e:
            self.handle_api_error(e)
