"""
MedICARE AI - LangGraph Supervisor Agent
Orchestrates domain-specific medical assistant tools:
- Medical Assistant
- First-Aid Assistant
- Image Analysis
- Hospital Discovery
- Doctor Discovery
- Appointment Assistant
"""

from typing import Dict, Any, List

class SupervisorAgent:
    def __init__(self):
        self.supported_tools = [
            "medical_assistant",
            "first_aid_assistant",
            "injury_image_analysis",
            "hospital_discovery",
            "doctor_discovery",
            "appointment_assistant"
        ]

    def route_query(self, user_query: str) -> str:
        q = user_query.lower()
        if any(term in q for term in ["burn", "cut", "bleed", "chok", "fracture", "first aid", "পোড়া", "কাটা", "রক্ত"]):
            return "first_aid_assistant"
        elif any(term in q for term in ["image", "photo", "scan", "look at my", "ছবি", "ক্ষত"]):
            return "injury_image_analysis"
        elif any(term in q for term in ["hospital", "clinic", "icu", "trauma center", "হাসপাতাল"]):
            return "hospital_discovery"
        elif any(term in q for term in ["doctor", "specialist", "cardiologist", "physician", "ডাক্তার"]):
            return "doctor_discovery"
        elif any(term in q for term in ["appointment", "book", "slot", "schedule", "অ্যাপয়েন্টমেন্ট"]):
            return "appointment_assistant"
        else:
            return "medical_assistant"

    def execute(self, user_query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        route = self.route_query(user_query)
        return {
            "routed_tool": route,
            "query": user_query,
            "status": "PROCESSED",
            "is_emergency": any(w in user_query.lower() for w in ["chest pain", "cannot breathe", "heart attack", "unconscious"])
        }
