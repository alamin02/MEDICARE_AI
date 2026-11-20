from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # PATIENT, DOCTOR, ADMIN
    phone = Column(String, nullable=True)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)

class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    allergies = Column(Text, nullable=True)  # JSON or comma-separated
    chronic_conditions = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

    user = relationship("User", back_populates="patient_profile")

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    specialty = Column(String, nullable=False, index=True)
    license_number = Column(String, unique=True, nullable=False)
    qualifications = Column(String, nullable=False)
    experience_years = Column(Integer, default=5)
    consultation_fee = Column(Float, default=1000.0)
    hospital_name = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    bio = Column(Text, nullable=True)
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=50)
    availability_status = Column(String, default="AVAILABLE")
    available_hours = Column(String, default="05:00 PM - 09:00 PM")
    is_demo = Column(Boolean, default=True)

    user = relationship("User", back_populates="doctor_profile")

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # GOVERNMENT, PRIVATE
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    contact_number = Column(String, nullable=False)
    emergency_available = Column(Boolean, default=True)
    icu_beds_available = Column(Integer, default=10)
    departments = Column(Text, nullable=True)  # comma separated
    rating = Column(Float, default=4.5)
    is_demo = Column(Boolean, default=True)

class Specialty(Base):
    __tablename__ = "specialties"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String, default="Stethoscope")

class DoctorHospital(Base):
    __tablename__ = "doctor_hospitals"
    id = Column(String, primary_key=True, index=True)
    doctor_id = Column(String, ForeignKey("doctor_profiles.id"))
    hospital_id = Column(String, ForeignKey("hospitals.id"))
    is_demo = Column(Boolean, default=True)

class DoctorSchedule(Base):
    __tablename__ = "doctor_schedules"
    id = Column(String, primary_key=True, index=True)
    doctor_id = Column(String, ForeignKey("doctor_profiles.id"))
    day_of_week = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    is_demo = Column(Boolean, default=True)

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, nullable=False, index=True)
    doctor_name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    hospital_name = Column(String, nullable=False)
    date = Column(String, nullable=False, index=True)
    time_slot = Column(String, nullable=False)
    status = Column(String, default="PENDING")  # PENDING, CONFIRMED, REJECTED, CANCELLED, COMPLETED
    symptoms = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    file_url = Column(String, nullable=True)
    date = Column(String, nullable=False)
    doctor_name = Column(String, nullable=True)
    hospital_name = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

class Prescription(Base):
    __tablename__ = "prescriptions"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, nullable=False)
    doctor_name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    diagnosis = Column(String, nullable=True)
    medications = Column(Text, nullable=False)  # JSON or text
    notes = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=True)

class InjuryAnalysis(Base):
    __tablename__ = "injury_analyses"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, nullable=False, index=True)
    image_url = Column(String, nullable=False)
    image_name = Column(String, nullable=False)
    findings = Column(Text, nullable=False)  # JSON or text
    danger_signs = Column(Text, nullable=False)
    first_aid_steps = Column(Text, nullable=False)
    recommended_specialty = Column(String, nullable=False)
    severity_level = Column(String, default="LOW")
    confidence_note = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=True)

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    query = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    language = Column(String, default="en")
    is_emergency = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=True)

class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    condition = Column(String, nullable=False)
    severity = Column(String, default="CRITICAL")
    contact_number = Column(String, nullable=True)
    status = Column(String, default="ESCALATED")
    created_at = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=True)

class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(String, primary_key=True, index=True)
    appointment_id = Column(String, unique=True, nullable=False)
    doctor_notes = Column(Text, nullable=True)
    status = Column(String, default="SCHEDULED")
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    is_demo = Column(Boolean, default=True)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="SYSTEM")
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=True)

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    storage_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=True)

class ConsentRecord(Base):
    __tablename__ = "consent_records"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=False, index=True)
    consent_type = Column(String, nullable=False)
    granted = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, index=True)
    actor_id = Column(String, nullable=False)
    action = Column(String, nullable=False)
    target_resource = Column(String, nullable=False)
    status = Column(String, default="SUCCESS")
    timestamp = Column(DateTime, default=datetime.utcnow)
