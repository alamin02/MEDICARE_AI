"""
MedICARE AI - File Upload Security Test Suite
Verifies:
- Magic byte header inspection (JPEG, PNG, WebP)
- Extension spoofing detection (rejects script disguised as image)
- Dimension boundary limits (anti-decompression bomb)
- File size thresholds
"""

import sys
import os
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..", "server")))

from ml.multimodal.image_processing.injury_detector import InjuryImageDetector

class TestFileUploadSecurity(unittest.TestCase):
    def test_genuine_png_header_accepted(self):
        # Valid PNG magic header: \x89PNG\r\n\x1a\n + IHDR with width=800, height=600
        png_header = (
            b'\x89PNG\r\n\x1a\n'
            b'\x00\x00\x00\rIHDR'
            b'\x00\x00\x03\x20'  # width = 800
            b'\x00\x00\x02\x58'  # height = 600
            b'\x08\x02\x00\x00\x00'
        )
        self.assertTrue(
            InjuryImageDetector.validate_image("injury_scan.png", len(png_header), png_header)
        )

    def test_extension_spoofing_rejected(self):
        """A PHP or Bash script renamed to .png must be rejected by magic byte inspection."""
        fake_png_content = b"<?php echo 'malicious payload'; ?>"
        self.assertFalse(
            InjuryImageDetector.validate_image("script.png", len(fake_png_content), fake_png_content)
        )

    def test_oversized_dimensions_rejected(self):
        """Images with dimensions exceeding 4096px must be rejected to prevent memory exhaustion."""
        bomb_png_header = (
            b'\x89PNG\r\n\x1a\n'
            b'\x00\x00\x00\rIHDR'
            b'\x00\x00\x20\x00'  # width = 8192px (> 4096)
            b'\x00\x00\x20\x00'  # height = 8192px
            b'\x08\x02\x00\x00\x00'
        )
        self.assertFalse(
            InjuryImageDetector.validate_image("decompression_bomb.png", len(bomb_png_header), bomb_png_header)
        )

    def test_oversized_file_rejected(self):
        oversized = 15 * 1024 * 1024  # 15MB (> 10MB limit)
        self.assertFalse(InjuryImageDetector.validate_image("large.jpg", oversized))

if __name__ == "__main__":
    unittest.main()
