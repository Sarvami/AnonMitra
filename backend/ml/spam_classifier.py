import re

# Simple rule-based spam detector (Layer 1)

SPAM_KEYWORDS = [
    "win", "winner", "free", "prize", "claim", "urgent",
    "click here", "limited offer", "congratulations",
    "you have been selected", "act now", "expires"
]

def check_spam_rules(text: str) -> dict:
    text_lower = text.lower()
    
    matched = [word for word in SPAM_KEYWORDS if word in text_lower]
    score = len(matched) / len(SPAM_KEYWORDS)
    
    if score > 0.3:
        badge = "high"
    elif score > 0.1:
        badge = "moderate"
    else:
        badge = "safe"
    
    return {
        "risk_score": round(score, 2),
        "risk_badge": badge,
        "matched_keywords": matched,
        "is_spam": score > 0.1
    }