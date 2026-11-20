"""
MedICARE AI - Deterministic Synthetic Healthcare Data Generator
Produces reproducible, entirely fictional demo datasets for hackathon evaluation.
All records are marked with is_demo = True.
"""

import random
import json
import os
import hashlib

def get_hash(password: str) -> str:
    salt = "medicare_salt"
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return key.hex()

def generate_synthetic_dataset(seed: int = 42) -> dict:
    random.seed(seed)
    
    first_names = ["Rahim", "Karim", "Nusrat", "Tariqul", "Sabina", "Farhan", "Fatema", "Tanvir", "Anisur", "Mehnaz", "Shahriar", "Rashedul", "Farzana", "Mokhlesur", "Nazmul", "Shirin", "Kamrul", "Shamima", "Bilkis", "Mahmudul", "Tasnim", "Arif", "Jannat", "Zubair", "Sadia", "Robiul", "Rubina", "Emon", "Habiba", "Saiful"]
    last_names = ["Chowdhury", "Jahan", "Islam", "Yasmin", "Ahmed", "Khatun", "Hossain", "Rahman", "Parveen", "Kabir", "Hassan", "Alam", "Huda", "Akter", "Ahsan", "Nasreen", "Siddiqui", "Bhuiyan", "Sultana", "Mirza"]
    specialties = ["General Medicine", "Cardiology", "Orthopedics", "Pediatrics", "Dermatology", "Neurology", "Gynecology & Obstetrics", "Emergency Medicine", "Pulmonology", "Gastroenterology", "ENT (Otolaryngology)", "Ophthalmology"]
    cities = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal"]
    blood_groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

    # 1. Generate 30 Synthetic Patients
    patients = []
    # Guarantee primary demo patient
    patients.append({
        "id": "patient-demo-1",
        "email": "patient.demo@example.com",
        "name": "Rahim Chowdhury (Demo)",
        "role": "PATIENT",
        "phone": "+880 1711-000001 (Demo)",
        "blood_group": "A+",
        "allergies": ["Penicillin", "Peanuts"],
        "is_demo": True,
        "synthetic": True
    })
    
    for i in range(2, 31):
        fn = first_names[(i - 1) % len(first_names)]
        ln = last_names[(i - 1) % len(last_names)]
        patients.append({
            "id": f"patient-demo-{i}",
            "email": f"patient.{fn.lower()}.{ln.lower()}{i}@example.com",
            "name": f"{fn} {ln} (Demo)",
            "role": "PATIENT",
            "phone": f"+880 1711-{100000 + i} (Demo)",
            "blood_group": random.choice(blood_groups),
            "allergies": [random.choice(["None", "Dust", "Pollen", "Sulfa drugs"])],
            "is_demo": True,
            "synthetic": True
        })

    # 2. Generate 15 Synthetic Doctors
    doctors = []
    # Primary demo doctor
    doctors.append({
        "id": "doc-1",
        "email": "doctor.demo@example.com",
        "name": "Dr. Nusrat Jahan (Demo)",
        "role": "DOCTOR",
        "specialty": "Cardiology",
        "license_number": "BMDC-DEMO-48291",
        "qualifications": "MBBS, FCPS (Cardiology), MD (USA)",
        "experience_years": 14,
        "consultation_fee": 1200.0,
        "hospital_name": "Dhaka Central Medical Hospital (DEMO)",
        "is_verified": True,
        "is_demo": True,
        "synthetic": True
    })
    
    for i in range(2, 16):
        fn = first_names[(i + 4) % len(first_names)]
        ln = last_names[(i + 4) % len(last_names)]
        spec = specialties[(i - 1) % len(specialties)]
        doctors.append({
            "id": f"doc-{i}",
            "email": f"doctor.{fn.lower()}{i}@example.com",
            "name": f"Dr. {fn} {ln} (Demo)",
            "role": "DOCTOR",
            "specialty": spec,
            "license_number": f"BMDC-DEMO-{30000 + i * 17}",
            "qualifications": "MBBS, MS, FCPS",
            "experience_years": 6 + (i % 12),
            "consultation_fee": 800.0 + (i % 6) * 150.0,
            "hospital_name": f"{cities[i % len(cities)]} Regional Hospital (DEMO)",
            "is_verified": i % 3 != 0,
            "is_demo": True,
            "synthetic": True
        })

    # 3. Generate 10 Synthetic Hospitals
    hospitals = []
    hospital_types = ["GOVERNMENT", "PRIVATE"]
    for i in range(1, 11):
        city = cities[(i - 1) % len(cities)]
        hospitals.append({
            "id": f"hosp-{i}",
            "name": f"{city} Metropolitan Healthcare Center #{i} (DEMO)",
            "type": hospital_types[i % 2],
            "city": city,
            "address": f"Plot {i * 12}, Main Avenue, {city}",
            "contact_number": f"+880 2-900{1000 + i} (Demo)",
            "emergency_available": (i % 4 != 0),
            "icu_beds_available": 4 + (i * 2),
            "is_demo": True,
            "synthetic": True
        })

    # 4. Generate 50 Synthetic Appointments
    appointments = []
    statuses = ["CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"]
    time_slots = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM"]
    for i in range(1, 51):
        pat = patients[i % len(patients)]
        doc = doctors[i % len(doctors)]
        day = 10 + (i % 20)
        appointments.append({
            "id": f"apt-{100 + i}",
            "patient_id": pat["id"],
            "patient_name": pat["name"],
            "doctor_id": doc["id"],
            "doctor_name": doc["name"],
            "specialty": doc["specialty"],
            "hospital_name": doc["hospital_name"],
            "date": f"2026-11-{day:02d}",
            "time_slot": time_slots[i % len(time_slots)],
            "status": statuses[i % len(statuses)],
            "symptoms": f"Synthetic clinical consultation query #{i}",
            "is_demo": True,
            "synthetic": True
        })

    return {
        "metadata": {
            "project": "MedICARE AI",
            "seed": seed,
            "notice": "All data generated here is fictional and for demonstration purposes only."
        },
        "patients": patients,
        "doctors": doctors,
        "hospitals": hospitals,
        "appointments": appointments
    }

if __name__ == "__main__":
    dataset = generate_synthetic_dataset()
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_path = os.path.join(out_dir, "synthetic_dataset.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    print(f"Generated synthetic dataset with {len(dataset['patients'])} patients, {len(dataset['doctors'])} doctors, {len(dataset['hospitals'])} hospitals, and {len(dataset['appointments'])} appointments.")
