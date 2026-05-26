from fastapi import APIRouter, Depends, HTTPException, Request, Response
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from database import get_db
from auth import hash_password, verify_password, create_access_token, get_current_user
import models
from pydantic import BaseModel

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


class RegisterInput(BaseModel):
    email: str
    password: str


class LoginInput(BaseModel):
    email: str
    password: str


@router.post("/register")
@limiter.limit("5/minute")
def register(request: Request, data: RegisterInput, db: Session = Depends(get_db)):
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    if "@" not in data.email:
        raise HTTPException(status_code=400, detail="Invalid email address")
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    return {"message": "Account created successfully"}


@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, response: Response, data: LoginInput, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})

    # XSS FIX: Set token as httpOnly cookie — JavaScript cannot access this
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,       # JS cannot read this cookie — XSS safe
        samesite="lax",      # CSRF protection
        secure=False,        # Set to True in production with HTTPS
        max_age=60 * 60 * 24 # 24 hours
    )

    # Also return token in body for Swagger UI / Chrome extension compatibility
    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout")
def logout(response: Response):
    """Clear the httpOnly cookie on logout."""
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}
