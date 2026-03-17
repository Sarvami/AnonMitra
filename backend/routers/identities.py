from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from database import get_db
from auth import get_current_user
import models
from utils.identity_gen import generate_identity
from utils.encryption import encrypt, decrypt

router = APIRouter()


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    platform: Optional[str] = "general"


# ── Helper ────────────────────────────────────────────────────────────────────

def _serialize(identity: models.Identity) -> dict:
    """Decrypt stored fields and return a safe response dict."""
    return {
        "id":          identity.id,
        "alias_email": decrypt(identity.alias_email),
        "username":    decrypt(identity.username),
        "platform":    identity.platform,
        "risk_badge":  identity.risk_badge,
        "is_active":   identity.is_active,
        "created_at":  identity.created_at.isoformat(),
    }


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[dict])
def get_all_identities(
    db:           Session      = Depends(get_db),
    current_user: models.User  = Depends(get_current_user),
):
    """
    GET /api/identities
    Return all identities belonging to the logged-in user.
    Stored values are decrypted before being returned.
    """
    identities = (
        db.query(models.Identity)
        .filter(models.Identity.user_id == current_user.id)
        .order_by(models.Identity.created_at.desc())
        .all()
    )
    return [_serialize(i) for i in identities]


@router.post("/generate", status_code=status.HTTP_201_CREATED)
def generate_new_identity(
    payload:      GenerateRequest = GenerateRequest(),
    db:           Session         = Depends(get_db),
    current_user: models.User     = Depends(get_current_user),
):
    """
    POST /api/identities/generate
    Generate a fresh random identity, encrypt it, save to DB.
    Returns plain-text values so the user can copy their credentials.
    Optionally pass { "platform": "shopping" } in the request body.
    """
    raw = generate_identity()

    new_identity = models.Identity(
        id          = raw["id"],
        user_id     = current_user.id,
        alias_email = encrypt(raw["alias_email"]),
        username    = encrypt(raw["username"]),
        password    = encrypt(raw["password"]),
        platform    = payload.platform or "general",
        risk_badge  = "safe",
        is_active   = True,
    )

    db.add(new_identity)
    db.commit()
    db.refresh(new_identity)

    # Return plain-text so the user can see/copy their new credentials
    return {
        "id":          new_identity.id,
        "alias_email": raw["alias_email"],
        "username":    raw["username"],
        "password":    raw["password"],
        "platform":    new_identity.platform,
        "risk_badge":  new_identity.risk_badge,
        "created_at":  new_identity.created_at.isoformat(),
    }


@router.delete("/{identity_id}", status_code=status.HTTP_200_OK)
def delete_identity(
    identity_id:  str,
    db:           Session     = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    DELETE /api/identities/{id}
    Delete an identity and ALL its associated messages.
    Only the owner can delete their own identities.
    """
    identity = (
        db.query(models.Identity)
        .filter(
            models.Identity.id      == identity_id,
            models.Identity.user_id == current_user.id,
        )
        .first()
    )