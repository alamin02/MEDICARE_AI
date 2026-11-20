from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import require_roles, get_current_user
from app.models.models import DoctorProfile, User
from app.schemas.schemas import DoctorVerificationUpdate

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("/")
def get_doctors(specialty: str = None, verified_only: bool = True, db: Session = Depends(get_db)):
    """Public directory of registered doctors."""
    query = db.query(DoctorProfile)
    if verified_only:
        query = query.filter(DoctorProfile.is_verified == True)
    if specialty:
        query = query.filter(DoctorProfile.specialty.ilike(f"%{specialty}%"))
    return query.all()

@router.get("/{doctor_id}")
def get_doctor(doctor_id: str, db: Session = Depends(get_db)):
    doc = db.query(DoctorProfile).filter(DoctorProfile.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return doc

@router.put("/{doctor_id}/verify")
def verify_doctor(
    doctor_id: str,
    update: DoctorVerificationUpdate,
    admin_user: User = Depends(require_roles(["ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    CRITICAL RBAC: Only Admin accounts can approve or verify doctors.
    """
    doc = db.query(DoctorProfile).filter(DoctorProfile.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    doc.is_verified = update.is_verified
    db.commit()
    db.refresh(doc)
    return {
        "message": f"Doctor verification status updated to {doc.is_verified}",
        "doctor_id": doc.id,
        "is_verified": doc.is_verified,
        "verified_by": admin_user.id
    }
