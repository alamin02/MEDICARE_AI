from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List

from app.core.database import get_db
from app.core.security import require_roles
from app.models.models import User, DoctorProfile, Hospital, Appointment, AuditLog

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/stats")
def get_admin_stats(
    admin_user: User = Depends(require_roles(["ADMIN"])),
    db: Session = Depends(get_db)
):
    """Protected admin dashboard metrics."""
    patient_count = db.query(User).filter(User.role == "PATIENT").count()
    doctor_count = db.query(DoctorProfile).count()
    verified_doctors = db.query(DoctorProfile).filter(DoctorProfile.is_verified == True).count()
    hospital_count = db.query(Hospital).count()
    appointment_count = db.query(Appointment).count()
    
    return {
        "patients": patient_count,
        "doctors": doctor_count,
        "verified_doctors": verified_doctors,
        "hospitals": hospital_count,
        "appointments": appointment_count,
        "status": "HEALTHY",
        "requested_by": admin_user.email,
        "timestamp": datetime.now(timezone.utc)
    }

@router.get("/audit-logs")
def get_audit_logs(
    admin_user: User = Depends(require_roles(["ADMIN"])),
    db: Session = Depends(get_db)
):
    """Protected audit logs for compliance review."""
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
