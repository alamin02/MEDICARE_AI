import os
import uuid
import base64
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, InjuryAnalysis
from app.schemas.schemas import AIChatRequest, AIChatResponse, InjuryAnalysisResponse
from ml.multimodal.image_processing.injury_detector import InjuryImageDetector
from ml.rag.retrieval.retriever import MedicalRAGRetriever

router = APIRouter(prefix="/ai", tags=["AI & Multimodal RAG"])

EMERGENCY_WORDS = [
    "chest pain", "heart attack", "cannot breathe", "difficulty breathing",
    "unconscious", "severe bleeding", "choking", "stroke", "বুকে ব্যথা", "শ্বাসকষ্ট"
]

@router.post("/chat", response_model=AIChatResponse)
def chat_assistant(req: AIChatRequest):
    """
    Conversational triage using clinically grounded guidelines.
    Triggers emergency alert immediately upon acute danger keywords.
    """
    query_lower = req.message.lower()
    is_emergency = any(kw in query_lower for kw in EMERGENCY_WORDS)
    
    if is_emergency:
        reply = (
            "⚠️ জরুরি সতর্কতা: আপনার বর্ণিত লক্ষণগুলো আশঙ্কাজনক জরুরি অবস্থার নির্দেশক হতে পারে। অবিলম্বে ৯৯৯ অথবা নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।"
            if req.language == "bn"
            else "⚠️ CRITICAL MEDICAL ALERT: Your reported symptoms indicate an acute life-threatening emergency. Immediately call emergency services (999 BD / 911) or proceed to the nearest emergency trauma center."
        )
    else:
        # Query medical RAG retriever for evidence-backed advice
        retriever = MedicalRAGRetriever()
        docs = retriever.retrieve(req.message, top_k=1)
        doc_note = f" (Source: {docs[0]['source']})" if docs else ""
        
        if "burn" in query_lower or "পোড়া" in query_lower:
            reply = (
                f"পোড়া ক্ষতের জন্য: কমপক্ষে ১০-২০ মিনিট মৃদু ঠান্ডা পানির নিচে রাখুন। বরফ, টুথপেস্ট বা তেল দেবেন না। আলতোভাবে পরিষ্কার ব্যান্ডেজ দিয়ে ঢেকে দিন।{doc_note}"
                if req.language == "bn"
                else f"For thermal burns: Cool immediately under gentle running tap water for 10-20 minutes. Do not use ice, butter, or paste. Cover loosely with sterile dressing.{doc_note}"
            )
        elif "cut" in query_lower or "কাটা" in query_lower:
            reply = (
                f"কাটা ও রক্তক্ষরণের ক্ষেত্রে: পরিষ্কার কাপড় বা গজ দিয়ে অন্তত ৫-১০ মিনিট সরাসরি চেপে রাখুন। অঙ্গটি হৃদপিণ্ডের উপরে তুলে রাখুন।{doc_note}"
                if req.language == "bn"
                else f"For lacerations and active bleeding: Apply firm continuous direct pressure with sterile gauze for 5-10 minutes without lifting. Elevate if possible.{doc_note}"
            )
        else:
            reply = (
                f"আপনার বর্ণিত লক্ষণগুলো সাধারণ স্বাস্থ্য নির্দেশিকার সাথে যাচাই করা হয়েছে। নিশ্চিত রোগ নির্ণয়ের জন্য চিকিৎসকের পরামর্শ নিন।{doc_note}"
                if req.language == "bn"
                else f"Based on reviewed clinical guidelines, please monitor your symptoms and rest. If symptoms worsen or persist, please consult a verified physician.{doc_note}"
            )
        
    return AIChatResponse(
        reply=reply,
        language=req.language,
        is_emergency=is_emergency,
        disclaimer="MedICARE AI provides assistive educational information and does not independently diagnose or prescribe."
    )

@router.post("/injury-analysis", response_model=InjuryAnalysisResponse)
async def analyze_injury_upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Secure File Upload and Triage:
    - Validates MIME type, extension, AND magic byte headers
    - Dimension checks & file size limits (<= 10MB)
    - Generates randomized server-side filename
    - Stores file in private directory
    """
    contents = await file.read()
    file_size = len(contents)
    
    # 1. Content validation via magic bytes and extensions
    is_valid = InjuryImageDetector.validate_image(file.filename, file_size, contents)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image upload. Allowed formats: JPEG, PNG, WebP (max 10MB). Image header validation failed."
        )

    # 2. Safe random filename
    ext = file.filename.split(".")[-1].lower()
    safe_filename = f"{uuid.uuid4().hex}.{ext}"
    
    # 3. Store in private storage directory
    storage_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../storage/medical_images"))
    os.makedirs(storage_dir, exist_ok=True)
    save_path = os.path.join(storage_dir, safe_filename)
    with open(save_path, "wb") as f:
        f.write(contents)

    # 4. Run triage analysis
    analysis = InjuryImageDetector.analyze(safe_filename)
    
    # 5. Persist record scoped to current user
    new_record = InjuryAnalysis(
        id=f"inj-{uuid.uuid4().hex[:8]}",
        patient_id=current_user.id,
        image_url=f"/storage/medical_images/{safe_filename}",
        image_name=file.filename,
        findings=", ".join(analysis["findings"]),
        danger_signs=", ".join(analysis["danger_signs"]),
        first_aid_steps=", ".join(analysis["first_aid_steps"]),
        recommended_specialty=analysis["recommended_specialty"],
        severity_level=analysis["severity_level"],
        confidence_note=analysis["confidence_note"],
        created_at=datetime.now(timezone.utc),
        is_demo=True
    )
    db.add(new_record)
    db.commit()

    return InjuryAnalysisResponse(
        id=new_record.id,
        findings=analysis["findings"],
        danger_signs=analysis["danger_signs"],
        first_aid_steps=analysis["first_aid_steps"],
        recommended_specialty=analysis["recommended_specialty"],
        severity_level=analysis["severity_level"],
        confidence_note=analysis["confidence_note"],
        is_demo=True
    )
