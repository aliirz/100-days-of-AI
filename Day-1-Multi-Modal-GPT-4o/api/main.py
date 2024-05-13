from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
import base64
import requests




# OpenAI API Key
api_key = os.environ.get("OPENAI_API_KEY")


client = OpenAI()
app = FastAPI()

# enable cors from *
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

@app.post("/")
async def process_request(image: UploadFile = File(...)):

    app_dir = os.path.dirname(os.path.abspath(__file__))
    img_path = os.path.join(app_dir, image.filename)

    with open(img_path, "wb") as front_file:
        front_file.write(await image.read())

    base64_image = encode_image(img_path)

    headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
    }

    payload = {
    "model": "gpt-4o",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "Is this an image of a pizza? If not then what is it?"
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return {"message" :response.json()["choices"][0]["message"]["content"]}