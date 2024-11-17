# schemas.py (ai/Utils)
from pydantic import BaseModel
from typing import List, Optional

class TextRequest(BaseModel):
    text: str
    field: str
    category: Optional [str] = None
    keyword: Optional[List[str]] = None
    mood: Optional[List[str]] = None

class TextResponse(BaseModel):
    text: str

class ImageCreateRequest(BaseModel):
    text: str
    field: str
    category: Optional [str] = None
    keyword: Optional[List[str]] = None
    mood: Optional[List[str]] = None

class ImageTextCreateResponse(BaseModel):
    text: str
    url: str

class ImageCreateResponse(BaseModel):
    url: str