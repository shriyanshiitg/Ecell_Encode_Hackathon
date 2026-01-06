"""
OCR Service
Extracts text from images using pytesseract
"""

import base64
import re
from io import BytesIO
from typing import Optional
from PIL import Image
import pytesseract


class OCRService:
    """Service for extracting text from images"""

    def __init__(self):
        # Configure pytesseract if needed
        # pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'
        pass

    def extract_text_from_base64(self, base64_image: str) -> str:
        """
        Extract text from base64 image

        Args:
            base64_image: Base64 encoded image (with or without data URI prefix)

        Returns:
            Extracted text from image
        """
        try:
            # Remove data URI prefix if present
            if ',' in base64_image:
                base64_image = base64_image.split(',')[1]

            # Decode base64 to image
            image_data = base64.b64decode(base64_image)

            # Try to open image with error recovery
            try:
                image = Image.open(BytesIO(image_data))
            except Exception as img_error:
                # If JPEG fails, try with error tolerance
                from PIL import ImageFile
                ImageFile.LOAD_TRUNCATED_IMAGES = True
                image = Image.open(BytesIO(image_data))

            # Convert to RGB if necessary (this also fixes format issues)
            if image.mode not in ('RGB', 'L'):
                image = image.convert('RGB')
            elif image.mode == 'RGB':
                # Re-encode as PNG to fix any JPEG corruption
                buffer = BytesIO()
                image.save(buffer, format='PNG')
                buffer.seek(0)
                image = Image.open(buffer)

            # Enhance image quality for better OCR
            # Optional: add preprocessing here if needed
            # from PIL import ImageEnhance
            # enhancer = ImageEnhance.Contrast(image)
            # image = enhancer.enhance(2)

            # Extract text using pytesseract
            text = pytesseract.image_to_string(
                image,
                config='--psm 6'  # Assume uniform block of text
            )

            # Clean up extracted text
            text = self._clean_text(text)

            return text

        except Exception as e:
            raise ValueError(f"OCR extraction failed: {str(e)}")

    def _clean_text(self, text: str) -> str:
        """
        Clean extracted text

        Args:
            text: Raw OCR text

        Returns:
            Cleaned text
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)

        # Remove special characters that don't belong in ingredients
        text = re.sub(r'[^\w\s,.()\-\'/]', '', text)

        # Strip leading/trailing whitespace
        text = text.strip()

        return text

    def is_text_sufficient(self, text: str) -> bool:
        """
        Check if extracted text has enough content

        Args:
            text: Extracted text

        Returns:
            True if text is sufficient for analysis
        """
        # Must have at least 20 characters
        if len(text.strip()) < 20:
            return False

        # Must have at least 2 words
        words = text.split()
        if len(words) < 2:
            return False

        return True
