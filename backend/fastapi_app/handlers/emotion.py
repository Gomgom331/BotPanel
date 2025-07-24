import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

HF_TOKEN = os.getenv('FASTAPI_HF_TOKEN_KEY') # 실제 토큰 입력
client = InferenceClient(api_key=HF_TOKEN)

def classify_emotion(text: str):
    return client.text_classification(
        text,
        model="michellejieli/emotion_text_classifier"
    )