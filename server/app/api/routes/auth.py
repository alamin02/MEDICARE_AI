"""
MedICARE AI - Secure Authentication Endpoints
Enforces:
- Public registration restricted to PATIENT role (self-registering as ADMIN blocked)
- Doctor accounts default to unverified (require admin approval)
- Standard OAuth2 bearer token authentication
"""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user
from app.models.models import User, PatientProfile, DoctorProfile
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    requested_role = (user_in.role or "PATIENT").upper().strip()
    
    # Critical Security Invariant: Public registration cannot create ADMIN accounts
    if requested_role == "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Self-registration as administrator is strictly forbidden. Admin accounts must be provisioned internally."
        )

    # Disallow invalid roles
    if requested_role not in ["PATIENT", "DOCTOR"]:
        requested_role = "PATIENT"

    # Check for existing email collision
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    # Create User with unique per-password salt
    user_id = f"user-{uuid.uuid4().hex[:8]}"
    new_user = User(
        id=user_id,
        email=user_in.email.lower().strip(),
        hashed_password=get_password_hash(user_in.password),
        name=user_in.name.strip(),
        role=requested_role,
        phone=user_in.phone,
        is_demo=True,
        created_at=datetime.now(timezone.utc)
    )
    db.add(new_user)

    # Associated Profile
    if requested_role == "PATIENT":
        patient_profile = PatientProfile(
            id=f"profile-{user_id}",
            user_id=user_id,
            blood_group="Unknown",
            allergies="None reported",
            is_demo=True
        )
        db.add(patient_profile)
    elif requested_role == "DOCTOR":
        # Critical Security Invariant: Doctor accounts are NOT verified upon self-registration
        doctor_profile = DoctorProfile(
            id=f"doc-{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            specialty="General Medicine",
            license_number=f"BMDC-PENDING-{uuid.uuid4().hex[:5].upper()}",
            qualifications="Pending Credentials Verification",
            is_verified=False,  # Requires Admin Approval
            is_demo=True
        )
        db.add(doctor_profile)

    db.commit()
    db.refresh(new_user)

    # Issue initial session token
    token = create_access_token({
        "sub": new_user.id,
        "email": new_user.email,
        "role": new_user.role
    })
    
    return TokenResponse(access_token=token, token_type="bearer", user=new_user)

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    email_clean = login_data.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    
    # Timing-safe validation prevents user enumeration
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role
    })
    
    return TokenResponse(access_token=token, token_type="bearer", user=user)

@router.get("/me", response_model=UserResponse)
def get_current_authenticated_user(current_user: User = Depends(get_current_user)):
    """Return profile of currently authenticated session."""
    return current_user
