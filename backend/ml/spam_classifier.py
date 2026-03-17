import re
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Get the directory of this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "spam_model.pkl")

SPAM_KEYWORDS = [
    "win", "winner", "free", "prize", "claim", "urgent",
    "click here", "limited offer", "congratulations",
    "you have been selected", "act now", "expires",
    "cash reward", "selected", "gift card", "lucky",
    "discount", "offer", "buy now", "order now", "deal",
    "bank account", "verify your account", "suspended",
    "password", "click the link", "confirm your", "unusual activity"
]

TRAINING_DATA = [
    ("Win a free iPhone now! Click here to claim your prize!", 1),
    ("Congratulations! You've been selected for a cash reward!", 1),
    ("Urgent! Your account will be suspended. Act now!", 1),
    ("Get free money! Limited offer expires today!", 1),
    ("You are a winner! Claim your free gift card now!", 1),
    ("Click the link to verify your bank account immediately!", 1),
    ("You have been selected for an exclusive discount offer!", 1),
    ("Your password needs to be reset, click here now!", 1),
    ("Unusual activity detected, confirm your account now!", 1),
    ("Limited time deal! Buy now and get 90% off!", 1),
    ("You won a lucky draw! Claim your reward today!", 1),
    ("Urgent: Your account will expire in 24 hours!", 1),
    ("Free gift waiting for you, act now before it expires!", 1),
    ("Order now and get free shipping on all items!", 1),
    ("Your bank account has been compromised, verify now!", 1),
    ("Hey, are we still meeting tomorrow for lunch?", 0),
    ("Please find attached the project report for review.", 0),
    ("Your order has been shipped and will arrive Friday.", 0),
    ("Can you send me the notes from today's class?", 0),
    ("Meeting rescheduled to 3pm, see you then.", 0),
    ("Here is the invoice for last month's services.", 0),
    ("Just checking in, hope you're doing well!", 0),
    ("The project deadline has been moved to next Monday.", 0),
    ("Please review the attached document and give feedback.", 0),
    ("Your subscription has been renewed successfully.", 0),
    ("Reminder: team standup at 10am tomorrow.", 0),
    ("Thanks for your help with the presentation today.", 0),
    ("The file you requested is now available for download.", 0),
    ("Let me know when you're free to catch up.", 0),
    ("Your appointment is confirmed for Thursday at 2pm.", 0),
]

def train_model():
    texts = [t for t, _ in TRAINING_DATA]
    labels = [l for _, l in TRAINING_DATA]

    model = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', MultinomialNB())
    ])

    model.fit(texts, labels)
    joblib.dump(model, MODEL_PATH)
    print("Model trained and saved!")
    return model

def analyze_message(text: str) -> dict:
    # Rule engine check
    text_lower = text.lower()
    matched = [word for word in SPAM_KEYWORDS if word in text_lower]
    rule_score = len(matched) / len(SPAM_KEYWORDS)

    # ML classifier check
    if not os.path.exists(MODEL_PATH):
        model = train_model()
    else:
        model = joblib.load(MODEL_PATH)

    prediction = model.predict([text])[0]
    probability = model.predict_proba([text])[0]
    ml_confidence = round(float(max(probability)), 2)

    # Combine both scores
    combined_score = round((rule_score + (ml_confidence if prediction == 1 else 0)) / 2, 2)

    if combined_score > 0.3 or (prediction == 1 and ml_confidence > 0.8):
        badge = "high"
    elif combined_score > 0.1 or prediction == 1:
        badge = "moderate"
    else:
        badge = "safe"

    return {
        "is_spam": bool(prediction == 1 or rule_score > 0.1),
        "risk_score": combined_score,
        "risk_badge": badge,
        "ml_confidence": ml_confidence,
        "matched_keywords": matched
    }