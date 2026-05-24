from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database import engine
import models
from routers import auth, identities, messages, detector, analytics

models.Base.metadata.create_all(bind=engine)

limiter = Limiter(key_fufrom fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database import engine
import models
import asyncio
from routers import auth, identities, messages, detector, analytics

models.Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="AnonMitra API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,        prefix="/api/auth",       tags=["Auth"])
app.include_router(identities.router,  prefix="/api/identities", tags=["Identities"])
app.include_router(messages.router,    prefix="/api/messages",   tags=["Messages"])
app.include_router(detector.router,    prefix="/api/detector",   tags=["Detector"])
app.include_router(analytics.router,   prefix="/api/analytics",  tags=["Analytics"])

# ── Active WebSocket connections ──────────────────────────────
active_connections: list[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Keep connection alive with ping every 30s
            await asyncio.sleep(30)
            await websocket.send_json({"type": "ping"})
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception:
        if websocket in active_connections:
            active_connections.remove(websocket)

# Helper to broadcast to all connected clients
async def broadcast(message: dict):
    for connection in active_connections.copy():
        try:
            await connection.send_json(message)
        except Exception:
            active_connections.remove(connection)

@app.get("/")
def root():
    return {"message": "AnonMitra API is running"}nc=get_remote_address)

app = FastAPI(title="AnonMitra API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,        prefix="/api/auth",       tags=["Auth"])
app.include_router(identities.router,  prefix="/api/identities", tags=["Identities"])
app.include_router(messages.router,    prefix="/api/messages",   tags=["Messages"])
app.include_router(detector.router,    prefix="/api/detector",   tags=["Detector"])
app.include_router(analytics.router,   prefix="/api/analytics",  tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "AnonMitra API is running"}