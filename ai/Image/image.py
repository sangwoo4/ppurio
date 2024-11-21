# image.py

from ai.Utils.common_service import CommonService
from ai.Utils.schemas import ImageCreateRequest, ImageCreateResponse
from ai.Utils.category_des import CategoryDescription
from ai.Utils.openai_client import openai_client

class ImageService(CommonService):
    async def generate_image(self, request: ImageCreateRequest) -> ImageCreateResponse:
        try:
            self.log_request(request.model_dump())

            # 카테고리 설명 확장
            category_description = self.validate_category(
                request.category, CategoryDescription.CATEGORY_DESCRIPTIONS_IMAGE
            )
            self.logger.info(f"카테고리 설명: {category_description}")

            prompt = (
                f"내용: {request.text}\n"
                f"키워드: {', '.join(request.keyword or [])}\n"
                "해당 키워드 중 최대 2개를 이미지 안에 포함해서 생성.\n"
                f"업종명: {request.field}\n"
                f"분위기: {', '.join(request.mood or [])}\n"
                f"카테고리: {category_description}"
            )

            payload = {
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
            }

            response = openai_client.session.post(
                f"{openai_client.BASE_URL}/images/generations", json=payload
            )
            response.raise_for_status()
            response_data = response.json()

            image_url = response_data.get("data", [{}])[0].get("url")
            self.logger.info(f"OpenAI 이미지 URL: {image_url}")
            return ImageCreateResponse(url=image_url)

        except Exception as e:
            self.handle_api_error(e)