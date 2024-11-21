# import os
# import logging
# import requests
# from PIL import Image, ImageDraw, ImageFont
# from fastapi import HTTPException
# from openai import AsyncOpenAI
# from dotenv import load_dotenv
# from io import BytesIO
# from diffusers import StableDiffusionPipeline, ControlNetModel
# import pytesseract

# from ai.Utils.schemas import ImageCreateRequest, ImageCreateResponse, ImageTextCreateResponse
# from ai.Utils.category_des import CATEGORY_DESCRIPTIONS_TEXT,CATEGORY_DESCRIPTIONS_IMAGE

# # .env 파일 로드
# load_dotenv()

# # OpenAI API Key 설정
# openai_api_key = os.getenv("openai_api_key")
# if not openai_api_key:
#     raise ValueError("API 키가 설정되지 않았습니다.")

# huggingface_token = os.getenv("HUGGINGFACE_TOKEN")
# if not huggingface_token:
#     raise ValueError("Hugging Face 토큰이 설정되지 않았습니다.")

# # OpenAI 클라이언트 설정
# client = AsyncOpenAI(api_key=openai_api_key)

# # ControlNet 모델 로드
# controlnet = ControlNetModel.from_pretrained(
#     "lllyasviel/control_v11p_sd15_canny",
#     use_auth_token=huggingface_token
# )

# # Stable Diffusion 파이프라인 로드
# pipeline = StableDiffusionPipeline.from_pretrained(
#     "runwayml/stable-diffusion-v1-5",
#     controlnet=controlnet,
#     use_auth_token=huggingface_token
# )
# pipeline.enable_attention_slicing()

# # 로그 설정
# def logger_setup():
#     logging.basicConfig(level=logging.INFO)
#     return logging.getLogger(__name__)

# logger = logger_setup()

# # 한글 폰트를 동적으로 검색하는 함수
# def get_korean_font():
#     font_path = None
#     if os.name == 'nt':  # Windows
#         font_path = "C:/Windows/Fonts/malgun.ttf"  # 맑은 고딕
#     elif os.name == 'posix':  # Linux
#         font_path = "/usr/share/fonts/truetype/nanum/NanumGothic.ttf"
#     if not font_path or not os.path.exists(font_path):
#         raise FileNotFoundError(f"지정된 폰트 파일을 찾을 수 없습니다: {font_path}")
#     return font_path

# # OpenAI DALL·E 이미지 생성
# async def generate_dalle_image(prompt):
#     try:
#         response = await client.images.generate(
#             model="dall-e-3",
#             prompt=prompt,
#             n=1,
#             size="1024x1024"
#         )
#         logger.info(f"OpenAI API 응답: {response}")
#         # 응답 데이터에서 URL을 안전하게 가져옵니다.
#         image_url = response.data[0].url if response.data else None
#         if not image_url:
#             raise ValueError("이미지 URL을 가져올 수 없습니다.")
#         return image_url
#     except Exception as e:
#         logger.error(f"이미지 생성 중 오류 발생: {e}")
#         raise HTTPException(status_code=500, detail="이미지 생성 중 오류가 발생했습니다.")

# # ControlNet을 사용한 텍스트 삽입
# def add_text_with_controlnet(image_url, prompt, output_path):
#     response = requests.get(image_url)
#     input_image = Image.open(BytesIO(response.content)).resize((512, 512))

#     # ControlNet 사용하여 텍스트 추가
#     result_image = pipeline(
#         prompt=prompt,
#         image=input_image,
#         num_inference_steps=50
#     ).images[0]

#     # 이미지 저장
#     result_image.save(output_path)
#     logger.info(f"ControlNet으로 수정된 이미지가 저장되었습니다: {output_path}")
#     return output_path

# # OCR을 사용해 텍스트 검증
# def extract_text_with_ocr(image_path):
#     text = pytesseract.image_to_string(Image.open(image_path), lang="kor")
#     logger.info(f"OCR로 추출된 텍스트: {text}")
#     return text.strip()

# # 교정된 텍스트를 이미지에 삽입
# def add_corrected_text(image_path, text, output_path):
#     image = Image.open(image_path)
#     draw = ImageDraw.Draw(image)
#     font = ImageFont.truetype(get_korean_font(), size=50)

#     # 텍스트 크기 및 위치 계산
#     text_width, text_height = draw.textsize(text, font=font)
#     x = (image.width - text_width) // 2
#     y = image.height - text_height - 50

#     # 텍스트 추가
#     draw.text((x, y), text, fill="black", font=font)
#     image.save(output_path)
#     logger.info(f"최종 수정된 이미지가 저장되었습니다: {output_path}")
#     return output_path

# # 비동기 메인 함수
# async def generate_image_and_text(request):
#     try:
#         # OpenAI DALL·E 이미지 생성
#         prompt = f"{request.text} with Korean placeholders."
#         image_url = await generate_dalle_image(prompt)
#         logger.info(f"생성된 이미지 URL: {image_url}")

#         # ControlNet 텍스트 삽입
#         intermediate_output = "intermediate_image.png"
#         controlnet_prompt = "Insert bold Korean text in the top white space."
#         add_text_with_controlnet(image_url, controlnet_prompt, intermediate_output)

#         # OCR 검증
#         extracted_text = extract_text_with_ocr(intermediate_output)

#         # 교정된 텍스트 재삽입
#         final_output = "final_image_with_text.png"
#         add_corrected_text(intermediate_output, extracted_text, final_output)

#         return {"url": f"http://your-server.com/{final_output}", "text": extracted_text}

#     except Exception as e:
#         logger.error(f"오류 발생: {e}")
#         raise HTTPException(status_code=500, detail="이미지 생성 중 오류가 발생했습니다.")
