# image_service.py

from Utils.common_service import CommonService, setup_logger
from Utils.schemas import ImageCreateRequest, ImageCreateResponse
from Utils.category_des import CategoryDescription
from Utils.openai_client import openai_client
from Utils.db import MessageImageService
from Utils.similar import SimilarityCalculator, CosineSimilarity

# Image 전용 로거 설정
image_logger = setup_logger("image_logger")

class ImageService(CommonService):
    def __init__(self, message_image_service: MessageImageService):
        super().__init__()
        self.message_image_service = message_image_service
        self.logger = image_logger

    async def generate_image(self, request: ImageCreateRequest) -> ImageCreateResponse:
        try:
            # 요청 데이터 로깅
            self.log_request(request.model_dump())
            self.logger.info("이미지 생성 요청 시작")

            # 데이터베이스 조회
            db_data = await self._fetch_db_data(request.category)
            self.logger.info(f"데이터베이스 조회 완료. 데이터 개수: {len(db_data)}")

            # 유사도 계산 및 기존 이미지 재사용
            reused_image_url = self._calculate_similarity_and_reuse(db_data, request.text)
            if reused_image_url:
                return ImageCreateResponse(url=reused_image_url)

            # 새로운 이미지 생성
            return await self._generate_new_image(request)

        except Exception as e:
            self.logger.error(f"이미지 생성 중 오류 발생: {str(e)}", exc_info=True)
            self.handle_api_error(e)

    async def _fetch_db_data(self, category: str):
        """
        데이터베이스에서 메시지 및 이미지 데이터를 가져옵니다.
        """
        try:
            self.logger.info(f"카테고리 '{category}'에 대해 데이터베이스 조회를 시작합니다.")
            db_data = await self.message_image_service.fetch_message_and_image(category)
            return db_data
        except Exception as e:
            self.logger.error(f"데이터베이스 조회 중 오류 발생: {str(e)}", exc_info=True)
            raise

    def _calculate_similarity_and_reuse(self, db_data, request_text):
        """
        데이터베이스에서 가져온 데이터와 요청 텍스트 간의 유사도를 계산하고
        기존 이미지를 재사용할 수 있는 경우 URL을 반환합니다.
        """
        if not db_data:
            self.logger.info("데이터베이스에 기존 데이터가 없습니다.")
            return None

        self.logger.info("유사도 계산을 시작합니다.")
        similarity_calculator = SimilarityCalculator(CosineSimilarity())
        for entry in db_data:
            similarity = similarity_calculator.calculate(request_text, entry["user_prompt"])
            self.logger.info(f"유사도 계산 결과: '{entry['user_prompt']}'와의 유사도 = {similarity}")
            if similarity > 0.65:
                self.logger.info("유사도가 기준치(0.65)를 초과했습니다. 기존 이미지를 재사용합니다.")
                self.logger.info(f"재사용된 이미지 URL: {entry['image_url']}")
                return entry["image_url"]

        self.logger.info("유사도 기준치를 초과하는 데이터가 없어 새로운 이미지 생성이 필요합니다.")
        return None

    async def _generate_new_image(self, request: ImageCreateRequest) -> ImageCreateResponse:
        """
        새로운 이미지를 생성합니다.
        """
        try:
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

    def _create_prompt(self, request: ImageCreateRequest, category_description: str) -> str:
        """
        이미지 생성을 위한 프롬프트를 생성합니다.
        """
        return (
                "Create a photorealistic and visually compelling image that reflects the following details while avoiding any form of text, numbers, symbols, or letters in the image.\n"
                "Focus solely on visual elements.\n"
                "Use vibrant and expressive visuals to convey the atmosphere and context based on the given details\n"
                f"내용: {request.text}\n"
                f"키워드: {', '.join(request.keyword or [])}\n"
                f"업종명: {request.field}\n"
                f"분위기: {', '.join(request.mood or [])}\n"
                f"카테고리: {category_description}\n"
                "Do not include any text, words, numbers, or symbols in the image. Instead, rely on colors, objects, and design elements to represent these ideas visually.\n"
                "The output should be a high-quality image with precise details and artistic depth, capturing the requested scene and emotions perfectly.\n"
        )

    async def _call_openai_api(self, prompt: str) -> str:
        """
        OpenAI API를 호출하여 이미지를 생성하고 URL을 반환합니다.
        """
        self.logger.info("OpenAI API를 호출하여 이미지를 생성합니다.")
        try:
            image_response = await openai_client.images.generate(
                model="dall-e-3", prompt=prompt, n=1, size="1024x1024"
            )
            self.logger.info(f"OpenAI API 호출 성공. 응답 데이터: {image_response}")
            return image_response.data[0].url
        except Exception as e:
            self.logger.error(f"OpenAI API 호출 중 오류 발생: {str(e)}", exc_info=True)
            raise