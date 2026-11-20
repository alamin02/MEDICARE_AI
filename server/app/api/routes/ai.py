from fastapi import APIRouter, HTTPException
import uuid
from typing import List
from app.schemas.schemas import AIChatRequest, AIChatResponse, InjuryAnalysisCreate, InjuryAnalysisResponse

router = APIRouter(prefix="/ai", tags=["AI & Multimodal RAG"])

EMERGENCY_WORDS = [
    "chest pain", "heart attack", "cannot breathe", "difficulty breathing",
    "unconscious", "severe bleeding", "choking", "stroke", "বুকে ব্যথা", "শ্বাসকষ্ট"
]

@router.post("/chat", response_model=AIChatResponse)
def chat_assistant(req: AIChatRequest):
    query_lower = req.message.lower()
    is_emergency = any(kw in query_lower for kw in EMERGENCY_WORDS)
    
    if is_emergency:
        reply = (
            "⚠️ জরুরি সতর্কতা: আপনার লক্ষণগুলো আশঙ্কাজনক জরুরি অবস্থার নির্দেশক হতে পারে। অবিলম্বে ৯৯৯ অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।"
            if req.language == "bn"
            else "⚠️ CRITICAL MEDICAL ALERT: Your symptoms may indicate an acute life-threatening emergency. Immediately call emergency services (999 BD / 911) or proceed to the nearest emergency trauma center."
        )
    elif "burn" in query_lower or "পোড়া" in query_lower:
        reply = (
            "পোড়া ক্ষতের জন্য: কমপক্ষে ১০-২০ মিনিট মৃদু ঠান্ডা পানির নিচে রাখুন। বরফ, টুথপেস্ট বা তেল দেবেন না। আলতোভাবে পরিষ্কার ব্যান্ডেজ দিয়ে ঢেকে দিন।"
            if req.language == "bn"
            else "For thermal burns: Cool immediately under gentle running tap water for 10-20 minutes. Do not use ice, butter, or paste. Cover loosely with sterile dressing."
        )
    else:
        reply = (
            "আপনার লক্ষণগুলো পর্যবেক্ষণ করুন। এটি সাধারণ স্বাস্থ্য নির্দেশিকা; নিশ্চিত রোগ নির্ণয়ের জন্য চিকিৎসকের পরামর্শ নিন।"
            if req.language == "bn"
            else "Based on reviewed clinical guidelines, please monitor your symptoms and rest. If symptoms worsen or persist, please consult a verified physician."
        )
        
    return AIChatResponse(
        reply=reply,
        language=req.language,
        is_emergency=is_emergency,
        disclaimer="MedICARE AI provides assistive educational information and does not independently diagnose or prescribe."
    )

@router.post("/injury-analysis", response_model=InjuryAnalysisResponse)
def analyze_injury(req: InjuryAnalysisCreate):
    return InjuryAnalysisResponse(
        id=f"inj-{uuid.uuid4().hex[:8]}",
        findings=[
            "Visible superficial dermis laceration with localized marginal erythema",
            "Intact capillary refill without deep arterial pulsation",
            "Mild soft tissue edema consistent with mechanical trauma"
        ],
        danger_signs=[
            "Monitor for expanding heat, throbbing, or purulent drainage",
            "Seek emergency care if bleeding continues past 10 minutes of direct pressure"
        ],
        first_aid_steps=[
            "1. Cleanse hands thoroughly prior to wound contact",
            "2. Apply gentle direct pressure with sterile non-stick gauze for 5-10 minutes",
            "3. Rinse with clean cool running water without harsh scrubbing",
            "4. Apply sterile protective dressing"
        ],
        recommended_specialty="General Medicine / Urgent Care",
        severity_level="LOW",
        confidence_note="DEMO ANALYSIS: Photographed triage does not substitute for certified clinical evaluation.",
        is_demo=True
    )
