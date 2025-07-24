import requests
import os
from dotenv import load_dotenv

API_URL = "https://api-inference.huggingface.co/models/openai-community/gpt2"
HF_TOKEN = os.getenv('FASTAPI_HF_TOKEN_KEY')

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def query_huggingface(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    print(response.status_code, response.text)  # 디버깅 출력
    if response.status_code == 200:
        return response.json()[0]["generated_text"]
    elif response.status_code == 503:
        return "⏳ 모델 로딩 중입니다. 잠시 후 다시 시도해주세요."
    else:
        return f"⚠️ 오류 발생: {response.status_code} - {response.text}"