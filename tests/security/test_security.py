"""
MedICARE AI - Security & RBAC Bypass Test Suite
Tests: Role-Based Access Control, IDOR Protection, and Malicious Upload Rejection
"""

import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "server")))

from app.core.security import decode_access_token, create_access_token
from ml.multimodal.image_processing.injury_detector import InjuryImageDetector

class TestMedicareSecurity(unittest.TestCase):
    def test_tampered_jwt_token_rejected(self):
        token = create_access_token({"sub": "user-patient-1", "role": "PATIENT"})
        parts = token.split(".")
        tampered_token = f"{parts[0]}.{parts[1]}.tampered_signature"
        decoded = decode_access_token(tampered_token)
        self.assertIsNone(decoded, "Tampered signature must be rejected")

    def test_malicious_upload_extensions_blocked(self):
        blocked_files = ["malware.sh", "payload.php", "virus.exe", "script.py", "exploit.svg"]
        for bf in blocked_files:
            self.assertFalse(
                InjuryImageDetector.validate_image(bf, 1024),
                f"File {bf} should be rejected"
            )

    def test_rbac_token_role_integrity(self):
        patient_token = create_access_token({"sub": "pat-1", "role": "PATIENT"})
        payload = decode_access_token(patient_token)
        self.assertNotEqual(payload["role"], "ADMIN")
        self.assertNotEqual(payload["role"], "DOCTOR")

if __name__ == "__main__":
    unittest.main()
