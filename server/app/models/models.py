from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, index=True)  # PATIENT, DOCTOR, ADMIN
    phone = Column(String, nullable=True)
    is_demo = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    medical_records = relationship("MedicalRecord", back_populates="patient")
    injury_analyses = relationship("InjuryAnalysis", back_populates="patient")
    consent_records = relationship("ConsentRecord", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    allergies = Column(Text, nullable=True)
    chronic_conditions = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

    user = relationship("User", back_populates="patient_profile")

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialty = Column(String, nullable=False, index=True)
    license_number = Column(String, unique=True, nullable=False, index=True)
    qualifications = Column(String, nullable=False)
    experience_years = Column(Integer, default=5)
    consultation_fee = Column(Float, default=1000.0)
    hospital_name = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False, index=True)  # Admin approval required
    bio = Column(Text, nullable=True)
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=50)
    availability_status = Column(String, default="AVAILABLE")  # AVAILABLE, UNAVAILABLE
    available_hours = Column(String, default="05:00 PM - 09:00 PM")
    is_demo = Column(Boolean, default=True)

    user = relationship("User", back_populates="doctor_profile")
    appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False, index=True)  # GOVERNMENT, PRIVATE
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    contact_number = Column(String, nullable=False)
    emergency_available = Column(Boolean, default=True, index=True)
    icu_beds_available = Column(Integer, default=10)
    departments = Column(Text, nullable=True)
    rating = Column(Float, default=4.5)
    is_demo = Column(Boolean, default=True)

class Specialty(Base):
    __tablename__ = "specialties"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, default="Stethoscope")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, ForeignKey("doctor_profiles.id"), nullable=False, index=True)
    doctor_name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    hospital_name = Column(String, nullable=False)
    date = Column(String, nullable=False, index=True)
    time_slot = Column(String, nullable=False)
    status = Column(String, default="PENDING", index=True)  # PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED
    symptoms = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    patient = relationship("User", back_populates="appointments", foreign_keys=[patient_id])
    doctor = relationship("DoctorProfile", back_populates="appointments", foreign_keys=[doctor_id])

    __table_args__ = (
        Index("ix_appointment_doctor_slot", "doctor_id", "date", "time_slot"),
    )

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # LAB_REPORT, PRESCRIPTION, DISCHARGE_SUMMARY, VACCINATION
    file_url = Column(String, nullable=True)
    date = Column(String, nullable=False)
    doctor_name = Column(String, nullable=True)
    hospital_name = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

    patient = relationship("User", back_populates="medical_records")

class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, ForeignKey("doctor_profiles.id"), nullable=False, index=True)
    doctor_name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    diagnosis = Column(String, nullable=True)
    medications = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

class InjuryAnalysis(Base):
    __tablename__ = "injury_analyses"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String, nullable=False)
    image_name = Column(String, nullable=False)
    findings = Column(Text, nullable=False)
    danger_signs = Column(Text, nullable=False)
    first_aid_steps = Column(Text, nullable=False)
    recommended_specialty = Column(String, nullable=False)
    severity_level = Column(String, default="LOW")
    confidence_note = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    is_demo = Column(Boolean, default=True)

    patient = relationship("User", back_populates="injury_analyses")

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    language = Column(String, default="en")
    is_emergency = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    is_demo = Column(Boolean, default=True)

class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    condition = Column(String, nullable=False)
    severity = Column(String, default="CRITICAL")
    contact_number = Column(String, nullable=True)
    status = Column(String, default="ESCALATED")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    is_demo = Column(Boolean, default=True)

class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(String, primary_key=True, index=True)
    appointment_id = Column(String, ForeignKey("appointments.id"), unique=True, nullable=False)
    doctor_notes = Column(Text, nullable=True)
    status = Column(String, default="SCHEDULED")
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    is_demo = Column(Boolean, default=True)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="SYSTEM")
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    is_demo = Column(Boolean, default=True)

    user = relationship("User", back_populates="notifications")

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    storage_path = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    is_demo = Column(Boolean, default=True)

class ConsentRecord(Base):
    __tablename__ = "consent_records"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    consent_type = Column(String, nullable=False)
    granted = Column(Boolean, default=True)
    timestamp = Column(DateTime(timezone=True), default=utc_now)
    is_demo = Column(Boolean, default=True)

    user = relationship("User", back_populates="consent_records")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, index=True)
    actor_id = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False)
    target_resource = Column(String, nullable=False)
    status = Column(String, default="SUCCESS")
    timestamp = Column(DateTime(timezone=True), default=utc_now)
