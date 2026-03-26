from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import shutil
import os
from transformers import pipeline

from ml.spam_classifier import check_spam_rules, predict_spam
from ml.ai_detector import detect_ai_image

router = APIRouter()

ai_text_classifier = pipeline(
    "text-classification",
    model="Hello-SimpleAI/chatgpt-detector-roberta"
)

class TextRequest(BaseModel):
    text: str

@router.post("/text")
def detect_text(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        result = ai_text_classifier(request.text, truncation=True, max_length=512)[0]
        
        # ✅ FIX: this model outputs "Human" or "ChatGPT", not LABEL_0/LABEL_1
        label = result["label"].lower()
        score = result["score"]

        is_ai = label == "chatgpt"
        verdict = "ai" if is_ai else "human"
        confidence = round(score * 100, 2)

        if is_ai and score > 0.8:
            confidence_label = "high"
        elif is_ai:
            confidence_label = "moderate"
        else:
            confidence_label = "low"

        return {
            "result": verdict,
            "confidence": confidence,
            "confidence_label": confidence_label,
            "explanation": f"Model is {confidence}% confident this text is {'AI-generated' if is_ai else 'human-written'}."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image")
async def detect_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    result = detect_ai_image(temp_path)
    os.remove(temp_path)
    
    return result

