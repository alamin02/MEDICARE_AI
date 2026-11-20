"""
MedICARE AI - Appointment Booking & Scheduling Endpoints
Enforces:
- Atomic database transactions with double-booking prevention
- Verification of ownership before cancellation (IDOR protection)
- Clinician/Admin-only authorization for accept/reject operations
"""

import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import Appointment, DoctorProfile, User
from app.schemas.schemas import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/", response_model=List[AppointmentResponse])
def get_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Return appointments scoped to current user:
    - PATIENT: only their own appointments
    - DOCTOR: appointments assigned to their doctor profile
    - ADMIN: all appointments
    """
    if current_user.role == "ADMIN":
        return db.query(Appointment).order_by(Appointment.created_at.desc()).all()
    elif current_user.role == "DOCTOR":
        doc_prof = db.query(DoctorProfile).filter(DoctorProfile.user_id == current_user.id).first()
        if not doc_prof:
            return []
        return db.query(Appointment).filter(Appointment.doctor_id == doc_prof.id).order_by(Appointment.created_at.desc()).all()
    else:
        # PATIENT
        return db.query(Appointment).filter(Appointment.patient_id == current_user.id).order_by(Appointment.created_at.desc()).all()

@router.post("/", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def book_appointment(
    apt_in: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Atomically book consultation slot with double-booking collision prevention.
    """
    # 1. Verify doctor exists and is verified
    doctor = db.query(DoctorProfile).filter(DoctorProfile.id == apt_in.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
        
    if not doctor.is_verified and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book appointments with an unverified doctor."
        )

    # 2. Atomic check for existing active slot (PENDING or CONFIRMED)
    try:
        with db.begin_nested():
            conflict = db.query(Appointment).filter(
                Appointment.doctor_id == apt_in.doctor_id,
                Appointment.date == apt_in.date,
                Appointment.time_slot == apt_in.time_slot,
                Appointment.status.in_(["PENDING", "CONFIRMED"])
            ).first()
            
            if conflict:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"This time slot ({apt_in.time_slot}) on {apt_in.date} is already reserved."
                )

            new_apt = Appointment(
                id=f"apt-{uuid.uuid4().hex[:8]}",
                patient_id=current_user.id,
                patient_name=current_user.name,
                doctor_id=doctor.id,
                doctor_name=doctor.name if hasattr(doctor, 'name') and doctor.name else doctor.hospital_name or "Dr. Specialist",
                specialty=doctor.specialty,
                hospital_name=doctor.hospital_name or "Regional Medical Center",
                date=apt_in.date,
                time_slot=apt_in.time_slot,
                status="CONFIRMED",
                symptoms=apt_in.symptoms or "General consultation",
                notes="Booked via MedICARE AI transactional booking engine",
                is_demo=True,
                created_at=datetime.now(timezone.utc)
            )
            db.add(new_apt)
            db.flush()
            
        db.commit()
        db.refresh(new_apt)
        return new_apt
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Booking transaction failed: {str(e)}")

@router.put("/{appointment_id}/accept", response_model=AppointmentResponse)
def accept_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Only attending clinician or admin can accept appointment."""
    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    if current_user.role == "DOCTOR":
        doc_prof = db.query(DoctorProfile).filter(DoctorProfile.user_id == current_user.id).first()
        if not doc_prof or apt.doctor_id != doc_prof.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You can only accept consultation requests assigned to your profile."
            )
    elif current_user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors or administrators can accept appointments.")

    apt.status = "CONFIRMED"
    db.commit()
    db.refresh(apt)
    return apt

@router.put("/{appointment_id}/reject", response_model=AppointmentResponse)
def reject_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Only attending clinician or admin can reject appointment."""
    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    if current_user.role == "DOCTOR":
        doc_prof = db.query(DoctorProfile).filter(DoctorProfile.user_id == current_user.id).first()
        if not doc_prof or apt.doctor_id != doc_prof.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You can only reject consultation requests assigned to your profile."
            )
    elif current_user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only doctors or administrators can reject appointments.")

    apt.status = "REJECTED"
    db.commit()
    db.refresh(apt)
    return apt

@router.put("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    IDOR Protection:
    - PATIENT can only cancel their OWN appointments
    - DOCTOR can only cancel appointments assigned to them
    - ADMIN can cancel any appointment
    """
    apt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not apt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")

    if current_user.role == "PATIENT":
        if apt.patient_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="IDOR Violation: You are not authorized to cancel another patient's appointment."
            )
    elif current_user.role == "DOCTOR":
        doc_prof = db.query(DoctorProfile).filter(DoctorProfile.user_id == current_user.id).first()
        if not doc_prof or apt.doctor_id != doc_prof.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden: You cannot cancel consultations assigned to other clinicians."
            )

    apt.status = "CANCELLED"
    db.commit()
    db.refresh(apt)
    return apt
