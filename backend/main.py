from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, identities, messages, detector, analytics

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AnonMitra API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,        prefix="/api/auth",      tags=["Auth"])
app.include_router(identities.router,  prefix="/api/identities",tags=["Identities"])
app.include_router(messages.router,    prefix="/api/messages",  tags=["Messages"])
app.include_router(detector.router,    prefix="/api/detector",  tags=["Detector"])
app.include_router(analytics.router,   prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "AnonMitra API is running"}