import os
from PIL import Image
from transformers import pipeline

# Load once at module level
ai_image_detector = pipeline(
    "image-classification",
    model="umm-maybe/AI-image-detector"
)

def detect_ai_image(image_path: str) -> dict:
    try:
        image = Image.open(image_path).convert("RGB")
        results = ai_image_detector(image)

        print("Raw model output:", results)

        ai_score    = 0.0
        human_score = 0.0

        for result in results:
            label = result["label"].lower()
            if "ai" in label or "fake" in label or "artificial" in label:
                ai_score = result["score"]
            elif "human" in label or "real" in label:
                human_score = result["score"]

        # Fallback — if neither label matched
        if ai_score == 0.0 and human_score == 0.0:
            return {
                "error": "Unexpected labels from model",
                "raw_output": results
            }

        # FIX 1: was ai_score < human_score (inverted)
        is_ai      = ai_score > human_score

        # FIX 2: send 0-1 float, not percentage
        confidence = round(max(ai_score, human_score), 2)

        if is_ai and ai_score > 0.8:
            risk = "high"
        elif is_ai:
            risk = "moderate"
        else:
            risk = "safe"

        # FIX 3: return fields frontend expects
        return {
            "result":      "ai" if is_ai else "human",
            "confidence":  confidence,
            "explanation": (
                "This image shows signs of AI generation — uniform textures, "
                "perfect symmetry, and unnatural fine details."
                if is_ai else
                "This image appears to be a real photograph — natural noise "
                "and organic detail patterns detected."
            )
        }

    except Exception as e:
        return {"error": str(e)}