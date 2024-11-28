# schemas.py
from pydantic import BaseModel
from typing import List, Optional

# 문자 생성 요청
class TextRequest(BaseModel):
    text: str
    category: Optional [str] = None
    keyword: Optional[List[str]] = None
    mood: Optional[List[str]] = None
# 문자 생성 응답
class TextResponse(BaseModel):
    text: str

# 이미지 생성 요청
class ImageCreateRequest(BaseModel):
    text: str
    category: Optional [str] = None
    keyword: Optional[List[str]] = None
    mood: Optional[List[str]] = None

# 이미지 생성 응답
class ImageCreateResponse(BaseModel):
    url: str