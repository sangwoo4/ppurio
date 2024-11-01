# uvicorn.py (ai/Utils)
import Utils.main as main
from fastapi import FastAPI
from Text.text import categorize, TextRequest, TextResponse

app = FastAPI()

@app.post("/text")
async def handle_text(request: TextRequest):
    response = await categorize(request)  # categorize 함수 호출 시 await 필요
    return response

if __name__ == "__main__":
    main.run("uvicorn:app", host="0.0.0.0", port=8000, reload=True)
