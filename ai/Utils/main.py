# main.py

import logging
from fastapi import FastAPI
from ai.Text.text import TextService
from ai.Image.image import ImageService
from ai.Utils.schemas import TextRequest, ImageCreateRequest

logger = logging.getLogger("uvicorn.error")
app_logger = logging.getLogger("uvicorn.access")

# FastAPI 앱 초기화
app = FastAPI()

# 서비스 초기화
text_service = TextService()
image_service = ImageService()

@app.post("/text")
async def generate_text_endpoint(request: TextRequest):
    return await text_service.generate_text(request)

@app.post("/image")
async def generate_image_endpoint(request: ImageCreateRequest):
    return await image_service.generate_image(request)
