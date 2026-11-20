from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from datetime import datetime
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.models import User, PatientProfile, DoctorProfile
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user-{uuid.uuid4().hex[:8]}"
    new_user = User(
        id=user_id,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        name=user_in.name,
        role=user_in.role.upper(),
        phone=user_in.phone,
        is_demo=True,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    
    if user_in.role.upper() == "PATIENT":
        patient_profile = PatientProfile(
            id=f"pat-{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            blood_group="A+",
            allergies="None reported",
            is_demo=True
        )
        db.add(patient_profile)
    elif user_in.role.upper() == "DOCTOR":
        doctor_profile = DoctorProfile(
            id=f"doc-{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            specialty="General Medicine",
            license_number=f"BMDC-DEMO-{uuid.uuid4().hex[:5].upper()}",
            qualifications="MBBS, FCPS",
            is_verified=False,
            is_demo=True
        )
        db.add(doctor_profile)
        
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": new_user.id, "email": new_user.email, "role": new_user.role})
    return TokenResponse(access_token=token, token_type="bearer", user=new_user)

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    # Allow demo password matching
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    return TokenResponse(access_token=token, token_type="bearer", user=user)

@router.get("/me", response_model=UserResponse)
def get_current_user(token: str, db: Session = Depends(get_db)):
    from app.core.security import decode_access_token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
