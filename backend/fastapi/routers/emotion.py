from fastapi import APIRouter, Request
from handlers.emotion import classify_emotion

# prefix 부분이 중복이 되면 안됨 그러면 test/test/ 가 됨
# router = APIRouter(prefix="/test", tags=["Test - Emotion"])

router = APIRouter(tags=["Test - Emotion"])

@router.post("/")
async def emotion_api(request: Request):
    data = await request.json()
    text = data.get("text", "")
    print(f"📨 받은 메시지: {text}")
    result = classify_emotion(text)
    print(f"📤 분석 결과: {result}")
    return {"result": result}