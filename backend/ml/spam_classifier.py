
import re
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# ---- LAYER 1: Rule-based spam detector ----

SPAM_KEYWORDS = [
    "win", "winner", "free", "prize", "claim", "urgent",
    "click here", "limited offer", "congratulations",
    "you have been selected", "act now", "expires",
    "verify", "suspended", "compromised", "guaranteed",
    "earn", "investment", "crypto", "loan", "pre-approved",
    "lose weight", "miracle", "secret", "weird trick"
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

# ---- LAYER 2: ML spam classifier ----

TRAINING_DATA = [
    # Lottery/Prize spam
    ("Win a free iPhone now! Click here to claim your prize!", 1),
    ("Congratulations! You've been selected for a cash reward!", 1),
    ("You are a winner! Claim your free gift card now!", 1),
    ("WINNER ALERT: You've been chosen for our weekly lottery!", 1),
    ("You have won a $500 Amazon gift card. Verify your details now!", 1),
    ("You are selected for a $10,000 cash prize. Act now!", 1),
    ("Claim your free prize before it expires tonight!", 1),
    ("Lucky winner! You have been selected for a special reward!", 1),
    
    # Phishing
    ("URGENT: Your bank account has been compromised. Verify immediately!", 1),
    ("Your PayPal account is suspended. Click here to restore access!", 1),
    ("Security Alert: Unusual login detected. Confirm your identity!", 1),
    ("Your Netflix subscription has expired. Update payment details now!", 1),
    ("Your account will be closed unless you verify your details today!", 1),
    ("WARNING: Unauthorized access to your account detected!", 1),
    ("Your credit card has been charged $499. Click to dispute now!", 1),
    ("ALERT: Your password has been compromised. Reset immediately!", 1),
    
    # Fake job offers
    ("Work from home and earn $5000/week! No experience needed!", 1),
    ("You have been selected for a high paying remote job!", 1),
    ("Earn $200/hour working from home. Apply now!", 1),
    ("Job opportunity: Make $3000 weekly with no experience required!", 1),
    
    # Fake deliveries
    ("Your package could not be delivered. Click to reschedule now!", 1),
    ("DHL: Your shipment is on hold. Pay customs fee to release it!", 1),
    ("FedEx: Your parcel is waiting. Confirm delivery address now!", 1),
    ("Your order is stuck in customs. Pay fee to release immediately!", 1),
    
    # Investment scams
    ("Invest $100 and earn $10,000 in 7 days guaranteed!", 1),
    ("Crypto opportunity: Double your money in 24 hours. Act fast!", 1),
    ("Make $5000 daily with our proven investment system!", 1),
    ("Bitcoin trading bot made me $10,000 in one week!", 1),
    
    # Fake medical
    ("Doctors don't want you to know this weight loss secret!", 1),
    ("FREE trial of miracle supplement. Lose 30 pounds in 30 days!", 1),
    ("This one weird trick burns belly fat overnight!", 1),
    ("Cure diabetes naturally with this secret remedy!", 1),
    
    # Generic spam
    ("Click here now! Limited time offer expires soon!", 1),
    ("Get free money today! No strings attached!", 1),
    ("Urgent action required! Your account needs verification!", 1),
    ("Exclusive deal for you only! Don't miss out!", 1),
    ("You have been pre-approved for a $50,000 loan!", 1),
    ("Meet singles in your area tonight! Click here!", 1),
    ("Buy cheap medications online. No prescription needed!", 1),
    ("Enlarge and improve your life today! Click here!", 1),

    # Normal emails
    ("Hey, are we still meeting tomorrow for lunch?", 0),
    ("Please find attached the project report for review.", 0),
    ("Your order has been shipped and will arrive Friday.", 0),
    ("Can you send me the notes from today's class?", 0),
    ("Meeting rescheduled to 3pm, see you then.", 0),
    ("Happy birthday! Hope you have a wonderful day!", 0),
    ("The client presentation has been rescheduled to Monday.", 0),
    ("Please review the document and share your feedback.", 0),
    ("Don't forget to submit the assignment by tonight!", 0),
    ("Lunch at the usual place today?", 0),
    ("Can you please share the updated project timeline?", 0),
    ("I will be late to the office today by 30 minutes.", 0),
    ("Please confirm your attendance for the team dinner.", 0),
    ("The quarterly report is ready for your review.", 0),
    ("Your appointment is confirmed for tomorrow at 2pm.", 0),
    ("Thanks for your help with the presentation yesterday!", 0),
    ("The library book you requested is now available.", 0),
    ("Your subscription has been renewed successfully.", 0),
    ("Reminder: Please submit your timesheet by Friday.", 0),
    ("We are happy to confirm your hotel reservation.", 0),
    ("Your flight has been confirmed. Check in opens 24hrs before.", 0),
    ("The meeting agenda has been shared on Google Drive.", 0),
    ("Please find the invoice attached for your records.", 0),
    ("Your password was changed successfully.", 0),
    ("Thank you for your purchase! Your receipt is attached.", 0),
]

import os
import joblib

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, 'spam_model.pkl')

def train_model(db_session=None):
    texts = [t for t, _ in TRAINING_DATA]
    labels = [l for _, l in TRAINING_DATA]
    
    # If a database session is provided, query user messages to train on real data
    if db_session:
        try:
            from models import Message
            db_messages = db_session.query(Message).all()
            for msg in db_messages:
                texts.append(msg.body)
                labels.append(1 if msg.is_spam else 0)
        except Exception as e:
            print("Failed to query DB messages for training:", e)
    else:
        # Try self-contained connection if no session is provided
        try:
            from database import SessionLocal
            from models import Message
            db = SessionLocal()
            db_messages = db.query(Message).all()
            for msg in db_messages:
                texts.append(msg.body)
                labels.append(1 if msg.is_spam else 0)
            db.close()
        except Exception as e:
            print("Could not initialize local DB session for training:", e)
            
    model = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', MultinomialNB())
    ])
    
    model.fit(texts, labels)
    joblib.dump(model, MODEL_PATH)
    print(f"Model trained and saved to {MODEL_PATH}!")
    return model

def predict_spam(text: str) -> dict:
    if not os.path.exists(MODEL_PATH):
        model = train_model()
    else:
        model = joblib.load(MODEL_PATH)
    
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

