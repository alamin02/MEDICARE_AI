from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import DoctorProfile
from app.schemas.schemas import DoctorVerificationUpdate

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("/")
def get_doctors(specialty: str = None, db: Session = Depends(get_db)):
    query = db.query(DoctorProfile)
    if specialty:
        query = query.filter(DoctorProfile.specialty == specialty)
    return query.all()

@router.get("/{doctor_id}")
def get_doctor(doctor_id: str, db: Session = Depends(get_db)):
    doc = db.query(DoctorProfile).filter(DoctorProfile.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doc

@router.put("/{doctor_id}/verify")
def verify_doctor(doctor_id: str, update: DoctorVerificationUpdate, db: Session = Depends(get_db)):
    doc = db.query(DoctorProfile).filter(DoctorProfile.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doc.is_verified = update.is_verified
    db.commit()
    db.refresh(doc)
    return {"message": "Verification status updated", "doctor_id": doc.id, "is_verified": doc.is_verified}
