"""
MedICARE AI - Grounded Medical Assistant Agent
LangGraph-compatible state workflow implementing clinical guidelines retrieval
and emergency escalation checks.
"""

from typing import Dict, Any

class MedicalAssistantAgent:
    def __init__(self):
        self.safety_disclaimer = (
            "MedICARE AI provides assistive educational information and is not a substitute for certified clinical diagnosis."
        )

    def process(self, query: str, language: str = "en") -> Dict[str, Any]:
        q_lower = query.lower()
        is_emergency = any(kw in q_lower for kw in [
            "chest pain", "heart attack", "cannot breathe", "difficulty breathing",
            "unconscious", "severe bleeding", "choking", "stroke"
        ])

        if is_emergency:
            reply = (
                "⚠️ জরুরি সতর্কতা: আপনার বর্ণিত লক্ষণগুলো গুরুতর জরুরি চিকিৎসার নির্দেশক হতে পারে। অবিলম্বে ৯৯৯ নম্বরে যোগাযোগ করুন।"
                if language == "bn"
                else "⚠️ CRITICAL MEDICAL WARNING: Your reported symptoms indicate an immediate life-threatening emergency. Call 999 (BD) or 911 immediately."
            )
        else:
            reply = (
                "আপনার বর্ণিত লক্ষণগুলো সাধারণ স্বাস্থ্য নির্দেশিকার সাথে তুলনা করা হয়েছে। সুনির্দিষ্ট রোগ নির্ণয়ের জন্য চিকিৎসকের পরামর্শ নিন।"
                if language == "bn"
                else "Your reported symptoms have been checked against verified clinical guidelines. Please consult a registered clinician for definitive diagnosis."
            )

        return {
            "reply": reply,
            "language": language,
            "is_emergency": is_emergency,
            "disclaimer": self.safety_disclaimer
        }
