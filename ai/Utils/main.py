# main.py
import uvicorn

from fastapi import FastAPI
from Utils.common_service import LoggerManager
from Text.text_service import TextService
from Image.image_service import ImageService
from Utils.schemas import TextRequest, ImageCreateRequest
from Utils.db import DB_CONFIG, DatabaseConnection, DataService, MessageImageService

# 로거 설정
fastapi_logger = LoggerManager.get_logger("base_logger")

# FastAPI 앱 생성
app = FastAPI()

# 서비스 초기화
try:
    db_connection = DatabaseConnection(DB_CONFIG)
    data_service = DataService(db_connection)
    message_image_service = MessageImageService(data_service)
    text_service = TextService()
    image_service = ImageService(message_image_service)
    fastapi_logger.info("서비스 초기화 성공")
except Exception as e:
    fastapi_logger.error(f"서비스 초기화 실패: {e}")
    raise RuntimeError("서비스 초기화 실패")

# 엔드포인트 등록
@app.post("/text")
async def generate_text_endpoint(request: TextRequest):
    return await text_service.generate_text(request)

@app.post("/image")
async def generate_image_endpoint(request: ImageCreateRequest):
    return await image_service.generate_image(request)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
