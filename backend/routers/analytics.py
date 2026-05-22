from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models
from utils.encryption import decrypt
from ml.spam_classifier import SPAM_KEYWORDS
from ml.spam_simulator import run_simulation

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Fetch all identities of the logged-in user
    identities = db.query(models.Identity).filter(models.Identity.user_id == current_user.id).all()
    identity_ids = [i.id for i in identities]
    
    # Fetch all messages belonging to these identities
    messages = db.query(models.Message).filter(models.Message.identity_id.in_(identity_ids)).all() if identity_ids else []
    
    total = len(messages)
    spam_count = sum(1 for m in messages if m.is_spam)
    safe_count = total - spam_count
    
    # Risk breakdown of user's identities
    high_risk = sum(1 for i in identities if i.risk_badge == "high")
    moderate_risk = sum(1 for i in identities if i.risk_badge == "moderate")
    safe_risk = sum(1 for i in identities if i.risk_badge == "safe")
    
    # Calculate top spam keywords based on user's real spam messages
    top_keywords = {}
    for m in messages:
        if m.is_spam:
            body_lower = m.body.lower()
            for kw in SPAM_KEYWORDS:
                if kw in body_lower:
                    top_keywords[kw] = top_keywords.get(kw, 0) + 1
                    
    top_keywords_sorted = sorted(top_keywords.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_messages": total,
        "spam_detected": spam_count,
        "safe_messages": safe_count,
        "spam_percentage": round((spam_count / total) * 100, 1) if total > 0 else 0.0,
        "risk_breakdown": {
            "high": high_risk,
            "moderate": moderate_risk,
            "safe": safe_risk
        },
        "top_spam_keywords": top_keywords_sorted
    }

@router.get("/simulate")
def simulate_messages(count: int = 10, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Keep simulation available for sandbox testing
    results = run_simulation(count)
    return {
        "messages": results,
        "total": len(results),
        "spam_count": sum(1 for r in results if r["is_spam"])
    }

@router.get("/spam-by-identity")
def spam_by_identity(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Fetch all identities of the logged-in user
    identities = db.query(models.Identity).filter(models.Identity.user_id == current_user.id).all()
    
    identity_map = []
    for identity in identities:
        spam_count = db.query(models.Message).filter(
            models.Message.identity_id == identity.id,
            models.Message.is_spam == True
        ).count()
        
        try:
            decrypted_email = decrypt(identity.alias_email)
        except Exception:
            decrypted_email = identity.alias_email
            
        identity_map.append({
            "username": identity.username,
            "email":    decrypted_email,
            "spam_count": spam_count,
            "risk_status": identity.risk_badge or "safe",
        })
        
    return identity_map