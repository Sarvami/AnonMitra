from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import shutil
import os

from ml.spam_classifier import check_spam_rules, predict_spam
from ml.ai_detector import detect_ai_image

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/detect/spam")
def detect_spam(request: TextRequest):
    rule_result = check_spam_rules(request.text)
    ml_result = predict_spam(request.text)
    
    final_badge = "high" if rule_result["risk_badge"] == "high" or ml_result["risk_badge"] == "high" else ml_result["risk_badge"]
    
    return {
        "text": request.text,
        "is_spam": rule_result["is_spam"] or ml_result["is_spam"],
        "risk_badge": final_badge,
        "risk_score": rule_result["risk_score"],
        "ml_confidence": ml_result["confidence"],
        "matched_keywords": rule_result["matched_keywords"]
    }

@router.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    result = detect_ai_image(temp_path)
    os.remove(temp_path)
    
    return result