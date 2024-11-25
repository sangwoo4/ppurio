# text_service.py
from Utils.common_service import CommonService, LoggerManager
from Utils.schemas import TextRequest, TextResponse
from Utils.category_des import CategoryDescription
from Utils.openai_client import openai_client_instance

# Text 전용 로거 설정
text_logger = LoggerManager.get_logger("text_logger")

# 문자 생성 서비스 클래스.
class TextService(CommonService):
    def __init__(self):
        super().__init__()
        self.logger = text_logger
    # 문자 생성 요청을 처리합니다.
    async def generate_text(self, request: TextRequest) -> TextResponse:
        try:
            self.log_request(request.model_dump())
            self.logger.info("문자 생성 요청 시작")

            # 카테고리 설명 확장
            category_description = self._get_category_description(request.category)
            self.logger.info(f"카테고리 설명: {category_description}")

            # 프롬프트 생성 및 OpenAI API 호출
            messages = self._create_prompt(request, category_description)
            text_response = await self._call_openai_api(messages)
            self.logger.info(f"OpenAI로부터 받은 응답: {text_response}")

            return TextResponse(text=text_response)
        except Exception as e:
            self.logger.error(f"문자 생성 중 오류 발생: {str(e)}", exc_info=True)
            self.handle_api_error(e)

    # 카테고리 설명을 가져옵니다.
    def _get_category_description(self, category: str) -> str:
        return self.validate_category(
            category, CategoryDescription.CATEGORY_DESCRIPTIONS_TEXT
        )

    # 문자 생성은 요청된 텍스트, 키워드, 업종, 분위기 및 카테고리 설명을 바탕으로 작성.
    def _create_prompt(self, request: TextRequest, category_description: str):
        return [
            {
                "role": "system",
                "content": (
                    "당신은 전문적인 문자 메시지 작성을 돕는 어시스턴트입니다. "
                    "항상 지시사항을 충실히 따르고, 명확하고 오류가 없는 메시지를 작성하세요."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"내용: {request.text}\n"
                    f"키워드: {', '.join(request.keyword or [])}\n"
                    "위 키워드 중 2개 이상을 반드시 문자 메시지 본문에 포함시켜 작성해주세요.\n"
                    f"분위기: {', '.join(request.mood or [])}\n"
                    f"카테고리: {category_description}\n"
                    "전달받은 업종명, 분위기, 카테고리를 고려하여 적절한 문자 메세지를 작성해주세요.\n"
                    "문자 메시지는 간결하고 명확해야 하며, 300자 이내로 작성해주세요.\n"
                    "추가적으로 문자 메시지는 읽는 사람이 즉시 이해할 수 있도록 작성되어야 합니다."
                ),
            },
        ]
    # OpenAI API를 호출하여 문자 생성을 수행합니다.
    async def _call_openai_api(self, messages: list) -> str:
        self.logger.info("OpenAI API를 호출하여 문자를 생성합니다.")
        try:
            response = await openai_client_instance.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=350,
                temperature=1.0,
                top_p=0.5,
                frequency_penalty=0.5,
                presence_penalty=0.5,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            self.logger.error(f"OpenAI API 호출 중 오류 발생: {str(e)}", exc_info=True)
            raise