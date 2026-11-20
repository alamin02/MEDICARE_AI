from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.models import User, DoctorProfile, Hospital, Appointment, AuditLog

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
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
        "timestamp": datetime.utcnow()
    }

@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
