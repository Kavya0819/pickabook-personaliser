import os
import base64
from io import BytesIO

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import replicate
from dotenv import load_dotenv

app = FastAPI()

# load .env and get API key
load_dotenv()
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
client = replicate.Client(api_token=REPLICATE_API_TOKEN)

# allow React app
origins = [
    "http://localhost:5173",
    "https://pickabook-personaliser.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "API is running"}


def image_bytes_to_data_url(img_bytes: bytes, mime_type: str = "image/png") -> str:
    encoded = base64.b64encode(img_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{encoded}"


@app.post("/personalize")
async def personalize(file: UploadFile = File(...)):
    try:
        # 1. read uploaded image
        uploaded_bytes = await file.read()

        # make sure it's PNG / RGB
        image = Image.open(BytesIO(uploaded_bytes)).convert("RGB")
        buf = BytesIO()
        image.save(buf, format="PNG")
        png_bytes = buf.getvalue()

        # ---------- Fallback: just return original image ----------
        encoded = base64.b64encode(png_bytes).decode("utf-8")
        data_url = f"data:image/png;base64,{encoded}"
        return JSONResponse({"image_base64": data_url})

        # ---------- Real Replicate call (leave commented) ----------
        """
        template_path = os.path.join("templates", "template1.png")
        template_file = open(template_path, "rb")

        output = client.run(
            "grandlineai/instant-id-artistic:9cad10c7870bac9d6b587f406aef28208f964454abff5c4152f7dec9b0212a9a",
            input={
                "image": template_file,
                "face_image": BytesIO(png_bytes),
                "prompt": "cute storybook style illustration of the child",
            },
        )

        if isinstance(output, list):
            image_url = output[0]
        else:
            image_url = output

        return JSONResponse({"image_url": image_url})
        """

    except Exception as e:
        print("Error in /personalize:", e)
        return JSONResponse({"error": "failed to generate image"}, status_code=500)
