from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import shutil
import os

from ml.spam_classifier import check_spam_rules, predict_spam
from ml.ai_detector import detect_ai_image

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/detector/text")
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
    
    # Map risk badge to AI detection result
    if is_ai:
        if final_badge == "high":
            result = "AI"
            explanation = "This text shows strong AI generation patterns"
        elif final_badge == "medium":
            result = "Mixed"
            explanation = "This text shows some AI generation characteristics"
        else:
            result = "AI"
            explanation = "This text may be AI-generated"
    else:
        result = "Human"
        explanation = "This text appears to be human-written"
    
    # Calculate confidence based on risk score
    confidence = min(rule_result["risk_score"] * 10, 95)  # Convert to percentage
    if ml_result.get("confidence"):
        confidence = (confidence + ml_result["confidence"] * 100) / 2
    
    return {
        "result": result,  # "AI", "Human", or "Mixed"
        "confidence": round(confidence, 1),  # Percentage (0-100)
        "explanation": explanation,
        # Optional: Keep original spam data for debugging
        "debug": {
            "is_spam": is_ai,
            "risk_badge": final_badge,
            "risk_score": rule_result["risk_score"],
            "matched_keywords": rule_result["matched_keywords"]
        }
    }

@router.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    result = detect_ai_image(temp_path)
    os.remove(temp_path)
    
    return result