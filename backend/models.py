from sqlalchemy import Column, String, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import uuid

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id            = Column(String, primary_key=True, default=gen_uuid)
    email         = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)
    identities    = relationship("Identity", back_populates="user")

class Identity(Base):
    __tablename__ = "identities"
    id          = Column(String, primary_key=True, default=gen_uuid)
    user_id     = Column(String, ForeignKey("users.id"))
    alias_email = Column(String, unique=True, nullable=False)
    username    = Column(String, nullable=False)
    password    = Column(String, nullable=False)
    platform    = Column(String, default="general")
    risk_badge  = Column(String, default="safe")
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, default=datetime.utcnow)
    user        = relationship("User", back_populates="identities")
    messages    = relationship("Message", back_populates="identity")

class Message(Base):
    __tablename__ = "messages"
    id          = Column(String, primary_key=True, default=gen_uuid)
    identity_id = Column(String, ForeignKey("identities.id"))
    sender      = Column(String, nullable=False)
    subject     = Column(String)
    body        = Column(String, nullable=False)
    risk_score  = Column(Float, default=0.0)
    is_spam     = Column(Boolean, default=False)
    is_read     = Column(Boolean, default=False)
    received_at = Column(DateTime, default=datetime.utcnow)
    identity    = relationship("Identity", back_populates="messages")

class Detection(Base):
    __tablename__ = "detections"
    id          = Column(String, primary_key=True, default=gen_uuid)
    user_id     = Column(String, ForeignKey("users.id"))
    type        = Column(String, nullable=False)
    result      = Column(String, nullable=False)
    confidence  = Column(Float, nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow)