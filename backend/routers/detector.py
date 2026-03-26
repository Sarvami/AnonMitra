from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import shutil
import os

from ml.spam_classifier import check_spam_rules, predict_spam
from ml.ai_detector import detect_ai_image

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/text")
def detect_text(request: TextRequest):
    import requests
    
    GPTZERO_API_KEY = "your_api_key_here"
    
    response = requests.post(
        "https://api.gptzero.me/v2/predict/text",
        headers={
            "x-api-key": GPTZERO_API_KEY,
            "Content-Type": "application/json"
        },
        json={"document": request.text}
    )
    
    data = response.json()
    
    prob = data.get("documents", [{}])[0].get("average_generated_prob", 0)
    
    if prob > 0.7:
        result = "ai"
        explanation = "This text is likely AI-generated"
    elif prob > 0.4:
        result = "mixed"
        explanation = "This text may be partially AI-generated"
    else:
        result = "human"
        explanation = "This text appears to be human-written"
    
    return {
        "result": result,
        "confidence": round(prob, 3),
        "explanation": explanation
    }

@router.post("/image")
async def detect_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    result = detect_ai_image(temp_path)
    os.remove(temp_path)
    
    return result