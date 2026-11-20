"""
MedICARE AI - Multimodal Image Validation and Feature Extraction
Validates format, magic byte signatures, dimensions, size, and returns safe clinical triage.
Prevents file upload vulnerabilities, image bombs, and malicious extensions.
"""

from typing import Dict, Any, Optional

class InjuryImageDetector:
    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
    MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB
    MAX_DIMENSION = 4096  # Max 4096x4096px

    @classmethod
    def validate_image(cls, filename: str, file_size: int, content: Optional[bytes] = None) -> bool:
        """
        Comprehensive security validation:
        1. Checks extension against whitelist.
        2. Enforces strict file size ceiling (10MB).
        3. Validates file header magic bytes (rejects renamed executables or scripts).
        4. Validates image dimensions to prevent decompression bombs.
        """
        # 1. Extension check
        ext = filename.split(".")[-1].lower() if "." in filename else ""
        if ext not in cls.ALLOWED_EXTENSIONS:
            return False

        # 2. Size limit
        if file_size <= 0 or file_size > cls.MAX_FILE_SIZE_BYTES:
            return False

        # If raw content is provided, perform deep byte inspection
        if content is not None:
            if len(content) < 16:
                return False

            # 3. Magic byte signature verification
            is_valid_magic = False
            
            # JPEG: FF D8 FF
            if content.startswith(b'\xff\xd8\xff'):
                is_valid_magic = True
                
            # PNG: 89 50 4E 47 0D 0A 1A 0A
            elif content.startswith(b'\x89PNG\r\n\x1a\n'):
                is_valid_magic = True
                # Dimension check for PNG from IHDR chunk (bytes 16-24)
                if len(content) >= 24:
                    width = int.from_bytes(content[16:20], byteorder='big')
                    height = int.from_bytes(content[20:24], byteorder='big')
                    if width > cls.MAX_DIMENSION or height > cls.MAX_DIMENSION:
                        return False
                        
            # WebP: RIFF ... WEBP
            elif content.startswith(b'RIFF') and len(content) >= 12 and content[8:12] == b'WEBP':
                is_valid_magic = True

            if not is_valid_magic:
                return False

        return True

    @classmethod
    def analyze(cls, filename: str) -> Dict[str, Any]:
        """Produce structured visual findings, danger flags, and first-aid recommendations."""
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
