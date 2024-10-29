# uvicorn.py (ai/Utils)
import ai.Utils.main as main
from fastapi import FastAPI
from ai.Text.text import generate_text, TextRequest, TextResponse
from ai.Image.image import generate_image, ImageCreateRequest, ImageCreateResponse
from ai.Image.image import modify_image, ImageEditResponse, ImageEditRequest

app = FastAPI()

@app.post("/text")
async def generate_text_endpoint(request: TextRequest):
    response = await generate_text(request)  # categorize 함수 호출 시 await 필요
    return response

@app.post("/image")
async def generate_image_endpoint(request: ImageCreateRequest):
    response = await generate_image(request)
    return response

@app.post("/test")
async def modify_image_endpoint(request: ImageEditRequest):
    resposne = await modify_image(request)
    return resposne

if __name__ == "__main__":
    main.run("uvicorn:app", host="0.0.0.0", port=8000, reload=True)
