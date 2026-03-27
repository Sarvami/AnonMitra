from fastapi import APIRouter
from ml.spam_simulator import run_simulation

router = APIRouter()

@router.get("/summary")
def get_summary():
    results = run_simulation(20)
    
    total = len(results)
    spam_count = sum(1 for r in results if r["is_spam"])
    safe_count = total - spam_count
    
    high_risk = sum(1 for r in results if r["risk_badge"] == "high")
    moderate_risk = sum(1 for r in results if r["risk_badge"] == "moderate")
    safe_risk = sum(1 for r in results if r["risk_badge"] == "safe")
    
    top_keywords = {}
    for r in results:
        for kw in r.get("matched_keywords", []):
            top_keywords[kw] = top_keywords.get(kw, 0) + 1
    
    top_keywords_sorted = sorted(top_keywords.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_messages": total,
        "spam_detected": spam_count,
        "safe_messages": safe_count,
        "spam_percentage": round((spam_count / total) * 100, 1),
        "risk_breakdown": {
            "high": high_risk,
            "moderate": moderate_risk,
            "safe": safe_risk
        },
        "top_spam_keywords": top_keywords_sorted
    }

@router.get("/simulate")
def simulate_messages(count: int = 10):
    results = run_simulation(count)
    return {
        "messages": results,
        "total": len(results),
        "spam_count": sum(1 for r in results if r["is_spam"])
    }

@router.get("/spam-by-identity")
def spam_by_identity():
    results = run_simulation(20)

    # Use sender as the identity key
    identity_map = {}
    for r in results:
        sender = r.get("sender", "unknown")
        if sender not in identity_map:
            identity_map[sender] = {
                "username": sender.split("@")[0],   # e.g. "rahul.sharma"
                "email":    sender,                  # full email as alias
                "spam_count": 0,
                "risk_status": "safe",
            }
        if r.get("is_spam"):
            identity_map[sender]["spam_count"] += 1

        # Escalate risk level (safe → moderate → high, never downgrade)
        incoming = r.get("risk_badge", "safe")
        current  = identity_map[sender]["risk_status"]
        rank = {"safe": 0, "moderate": 1, "high": 2}
        if rank.get(incoming, 0) > rank.get(current, 0):
            identity_map[sender]["risk_status"] = incoming

    return list(identity_map.values())  # plain array