from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import hash_password, verify_password, create_access_token, get_current_user
import models
from pydantic import BaseModel

router = APIRouter()

class RegisterInput(BaseModel):
    email: str
    password: str

class LoginInput(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterInput, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    return {"message": "Account created successfully"}

@router.post("/login")
def login(data: LoginInput, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}
