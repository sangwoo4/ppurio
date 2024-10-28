# schemas.py (ai/Utils)
from pydantic import BaseModel
from typing import List, Optional

class TextRequest(BaseModel):
    input: str
    hashtag: Optional[List[str]] = None

class TextResponse(BaseModel):
    response: str

class ImageCreateRequest(BaseModel):
    prompt: str

class ImageCreateResponse(BaseModel):
    image_url: str

# 요청 및 응답을 위한 Pydantic 모델 정의
class ImageEditRequest(BaseModel):
    url: str  # 이미지 URL (1024x1024)
    mask_url: str  # 마스크 이미지 URL
    description: str  # 수정할 내용 (한국어)

class ImageEditResponse(BaseModel):
    modified_image_url: str  # 수정된 이미지 URL