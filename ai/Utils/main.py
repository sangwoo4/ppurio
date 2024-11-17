# uvicorn.py (ai/Utils)
import ai.Utils.main as main
from fastapi import FastAPI
from ai.Text.text import generate_text, TextRequest
from ai.Image.image import generate_image_and_text, ImageCreateRequest
from ai.Image.image import generate_image, ImageCreateRequest
from ai.Image.image import generate_new_image, ImageCreateRequest

app = FastAPI()

@app.post("/text")
async def generate_text_endpoint(request: TextRequest):
    response = await generate_text(request)
    return response

@app.post("/text/image")
async def generate_image_text_endpoint(request: ImageCreateRequest):
    response = await generate_image_and_text(request)
    return response

@app.post("/image")
async def generate_image_endpoint(request: ImageCreateRequest):
    response = await generate_image(request)
    return response

@app.post("/new/image")
async def generate_image_endpoint(request: ImageCreateRequest):
    response = await generate_new_image(request)
    return response

if __name__ == "__main__":
    main.run("uvicorn:app", host="0.0.0.0", port=8000, reload=True)
