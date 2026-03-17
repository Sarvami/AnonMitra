import re
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
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

    import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Sample training data (spam vs not spam)
TRAINING_DATA = [
    ("Win a free iPhone now! Click here to claim your prize!", 1),
    ("Congratulations! You've been selected for a cash reward!", 1),
    ("Urgent! Your account will be suspended. Act now!", 1),
    ("Get free money! Limited offer expires today!", 1),
    ("You are a winner! Claim your free gift card now!", 1),
    ("Hey, are we still meeting tomorrow for lunch?", 0),
    ("Please find attached the project report for review.", 0),
    ("Your order has been shipped and will arrive Friday.", 0),
    ("Can you send me the notes from today's class?", 0),
    ("Meeting rescheduled to 3pm, see you then.", 0),
]

def train_model():
    texts = [t for t, _ in TRAINING_DATA]
    labels = [l for _, l in TRAINING_DATA]
    
    model = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', MultinomialNB())
    ])
    
    model.fit(texts, labels)
    joblib.dump(model, 'ml/spam_model.pkl')
    print("Model trained and saved!")
    return model

def predict_spam(text: str) -> dict:
    model_path = 'ml/spam_model.pkl'
    
    if not os.path.exists(model_path):
        model = train_model()
    else:
        model = joblib.load(model_path)
    
    prediction = model.predict([text])[0]
    probability = model.predict_proba([text])[0]
    confidence = round(float(max(probability)), 2)
    
    if prediction == 1 and confidence > 0.8:
        badge = "high"
    elif prediction == 1:
        badge = "moderate"
    else:
        badge = "safe"
    
    return {
        "is_spam": bool(prediction),
        "confidence": confidence,
        "risk_badge": badge
    }