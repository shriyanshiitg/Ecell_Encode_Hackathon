# OCR Setup Instructions

The image analysis feature requires Tesseract OCR to be installed on your system.

## Install Tesseract OCR

### macOS
```bash
brew install tesseract
```

### Ubuntu/Debian
```bash
sudo apt-get install tesseract-ocr
```

### Windows
Download and install from: https://github.com/UB-Mannheim/tesseract/wiki

## Install Python Dependencies

```bash
pip install pytesseract Pillow
```

Or reinstall all dependencies:
```bash
pip install -r requirements.txt
```

## Verify Installation

```bash
tesseract --version
```

You should see the Tesseract version information.

## Restart Backend

After installing, restart the backend:
```bash
uvicorn main:app --reload --port 5001
```

The image analysis feature should now work!
