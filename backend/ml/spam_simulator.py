import random
import sys
import os
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.spam_classifier import check_spam_rules, predict_spam

SPAM_TEMPLATES = [
    # Lottery/Prize scams
    "Congratulations! You've won a free iPhone 15! Click here to claim now!",
    "You are selected for a $10,000 cash prize. Act now, limited offer!",
    "WINNER ALERT: You've been chosen for our weekly lottery. Claim today!",
    "You have won a $500 Amazon gift card. Verify your details now!",
    
    # Phishing
    "URGENT: Your bank account has been compromised. Verify immediately!",
    "Your PayPal account is suspended. Click here to restore access now!",
    "Security Alert: Unusual login detected. Confirm your identity immediately!",
    "Your Netflix subscription has expired. Update payment details now!",
    
    # Fake job offers
    "Work from home and earn $5000/week! No experience needed. Apply now!",
    "You have been selected for a high paying remote job. Respond urgently!",
    
    # Fake deliveries
    "Your package could not be delivered. Click to reschedule now!",
    "DHL: Your shipment is on hold. Pay customs fee to release it!",
    
    # Investment scams
    "Invest $100 and earn $10,000 in 7 days guaranteed! Limited slots!",
    "Crypto opportunity: Double your money in 24 hours. Act fast!",
    
    # Fake medical
    "Doctors don't want you to know this weight loss secret. Click here!",
    "FREE trial of miracle supplement. Lose 30 pounds in 30 days!",
]

NORMAL_TEMPLATES = [
    "Hey, are we still meeting tomorrow at 3pm?",
    "Please find the project report attached for your review.",
    "Your order has been shipped and will arrive by Friday.",
    "Reminder: Team standup meeting at 10am tomorrow.",
    "Can you send me the notes from today's lecture?",
    "Happy birthday! Hope you have a wonderful day!",
    "The client presentation has been rescheduled to Monday.",
    "Please review the document and share your feedback.",
    "Lunch at the usual place today?",
    "Don't forget to submit the assignment by tonight!",
]

SENDERS_SPAM = [
    "noreply@free-prizes.xyz",
    "winner@lottery-global.net",
    "alert@secure-bank-verify.com",
    "support@paypa1-secure.com",
    "delivery@dhl-tracking.xyz",
    "jobs@work-from-home-now.net",
    "invest@crypto-double.io",
]

SENDERS_NORMAL = [
    "rahul.sharma@gmail.com",
    "priya.k@outlook.com",
    "professor.mehta@college.edu",
    "hr@company.com",
    "friend123@gmail.com",
]

def generate_message() -> dict:
    is_spam = random.random() > 0.4
    
    if is_spam:
        body = random.choice(SPAM_TEMPLATES)
        sender = random.choice(SENDERS_SPAM)
    else:
        body = random.choice(NORMAL_TEMPLATES)
        sender = random.choice(SENDERS_NORMAL)
    
    return {
        "sender": sender,
        "subject": body[:40] + "...",
        "body": body,
        "received_at": datetime.now().isoformat(),
        "actual_spam": is_spam
    }

def run_simulation(count: int = 10) -> list:
    messages = []
    
    for _ in range(count):
        msg = generate_message()
        
        rule_result = check_spam_rules(msg["body"])
        ml_result = predict_spam(msg["body"])
        
        final_badge = "high" if rule_result["risk_badge"] == "high" or ml_result["risk_badge"] == "high" else ml_result["risk_badge"]
        badge_emoji = "🔴" if final_badge == "high" else "🟡" if final_badge == "moderate" else "🟢"
        
        msg["risk_score"] = rule_result["risk_score"]
        msg["ml_confidence"] = ml_result["confidence"]
        msg["risk_badge"] = final_badge
        msg["badge_emoji"] = badge_emoji
        msg["is_spam"] = rule_result["is_spam"] or ml_result["is_spam"]
        msg["matched_keywords"] = rule_result["matched_keywords"]
        
        messages.append(msg)
    
    return messages

if __name__ == "_main_":
    print("🚀 AnonMitra Spam Simulation with AI Detection\n")
    print("=" * 50)
    results = run_simulation(10)
    for i, msg in enumerate(results, 1):
        print(f"\nMessage {i}: {msg['badge_emoji']} {msg['risk_badge'].upper()}")
        print(f"  From: {msg['sender']}")
        print(f"  Body: {msg['body'][:60]}...")
        print(f"  Detected Spam: {msg['is_spam']}")
        print(f"  Risk Score: {msg['risk_score']}")
        print(f"  ML Confidence: {msg['ml_confidence']}")
        if msg['matched_keywords']:
            print(f"  Keywords: {msg['matched_keywords']}")