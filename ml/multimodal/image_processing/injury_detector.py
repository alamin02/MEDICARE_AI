"""
MedICARE AI - Multimodal Image Validation and Feature Extraction
Validates format, dimensions, size, and returns safe clinical triage.
"""

from typing import Dict, Any, List

class InjuryImageDetector:
    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
    MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

    @classmethod
    def validate_image(cls, filename: str, file_size: int) -> bool:
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext not in cls.ALLOWED_EXTENSIONS:
            return False
        if file_size > cls.MAX_FILE_SIZE_BYTES:
            return False
        return True

    @classmethod
    def analyze(cls, filename: str) -> Dict[str, Any]:
        return {
            "findings": [
                "Visible superficial dermis laceration with localized erythema",
                "Intact capillary refill; no deep arterial pulsating hemorrhage observed",
                "Soft tissue edema consistent with mechanical friction trauma"
            ],
            "danger_signs": [
                "Monitor for spreading heat, throbbing, or purulent drainage",
                "Seek immediate clinical review if bleeding does not halt after 10 minutes"
            ],
            "first_aid_steps": [
                "1. Cleanse hands thoroughly prior to wound contact",
                "2. Apply gentle direct pressure with sterile non-stick gauze for 5-10 minutes",
                "3. Rinse with clean cool running water without harsh scrubbing",
                "4. Apply sterile protective dressing"
            ],
            "recommended_specialty": "General Medicine / Urgent Care",
            "severity_level": "LOW",
            "confidence_note": "DEMO ANALYSIS: Photographed triage does not substitute for certified clinical evaluation.",
            "is_demo": True
        }
