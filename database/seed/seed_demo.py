"""
MedICARE AI - Safe Demo Data Seeder
Populates database with generated synthetic records.
All injected records are explicitly marked with is_demo = True.
"""

import sys
import os
import json

# Ensure project root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "server")))

from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.models import User, PatientProfile, DoctorProfile, Hospital, Appointment, AuditLog
from database.seed.generate_synthetic_data import generate_synthetic_dataset

def seed_demo_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    print("Generating deterministic synthetic dataset...")
    data = generate_synthetic_dataset(seed=42)
    
    # 1. Seed Demo Accounts & Patients
    print("Seeding synthetic users and patients...")
    default_pw_hash = get_password_hash("DemoPatient123!")
    
    # Admin Account
    admin_user = db.query(User).filter(User.email == "admin.demo@example.com").first()
    if not admin_user:
        admin_user = User(
            id="admin-demo-1",
            email="admin.demo@example.com",
            hashed_password=get_password_hash("DemoAdmin123!"),
            name="Healthcare Ops Admin (Demo)",
            role="ADMIN",
            phone="+880 1711-000003 (Demo)",
            is_demo=True
        )
        db.add(admin_user)

    for p in data["patients"]:
        existing = db.query(User).filter(User.email == p["email"]).first()
        if not existing:
            u = User(
                id=p["id"],
                email=p["email"],
                hashed_password=default_pw_hash,
                name=p["name"],
                role=p["role"],
                phone=p["phone"],
                is_demo=True
            )
            db.add(u)
            prof = PatientProfile(
                id=f"profile-{p['id']}",
                user_id=p["id"],
                blood_group=p["blood_group"],
                allergies=", ".join(p["allergies"]),
                is_demo=True
            )
            db.add(prof)

    # 2. Seed Doctors
    print("Seeding synthetic doctors...")
    doc_pw_hash = get_password_hash("DemoDoctor123!")
    for d in data["doctors"]:
        existing = db.query(User).filter(User.email == d["email"]).first()
        if not existing:
            u = User(
                id=f"user-{d['id']}",
                email=d["email"],
                hashed_password=doc_pw_hash,
                name=d["name"],
                role="DOCTOR",
                is_demo=True
            )
            db.add(u)
            d_prof = DoctorProfile(
                id=d["id"],
                user_id=u.id,
                specialty=d["specialty"],
                license_number=d["license_number"],
                qualifications=d["qualifications"],
                experience_years=d["experience_years"],
                consultation_fee=d["consultation_fee"],
                hospital_name=d["hospital_name"],
                is_verified=d["is_verified"],
                is_demo=True
            )
            db.add(d_prof)

    # 3. Seed Hospitals
    print("Seeding synthetic hospitals...")
    for h in data["hospitals"]:
        existing_h = db.query(Hospital).filter(Hospital.id == h["id"]).first()
        if not existing_h:
            hosp = Hospital(
                id=h["id"],
                name=h["name"],
                type=h["type"],
                city=h["city"],
                address=h["address"],
                contact_number=h["contact_number"],
                emergency_available=h["emergency_available"],
                icu_beds_available=h["icu_beds_available"],
                latitude=23.8103,
                longitude=90.4125,
                is_demo=True
            )
            db.add(hosp)

    # 4. Seed Appointments
    print("Seeding synthetic appointments...")
    for a in data["appointments"]:
        existing_a = db.query(Appointment).filter(Appointment.id == a["id"]).first()
        if not existing_a:
            apt = Appointment(
                id=a["id"],
                patient_id=a["patient_id"],
                patient_name=a["patient_name"],
                doctor_id=a["doctor_id"],
                doctor_name=a["doctor_name"],
                specialty=a["specialty"],
                hospital_name=a["hospital_name"],
                date=a["date"],
                time_slot=a["time_slot"],
                status=a["status"],
                symptoms=a["symptoms"],
                is_demo=True
            )
            db.add(apt)

    db.commit()
    db.close()
    print("Seeding completed successfully with zero non-demo records impacted.")

if __name__ == "__main__":
    seed_demo_data()
