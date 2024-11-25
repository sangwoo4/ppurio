from fastapi import FastAPI
import uvicorn
import logging
from Utils.common_service import setup_logger
from Text.text_service import TextService
from Image.image_service import ImageService
from Utils.schemas import TextRequest, ImageCreateRequest
from Utils.db import DB_CONFIG, DatabaseConnection, DataService, MessageImageService

# 고유 로거 설정
fastapi_logger = setup_logger("base_logger")
db_logger = setup_logger("db_logger")
image_logger = setup_logger("image_logger")
text_logger = setup_logger("text_logger")
# 앱 초기화
app = FastAPI()

# 서비스 초기화
logger = logging.getLogger("base_logger")
logger.info("서비스 초기화 시작")

try:
    db_connection = DatabaseConnection(DB_CONFIG)
    data_service = DataService(db_connection)
    message_image_service = MessageImageService(data_service)
    logger.info("서비스 초기화 성공")
except Exception as e:
    logger.error(f"서비스 초기화 실패: {e}")
    raise RuntimeError("서비스 초기화 실패")

# 엔드포인트 등록
text_service = TextService()
image_service = ImageService(message_image_service)

@app.post("/text")
async def generate_text_endpoint(request: TextRequest):
    return await text_service.generate_text(request)

@app.post("/image")
async def generate_image_endpoint(request: ImageCreateRequest):
    return await image_service.generate_image(request)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
