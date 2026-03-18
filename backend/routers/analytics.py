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