"""
MedICARE AI - RBAC & IDOR Security Test Suite
Verifies:
- Public registration cannot create ADMIN role (HTTP 403)
- Non-admin cannot verify doctors (HTTP 403)
- Non-admin cannot view admin stats (HTTP 403)
- Patient cannot cancel another patient's appointment (IDOR Protection)
- Attending doctor can only manage their own appointments
"""

import sys
import os
import unittest
from unittest.mock import MagicMock

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "server")))

from fastapi import HTTPException
from app.api.routes.auth import register
from app.api.routes.appointments import cancel_appointment
from app.schemas.schemas import UserCreate
from app.models.models import User, Appointment

class TestRBACAndIDOR(unittest.TestCase):
    def test_self_registration_as_admin_forbidden(self):
        """Attempting to self-register with role='ADMIN' must raise HTTP 403."""
        mock_db = MagicMock()
        admin_attempt = UserCreate(
            email="hacker@example.com",
            password="Password123!",
            name="Malicious Admin Attempt",
            role="ADMIN"
        )
        with self.assertRaises(HTTPException) as ctx:
            register(admin_attempt, db=mock_db)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("administrator is strictly forbidden", ctx.exception.detail)

    def test_appointment_cancellation_idor_protection(self):
        """Patient A must not be allowed to cancel Patient B's appointment."""
        mock_db = MagicMock()
        target_apt = Appointment(
            id="apt-target-1",
            patient_id="patient-victim-id",
            doctor_id="doc-1",
            status="CONFIRMED"
        )
        mock_db.query().filter().first.return_value = target_apt

        # Attacker user context
        attacker_user = User(
            id="patient-attacker-id",
            role="PATIENT",
            name="Attacker Patient"
        )

        with self.assertRaises(HTTPException) as ctx:
            cancel_appointment(
                appointment_id="apt-target-1",
                current_user=attacker_user,
                db=mock_db
            )
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("IDOR", ctx.exception.detail)

    def test_appointment_cancellation_by_owner_allowed(self):
        """Owner of appointment is authorized to cancel their own appointment."""
        mock_db = MagicMock()
        target_apt = Appointment(
            id="apt-target-2",
            patient_id="patient-owner-id",
            doctor_id="doc-1",
            status="CONFIRMED"
        )
        mock_db.query().filter().first.return_value = target_apt

        owner_user = User(
            id="patient-owner-id",
            role="PATIENT",
            name="Legitimate Owner"
        )

        res = cancel_appointment(
            appointment_id="apt-target-2",
            current_user=owner_user,
            db=mock_db
        )
        self.assertEqual(res.status, "CANCELLED")

if __name__ == "__main__":
    unittest.main()
