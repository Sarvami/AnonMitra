import os
import base64
from PIL import Image

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def detect_ai_image(image_path: str) -> dict:
    try:
        from transformers import pipeline

        detector = pipeline(
            "image-classification",
            model="Organika/sdxl-detector"
        )

        image = Image.open(image_path).convert("RGB")
        results = detector(image)

        ai_score = 0.0
        human_score = 0.0

        for result in results:
            label = result["label"].lower()
            print(f"Label: {label}, Score: {result['score']}")
            if "artificial" in label or "sdxl" in label or "fake" in label or "generated" in label:
                ai_score = result["score"]
            else:
                human_score = result["score"]

        is_ai = ai_score > human_score
        confidence = round(max(ai_score, human_score), 2)

        if is_ai and confidence > 0.8:
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