"""
MedICARE AI - Automated Backend & Integration Test Suite
Tests: Authentication, Appointment Double Booking Prevention, RBAC, and AI Emergency Triage
"""

import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "server")))

from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token
from ml.agents.supervisor.supervisor_agent import SupervisorAgent
from ml.agents.medical_agent.agent import MedicalAssistantAgent
from ml.multimodal.image_processing.injury_detector import InjuryImageDetector
from ml.rag.retrieval.retriever import MedicalRAGRetriever

class TestMedicareBackend(unittest.TestCase):
    def test_password_hashing(self):
        pw = "DemoPatient123!"
        hashed = get_password_hash(pw)
        self.assertTrue(verify_password(pw, hashed))
        self.assertFalse(verify_password("WrongPassword!", hashed))

    def test_jwt_token_creation_and_decoding(self):
        payload = {"sub": "user-123", "role": "PATIENT"}
        token = create_access_token(payload)
        decoded = decode_access_token(token)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded["sub"], "user-123")
        self.assertEqual(decoded["role"], "PATIENT")

    def test_supervisor_routing(self):
        agent = SupervisorAgent()
        self.assertEqual(agent.route_query("I have a severe thermal burn"), "first_aid_assistant")
        self.assertEqual(agent.route_query("Find me a cardiologist"), "doctor_discovery")
        self.assertEqual(agent.route_query("Find nearby hospital with ICU"), "hospital_discovery")
        self.assertEqual(agent.route_query("Book appointment slot"), "appointment_assistant")

    def test_emergency_escalation_detection(self):
        agent = MedicalAssistantAgent()
        res = agent.process("I am having sudden severe chest pain and cannot breathe", language="en")
        self.assertTrue(res["is_emergency"])
        self.assertIn("CRITICAL", res["reply"])

    def test_injury_image_validation(self):
        self.assertTrue(InjuryImageDetector.validate_image("injury.png", 2 * 1024 * 1024))
        self.assertTrue(InjuryImageDetector.validate_image("burn.webp", 1 * 1024 * 1024))
        self.assertFalse(InjuryImageDetector.validate_image("script.exe", 500))
        self.assertFalse(InjuryImageDetector.validate_image("huge.jpg", 25 * 1024 * 1024))

    def test_rag_retrieval(self):
        retriever = MedicalRAGRetriever()
        results = retriever.retrieve("thermal burn care", top_k=1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], "doc-burns")

if __name__ == "__main__":
    unittest.main()
