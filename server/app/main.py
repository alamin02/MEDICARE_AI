import os
import time
import logging
from collections import defaultdict
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes.auth import router as auth_router
from app.api.routes.appointments import router as appointments_router
from app.api.routes.ai import router as ai_router
from app.api.routes.doctors import router as doctors_router
from app.api.routes.hospitals import router as hospitals_router
from app.api.routes.admin import router as admin_router
from app.api.routes.health import router as health_router

# Configure secure logging (prevent logging passwords or sensitive tokens)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("medicare_ai")

# Lifespan context manager: Avoid production reliance on import-time create_all
@asynccontextmanager
async def lifespan(app: FastAPI):
    # In development or test environments, auto-create tables if migrations have not run
    if settings.ENVIRONMENT.lower() != "production":
        logger.info("Initializing schema tables for non-production environment...")
        Base.metadata.create_all(bind=engine)
    yield
    logger.info("Shutting down MedICARE AI backend service...")

app = FastAPI(
    title="MedICARE AI Platform API",
    description="Multimodal Healthcare Assistant Backend with Grounded RAG and Provider Discovery",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Restrictions
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# In-Memory Sliding Window Rate Limiter
# 10 req/min for auth endpoints; 100 req/min for general endpoints
client_request_history = defaultdict(list)

@app.middleware("http")
async def rate_limit_and_security_headers_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    path = request.url.path

    # Rate limiting rule: Clean entries older than 60 seconds
    history = client_request_history[client_ip]
    client_request_history[client_ip] = [ts for ts in history if now - ts < 60]
    
    # Check limit based on route sensitivity
    is_auth_route = path.startswith("/api/auth/login") or path.startswith("/api/auth/register")
    max_requests = 10 if is_auth_route else 100
    
    if len(client_request_history[client_ip]) >= max_requests:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Too many requests. Please wait before retrying."},
            headers={"Retry-After": "60"}
        )
        
    client_request_history[client_ip].append(now)

    # Process request
    start_time = time.time()
    try:
        response = await call_next(request)
    except Exception as exc:
        # Secure error handling: Never leak stack traces to client
        logger.error(f"Unhandled exception during {request.method} {path}: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "An internal server error occurred. Support has been notified."}
        )
        
    process_time = time.time() - start_time

    # Production Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"

    return response

# Mount API Routers
app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(appointments_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(doctors_router, prefix="/api")
app.include_router(hospitals_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/")
def root():
    return {
        "project": "MedICARE AI",
        "tagline": "Intelligent Healthcare. Accessible Everywhere.",
        "documentation": "/docs",
        "status": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
