# image_service.py
import random
import asyncio

from Utils.common_service import CommonService, LoggerManager
from Utils.schemas import ImageCreateRequest, ImageCreateResponse
from Utils.category_des import CategoryDescription
from Utils.openai_client import openai_client_instance
from Utils.db import MessageImageService
from Utils.similar import SimilarityService, CosineSimilarity

# Image 전용 로거 설정
image_logger = LoggerManager.get_logger("image_logger")

# SimilarityService 인스턴스 생성
similarity_service = SimilarityService(CosineSimilarity())

# 이미지 생성 서비스 클래스.
class ImageService(CommonService):
    def __init__(self, message_image_service: MessageImageService):
        super().__init__()
        self.message_image_service = message_image_service
        self.logger = image_logger

    # 새로운 이미지를 생성 및 데이터베이스 데이터 조회
    async def generate_image(self, request: ImageCreateRequest) -> ImageCreateResponse:
        try:
            self.log_request(request.model_dump())
            self.logger.info("이미지 생성 요청 시작")

            # 데이터베이스 조회
            db_data = await self._fetch_db_data(request.category)

            if not db_data:
                self.logger.info("데이터베이스에서 기존 데이터를 찾을 수 없습니다. 새 이미지를 생성합니다.")
                return await self._generate_new_image(request)

            # 유사도 계산 및 기존 이미지 재사용
            similar_entry = similarity_service.find_similar_entry(request.text, db_data)
            if similar_entry:
                self.logger.info(f"유사한 이미지 발견. URL: {similar_entry['image_url']}")
                
                # 랜덤 대기 시간 적용
                delay = random.uniform(4, 6)
                self.logger.info(f"랜덤 대기 시간 적용 중: {delay:.2f}초")
                await asyncio.sleep(delay)
                self.logger.info("랜덤 대기 시간이 완료되었습니다.")
                
                return ImageCreateResponse(url=similar_entry["image_url"])

            self.logger.info("유사한 이미지가 없어 새 이미지를 생성합니다.")
            return await self._generate_new_image(request)

        except Exception as e:
            self.logger.error(f"이미지 생성 중 오류 발생: {str(e)}", exc_info=True)
            self.handle_api_error(e)

    # 새 이미지를 생성하고, 생성된 이미지의 URL을 반환합니다.
    async def _generate_new_image(self, request: ImageCreateRequest) -> ImageCreateResponse:
        try:
            # 카테고리 설명 확장
            self.logger.info("새로운 이미지를 생성합니다.")
            category_description = self.validate_category(
                request.category, CategoryDescription.CATEGORY_DESCRIPTIONS_IMAGE
            )
            self.logger.info(f"카테고리 설명: {category_description}")

            # 프롬프트 생성
            prompt = self._create_prompt(request, category_description)
            self.logger.info(f"생성된 프롬프트: {prompt}")

            # OpenAI API 호출
            image_url = await self._call_openai_api(prompt)
            return ImageCreateResponse(url=image_url)
        except Exception as e:
            self.logger.error(f"새로운 이미지 생성 중 오류 발생: {str(e)}", exc_info=True)
            raise

    # 이미지 생성은 요청된 텍스트, 키워드, 업종, 분위기 및 카테고리 설명을 바탕으로 생성.
    def _create_prompt(self, request: ImageCreateRequest, category_description: str) -> str:
        return (
                "Create a photorealistic and visually compelling image that reflects the following details while avoiding any form of text, numbers, symbols, or letters in the image.\n"
                "Focus solely on visual elements.\n"
                "Use vibrant and expressive visuals to convey the atmosphere and context based on the given details\n"
                f"내용: {request.text}\n"
                f"키워드: {', '.join(request.keyword or [])}\n"
                f"분위기: {', '.join(request.mood or [])}\n"
                f"카테고리: {category_description}\n"
                "Do not include any text, words, numbers, or symbols in the image. Instead, rely on colors, objects, and design elements to represent these ideas visually.\n"
                "The output should be a high-quality image with precise details and artistic depth, capturing the requested scene and emotions perfectly.\n"
        )

    # OpenAI API를 호출하여 이미지를 생성하고, 생성된 이미지의 URL을 반환합니다.
    async def _call_openai_api(self, prompt: str) -> str:
        self.logger.info("OpenAI API를 호출하여 이미지를 생성합니다.")
        try:
            image_response = await openai_client_instance.images.generate(
                model="dall-e-3",
                prompt=prompt,
                n=1,
                size="1024x1024"
            )
            self.logger.info(f"OpenAI API 호출 성공. 응답 데이터: {image_response}")
            return image_response.data[0].url
        except Exception as e:
            self.logger.error(f"OpenAI API 호출 중 오류 발생: {str(e)}", exc_info=True)
            raise

    # 데이터베이스에서 지정된 카테고리에 해당하는 메시지 및 이미지 데이터를 조회합니다.
    async def _fetch_db_data(self, category: str):
        try:
            self.logger.info(f"카테고리 '{category}'에 대해 데이터베이스 조회를 시작합니다.")
            db_data = await self.message_image_service.fetch_message_and_image(category)
            return db_data
        except Exception as e:
            self.logger.error(f"데이터베이스 조회 중 오류 발생: {str(e)}", exc_info=True)
            raise
