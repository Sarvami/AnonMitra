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
    """
    Detect if text is AI-generated using spam detection logic
    Returns format expected by Chrome extension
    """
    rule_result = check_spam_rules(request.text)
    ml_result = predict_spam(request.text)
    
    final_badge = "high" if rule_result["risk_badge"] == "high" or ml_result["risk_badge"] == "high" else ml_result["risk_badge"]
    
    # Convert spam detection to AI detection format
    is_ai = rule_result["is_spam"] or ml_result["is_spam"]
    
    # Map risk badge to AI detection result (lowercase for extension)
    if is_ai:
        if final_badge == "high":
            result = "ai"
            explanation = "This text shows strong AI generation patterns"
        elif final_badge == "medium":
            result = "mixed"
            explanation = "This text shows some AI generation characteristics"
        else:
            result = "ai"
            explanation = "This text may be AI-generated"
    else:
        result = "human"
        explanation = "This text appears to be human-written"
    
    # Calculate confidence (0.0 to 1.0, not percentage)
    raw_confidence = min(rule_result["risk_score"] * 10, 95)  # Get percentage 0-95
    if ml_result.get("confidence"):
        raw_confidence = (raw_confidence + ml_result["confidence"] * 100) / 2
    
    # Convert to float between 0.0 and 1.0
    confidence = round(raw_confidence / 100, 3)
    
    return {
        "result": result,  # "ai", "human", or "mixed" (lowercase)
        "confidence": confidence,  # 0.0 to 1.0 float
        "explanation": explanation,
        # Optional: Keep original spam data for debugging
        "debug": {
            "is_spam": is_ai,
            "risk_badge": final_badge,
            "risk_score": rule_result["risk_score"],
            "matched_keywords": rule_result["matched_keywords"]
        }
    }

@router.post("/image")
async def detect_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    result = detect_ai_image(temp_path)
    os.remove(temp_path)
    
    return result