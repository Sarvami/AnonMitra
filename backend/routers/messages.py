import uuid
import random
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from database import get_db
from auth import get_current_user
import models

router = APIRouter()


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class SimulateRequest(BaseModel):
    identity_id: str  # which identity receives the fake spam message


# ── Spam simulation data ──────────────────────────────────────────────────────

FAKE_SENDERS = [
    "deals@supersavings.net",
    "noreply@promo-king.io",
    "alerts@bank-verify.com",
    "winner@lottery-hub.org",
    "support@secure-update.biz",
    "hello@exclusive-offer.co",
    "no-reply@account-alert.net",
    "offers@flashsale-today.com",
]

FAKE_SUBJECTS = [
    "You've been selected! Claim your prize",
    "URGENT: Verify your account immediately",
    "Congratulations! You're our lucky winner",
    "Limited time offer - 90% OFF everything",
    "Your package is waiting. Confirm now",
    "ACTION REQUIRED: Suspicious login detected",
    "Free iPhone 16 Pro - only 3 left!",
    "Your card has been charged $499. Dispute here",
    "You have an unclaimed reward waiting",
    "Final warning: Your account will be suspended",
]

FAKE_BODIES = [
    "Dear valued customer, click the link below to claim your reward before it expires in 24 hours.",
    "We detected unusual activity on your account. Please verify your identity immediately to avoid suspension.",
    "You have won $5,000 in our monthly giveaway. Provide your bank details to receive your transfer.",
    "Your subscription will auto-renew at $99/month unless you cancel in the next 24 hours. Click here to cancel.",
    "Exclusive deal just for you: buy now and get 3x loyalty points. Offer ends at midnight tonight.",
    "URGENT: Your account has been temporarily suspended due to suspicious activity. Restore access via the link below.",
    "A package addressed to you could not be delivered. Please confirm your address to reschedule.",
    "You have been pre-approved for a $10,000 personal loan. No credit check required. Apply now.",
]

# Risk scores intentionally high so simulated spam always gets flagged
SPAM_RISK_SCORES = [0.72, 0.85, 0.91, 0.78, 0.88, 0.95, 0.76, 0.83]

# ── Clean message simulation data ─────────────────────────────────────────────

CLEAN_SENDERS = [
    "noreply@github.com",
    "info@coursera.org",
    "hello@notion.so",
    "support@figma.com",
    "team@slack.com",
    "no-reply@linkedin.com",
    "noreply@google.com",
    "updates@trello.com",
]

CLEAN_SUBJECTS = [
    "Your pull request has been merged",
    "Weekly digest: Top courses for you",
    "Your workspace is ready",
    "Invoice for your subscription",
    "You have a new connection request",
    "Meeting notes from today's standup",
    "Your file has been shared with you",
    "Reminder: Assignment due tomorrow",
]

CLEAN_BODIES = [
    "Your pull request was successfully merged into main. Great work!",
    "Here is your weekly summary of recommended courses based on your interests.",
    "Your Notion workspace has been set up. Click here to get started.",
    "Please find attached your invoice for this month. Thank you for your continued subscription.",
    "You have a new LinkedIn connection request from someone in your network.",
    "Here are the notes from today's standup meeting. Please review and add any comments.",
    "A document has been shared with you on Google Drive. Click to view.",
    "This is a reminder that your assignment is due tomorrow at 11:59 PM.",
]

# Risk scores intentionally low so clean messages always pass
CLEAN_RISK_SCORES = [0.05, 0.08, 0.12, 0.07, 0.10, 0.03, 0.09, 0.06]

# ── Helpers ───────────────────────────────────────────────────────────────────

def _serialize_message(m: models.Message) -> dict:
    """Convert a Message model instance to a plain dict for the API response."""
    return {
        "id":          m.id,
        "identity_id": m.identity_id,
        "sender":      m.sender,
        "subject":     m.subject,
        "body":        m.body,
        "risk_score":  m.risk_score,
        "is_spam":     m.is_spam,
        "is_read":     m.is_read,
        "received_at": m.received_at.isoformat(),
    }


def _verify_identity_ownership(
    identity_id: str,
    user_id:     str,
    db:          Session,
) -> models.Identity:
    """
    Confirm the identity exists and belongs to the current user.
    Raises 404 if not found or if the user does not own it.
    """
    identity = (
        db.query(models.Identity)
        .filter(
            models.Identity.id      == identity_id,
            models.Identity.user_id == user_id,
        )
        .first()
    )
    if not identity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Identity not found or access denied.",
        )
    return identity


def _update_risk_badge(identity_id: str, db: Session):
    """
    Recalculate and update the risk badge on an identity
    based on the average risk score of all its messages.
      avg < 0.4  -> safe
      avg < 0.7  -> moderate
      avg >= 0.7 -> high
    """
    messages = (
        db.query(models.Message)
        .filter(models.Message.identity_id == identity_id)
        .all()
    )
    if not messages:
        return

    avg_score = sum(m.risk_score for m in messages) / len(messages)

    if avg_score >= 0.7:
        badge = "high"
    elif avg_score >= 0.4:
        badge = "moderate"
    else:
        badge = "safe"

    identity = (
        db.query(models.Identity)
        .filter(models.Identity.id == identity_id)
        .first()
    )
    if identity:
        identity.risk_badge = badge
        db.commit()


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/{identity_id}", response_model=List[dict])
def get_messages(
    identity_id:  str,
    db:           Session     = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    GET /api/messages/{identity_id}
    Return all messages for a specific identity, newest first.
    The identity must belong to the logged-in user.
    """
    _verify_identity_ownership(identity_id, current_user.id, db)

    messages = (
        db.query(models.Message)
        .filter(models.Message.identity_id == identity_id)
        .order_by(models.Message.received_at.desc())
        .all()
    )
    return [_serialize_message(m) for m in messages]


@router.post("/simulate", status_code=status.HTTP_201_CREATED)
def simulate_spam(
    payload:      SimulateRequest,
    db:           Session         = Depends(get_db),
    current_user: models.User     = Depends(get_current_user),
):
    """
    POST /api/messages/simulate
    Fire a fake spam message at a given identity for live demo purposes.
    The identity must belong to the logged-in user.
    Also auto-updates the identity risk badge after firing.
    """
    _verify_identity_ownership(payload.identity_id, current_user.id, db)

    risk_score = random.choice(SPAM_RISK_SCORES)

    fake_message = models.Message(
        id          = str(uuid.uuid4()),
        identity_id = payload.identity_id,
        sender      = random.choice(FAKE_SENDERS),
        subject     = random.choice(FAKE_SUBJECTS),
        body        = random.choice(FAKE_BODIES),
        risk_score  = risk_score,
        is_spam     = risk_score >= 0.7,
        is_read     = False,
        received_at = datetime.utcnow(),
    )

    db.add(fake_message)
    db.commit()
    db.refresh(fake_message)

    # Update the identity's risk badge based on all messages so far
    _update_risk_badge(payload.identity_id, db)

    return _serialize_message(fake_message)

@router.post("/simulate-clean", status_code=status.HTTP_201_CREATED)
def simulate_clean(
    payload:      SimulateRequest,
    db:           Session         = Depends(get_db),
    current_user: models.User     = Depends(get_current_user),
):
    """
    POST /api/messages/simulate-clean
    Fire a fake legitimate message at a given identity for demo comparison.
    """
    _verify_identity_ownership(payload.identity_id, current_user.id, db)

    risk_score = random.choice(CLEAN_RISK_SCORES)

    clean_message = models.Message(
        id          = str(uuid.uuid4()),
        identity_id = payload.identity_id,
        sender      = random.choice(CLEAN_SENDERS),
        subject     = random.choice(CLEAN_SUBJECTS),
        body        = random.choice(CLEAN_BODIES),
        risk_score  = risk_score,
        is_spam     = False,
        is_read     = False,
        received_at = datetime.utcnow(),
    )

    db.add(clean_message)
    db.commit()
    db.refresh(clean_message)

    _update_risk_badge(payload.identity_id, db)

    return _serialize_message(clean_message)


@router.patch("/{message_id}/read", status_code=status.HTTP_200_OK)
def mark_as_read(
    message_id:   str,
    db:           Session     = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    PATCH /api/messages/{id}/read
    Mark a specific message as read.
    Ownership is verified through the parent identity.
    """
    message = (
        db.query(models.Message)
        .filter(models.Message.id == message_id)
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found.",
        )

    # Make sure the message belongs to the current user via its identity
    _verify_identity_ownership(message.identity_id, current_user.id, db)

    message.is_read = True
    db.commit()
    db.refresh(message)
    
@router.get("/")
def get_recent_messages(limit: int = 8, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    messages = db.query(models.Message)\
        .join(models.Identity)\
        .filter(models.Identity.user_id == current_user.id)\
        .order_by(models.Message.received_at.desc())\
        .limit(limit)\
        .all()
    
    return [
        {
            "id": m.id,
            "sender": m.sender,
            "subject": m.subject,
            "body": m.body,
            "risk_score": m.risk_score,
            "is_spam": m.is_spam,
            "received_at": m.received_at
        }
        for m in messages
    ]
    

