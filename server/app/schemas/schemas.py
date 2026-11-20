from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str
    role: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: str
    is_demo: bool
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class AppointmentCreate(BaseModel):
    doctor_id: str
    doctor_name: str
    specialty: str
    hospital_name: str
    date: str
    time_slot: str
    symptoms: Optional[str] = None

class AppointmentResponse(AppointmentCreate):
    id: str
    patient_id: str
    patient_name: str
    status: str
    notes: Optional[str] = None
    is_demo: bool
    created_at: datetime
    class Config:
        from_attributes = True

class InjuryAnalysisCreate(BaseModel):
    image_name: str
    image_base64: Optional[str] = None

class InjuryAnalysisResponse(BaseModel):
    id: str
    findings: List[str]
    danger_signs: List[str]
    first_aid_steps: List[str]
    recommended_specialty: str
    severity_level: str
    confidence_note: str
    is_demo: bool

class AIChatRequest(BaseModel):
    message: str
    language: str = "en"

class AIChatResponse(BaseModel):
    reply: str
    language: str
    is_emergency: bool
    disclaimer: str

class DoctorVerificationUpdate(BaseModel):
    is_verified: bool
