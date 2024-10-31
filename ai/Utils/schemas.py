# schemas.py (ai/Utils)
from pydantic import BaseModel
from typing import List, Optional

class TextRequest(BaseModel):
    text: str
    filed: str
    hashtag: Optional[List[str]] = None
    mood: Optional[List[str]] = None

class TextResponse(BaseModel):
    response: str