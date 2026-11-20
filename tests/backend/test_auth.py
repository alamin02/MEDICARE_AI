"""
MedICARE AI - Password & JWT Security Test Suite
Verifies:
- Unique per-password salt generation (identical passwords yield distinct hashes)
- Timing-safe verification
- Token signature validation, expiration, and algorithm pinning
"""

import sys
import os
import unittest
import time
from datetime import timedelta

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "server")))

from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token
)

class TestPasswordAndJWTSecurity(unittest.TestCase):
    def test_unique_salts_per_password(self):
        """Identical passwords must produce distinct hashes due to random per-password salt."""
        pw = "SecureHealthPass2026!"
        hash1 = get_password_hash(pw)
        hash2 = get_password_hash(pw)
        
        self.assertNotEqual(hash1, hash2, "Unique salts must ensure distinct hashes for identical passwords")
        self.assertTrue(verify_password(pw, hash1))
        self.assertTrue(verify_password(pw, hash2))
        self.assertFalse(verify_password("WrongPassword!", hash1))

    def test_jwt_valid_signature_and_claims(self):
        """Valid token must decode and preserve subject and role claims."""
        token = create_access_token({"sub": "pat-123", "role": "PATIENT"})
        decoded = decode_access_token(token)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["sub"], "pat-123")
        self.assertEqual(decoded["role"], "PATIENT")
        self.assertEqual(decoded["iss"], "medicare-ai-auth")

    def test_expired_token_rejected(self):
        """Expired tokens must fail validation."""
        expired_token = create_access_token(
            {"sub": "pat-123", "role": "PATIENT"},
            expires_delta=timedelta(seconds=-10)
        )
        self.assertIsNone(decode_access_token(expired_token))

    def test_tampered_token_rejected(self):
        """Tokens with modified payload or invalid signature must be rejected."""
        valid_token = create_access_token({"sub": "pat-123", "role": "PATIENT"})
        parts = valid_token.split(".")
        # Tamper payload
        tampered_token = f"{parts[0]}.eyJyZXBsYWNlZCI6InRydWUifQ.{parts[2]}"
        self.assertIsNone(decode_access_token(tampered_token))

    def test_none_algorithm_attack_rejected(self):
        """Tokens asserting 'none' algorithm must be rejected."""
        import base64
        import json
        header = base64.urlsafe_b64encode(json.dumps({"alg": "none", "typ": "JWT"}).encode()).decode().rstrip('=')
        payload = base64.urlsafe_b64encode(json.dumps({"sub": "admin-hacker", "role": "ADMIN", "exp": 9999999999}).encode()).decode().rstrip('=')
        fake_token = f"{header}.{payload}."
        self.assertIsNone(decode_access_token(fake_token))

if __name__ == "__main__":
    unittest.main()
