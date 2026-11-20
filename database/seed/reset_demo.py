"""
MedICARE AI - Safe Demo Data Reset Script
Selectively wipes records where is_demo = True.
Never touches production records (is_demo = False).
"""

import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "server")))

from app.core.database import SessionLocal
from app.models.models import User, PatientProfile, DoctorProfile, Hospital, Appointment, MedicalRecord, InjuryAnalysis

def reset_demo_data():
    db = SessionLocal()
    try:
        print("Checking demo records...")
        del_apt = db.query(Appointment).filter(Appointment.is_demo == True).delete()
        del_inj = db.query(InjuryAnalysis).filter(InjuryAnalysis.is_demo == True).delete()
        del_rec = db.query(MedicalRecord).filter(MedicalRecord.is_demo == True).delete()
        del_dp = db.query(DoctorProfile).filter(DoctorProfile.is_demo == True).delete()
        del_pp = db.query(PatientProfile).filter(PatientProfile.is_demo == True).delete()
        del_hosp = db.query(Hospital).filter(Hospital.is_demo == True).delete()
        del_users = db.query(User).filter(User.is_demo == True).delete()
        
        db.commit()
        print(f"Safe reset complete: Deleted {del_apt} appointments, {del_hosp} hospitals, and {del_users} demo users.")
        print("Non-demo production data preserved with 100% integrity.")
    except Exception as e:
        db.rollback()
        print(f"Error resetting demo data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_demo_data()
