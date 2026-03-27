import os
from PIL import Image
from transformers import pipeline

# ✅ Load once at module level
ai_image_detector = pipeline(
    "image-classification",
    model="umm-maybe/AI-image-detector"
)

def detect_ai_image(image_path: str) -> dict:
    try:
        image = Image.open(image_path).convert("RGB")
        results = ai_image_detector(image)

        # ✅ Print all labels so you can verify in terminal
        print("Raw model output:", results)

        ai_score = 0.0
        human_score = 0.0

        for result in results:
            label = result["label"].lower()
            if "ai" in label or "fake" in label or "artificial" in label:
                ai_score = result["score"]
            elif "human" in label or "real" in label:
                human_score = result["score"]

        # ✅ Fallback — if neither label matched, log it
        if ai_score == 0.0 and human_score == 0.0:
            return {
                "error": "Unexpected labels from model",
                "raw_output": results
            }

        is_ai = ai_score < human_score
        confidence = round(max(ai_score, human_score) * 100, 2)

        if is_ai and ai_score > 0.8:
            risk = "high"
        elif is_ai:
            risk = "moderate"
        else:
            risk = "safe"

        return {
            "is_ai_generated": is_ai,
            "confidence": confidence,
            "risk_level": risk,
            "verdict": "AI Generated" if is_ai else "Real Image"
        }

    except Exception as e:
        return {"error": str(e)}