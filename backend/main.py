import os
import base64
import io
import uuid
import json
import tempfile
import requests
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image
from dotenv import load_dotenv
import math

# Load environment variables
load_dotenv()

STABLE_API_KEY = os.getenv("STABLE_DIFFUSION_API_KEY")
SD_API_URL = "https://modelslab.com/api/v6/realtime/img2img"

app = FastAPI(title="Product Shot Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
GENERATED_DIR = "generated"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(GENERATED_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="."), name="static")


def process_image(image_content: bytes, size: int = 512) -> bytes:
    img = Image.open(io.BytesIO(image_content))
    if img.mode != "RGB":
        img = img.convert("RGB")
    min_dim = min(img.size)
    left = (img.width - min_dim) // 2
    top = (img.height - min_dim) // 2
    right = left + min_dim
    bottom = top + min_dim
    img = img.crop((left, top, right, bottom))
    img = img.resize((size, size))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    return img_byte_arr.getvalue()

def generate_image_with_sdapi(image_bytes: bytes, prompt: str, size: int = 512) -> bytes:
    try:
        # Convert image to base64 string
        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        payload = {
            "key": STABLE_API_KEY,
            "prompt": prompt,
            "negative_prompt": "bad quality",
            "init_image": image_b64,
            "base64": True,
            "width": str(size),
            "height": str(size),
            "samples": "1",
            "temp": False,
            "safety_checker": False,
            "strength": 0.7,
            "seed": None,
            "webhook": None,
            "track_id": None
        }

        headers = {'Content-Type': 'application/json'}
        response = requests.post(SD_API_URL, headers=headers, data=json.dumps(payload))
        print(f"API Response Status: {response.status_code}")

        result = response.json()

        if result.get("status") != "success":
            raise ValueError(result.get("message", "Stable Diffusion API returned an error"))

        output_list = result.get("output", [])
        if not output_list or not isinstance(output_list, list):
            raise ValueError("Output from API is missing or invalid")

        output_url = output_list[0]

        # If output is a .base64 file URL, fetch it and decode
        if output_url.endswith(".base64"):
            print("Detected .base64 URL, downloading and decoding...")
            base64_response = requests.get(output_url)
            base64_data = base64_response.text.strip()
            base64_data += "=" * (-len(base64_data) % 4)  # fix padding
            return base64.b64decode(base64_data)

        # Else if it's a direct image URL
        elif output_url.startswith("http"):
            print("Detected direct image URL, downloading...")
            image_response = requests.get(output_url)
            return image_response.content

        # Fallback: assume base64 inline string
        else:
            print("Detected inline base64 data.")
            if "base64," in output_url:
                base64_data = output_url.split("base64,")[1]
            else:
                base64_data = output_url
            base64_data += "=" * (-len(base64_data) % 4)
            return base64.b64decode(base64_data)

    except Exception as e:
        print(f"Error in generate_image_with_sdapi: {e}")
        raise HTTPException(status_code=500, detail=f"Stable Diffusion API error: {e}")



@app.post("/api/generate")
async def generate_product_shot(
    image: UploadFile = File(...),
    prompt: str = Form(...),
    aspect_ratio: str = "512"  # Keep it as square size
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        request_id = str(uuid.uuid4())
        content = await image.read()
        size = int(aspect_ratio)
        processed_image = process_image(content, size)

        original_path = os.path.join(UPLOAD_DIR, f"{request_id}_original.png")
        with open(original_path, "wb") as f:
            f.write(content)

        generated_image = generate_image_with_sdapi(processed_image, prompt, size)

        output_path = os.path.join(GENERATED_DIR, f"{request_id}_generated.png")
        with open(output_path, "wb") as f:
            f.write(generated_image)

        image_url = f"/static/{GENERATED_DIR}/{request_id}_generated.png"

        return {"success": True, "image_url": image_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "Product Shot Generator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
