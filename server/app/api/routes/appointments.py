from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid
from datetime import datetime
from typing import List
from app.core.database import get_db
from app.models.models import Appointment
from app.schemas.schemas import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/", response_model=List[AppointmentResponse])
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(Appointment.created_at.desc()).all()

@router.post("/", response_model=AppointmentResponse)
def book_appointment(apt_in: AppointmentCreate, db: Session = Depends(get_db)):
    # Check for double booking
    existing = db.query(Appointment).filter(
        Appointment.doctor_id == apt_in.doctor_id,
        Appointment.date == apt_in.date,
        Appointment.time_slot == apt_in.time_slot,
        Appointment.status.in_(["PENDING", "CONFIRMED"])
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Selected consultation slot is already reserved.")
        
    new_apt = Appointment(
        id=f"apt-{uuid.uuid4().hex[:8]}",
        patient_id="patient-demo-1",
        patient_name="Rahim Chowdhury (Demo)",
        doctor_id=apt_in.doctor_id,
        doctor_name=apt_in.doctor_name,
        specialty=apt_in.specialty,
        hospital_name=apt_in.hospital_name,
        date=apt_in.date,
        time_slot=apt_in.time_slot,
        status="CONFIRMED",
        symptoms=apt_in.symptoms,
        notes="Reserved via MedICARE AI engine",
        is_demo=True,
        created_at=datetime.utcnow()
    )
    db.add(new_apt)
    db.commit()
    db.refresh(new_apt)
    return new_apt

@router.put("/{appointment_id}/accept", response_model=AppointmentResponse)
def accept_appointment(appointment_id: str, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    apt.status = "CONFIRMED"
    db.commit()
    db.refresh(apt)
    return apt

@router.put("/{appointment_id}/reject", response_model=AppointmentResponse)
def reject_appointment(appointment_id: str, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    apt.status = "REJECTED"
    db.commit()
    db.refresh(apt)
    return apt

@router.put("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(appointment_id: str, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    apt.status = "CANCELLED"
    db.commit()
    db.refresh(apt)
    return apt
