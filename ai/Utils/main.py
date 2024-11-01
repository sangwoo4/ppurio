# uvicorn.py (ai/Utils)
import ai.Utils.main as main
from fastapi import FastAPI
from ai.Text.text import categorize, TextRequest, TextResponse
from ai.Image.image import generate_image_and_text, ImageCreateRequest

app = FastAPI()

@app.post("/text")
async def handle_text(request: TextRequest):
    response = await categorize(request)  # categorize 함수 호출 시 await 필요
    return response

@app.post("/image")
async def generate_image_endpoint(request: ImageCreateRequest):
    response = await generate_image_and_text(request)
    return response

if __name__ == "__main__":
    main.run("uvicorn:app", host="0.0.0.0", port=8000, reload=True)
