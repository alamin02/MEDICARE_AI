from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import time

from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes.auth import router as auth_router
from app.api.routes.appointments import router as appointments_router
from app.api.routes.ai import router as ai_router
from app.api.routes.doctors import router as doctors_router
from app.api.routes.hospitals import router as hospitals_router
from app.api.routes.admin import router as admin_router
from app.api.routes.health import router as health_router

# Initialize database schema tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MedICARE AI Platform API",
    description="Multimodal Healthcare Assistant Backend with Grounded RAG and Provider Discovery",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security and Audit Logging Middleware
@app.middleware("http")
async def security_and_audit_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Secure HTTP Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
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
