#!/bin/bash
# Render build script

set -e  # Exit on error

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🔧 Installing Tesseract OCR..."
apt-get update
apt-get install -y tesseract-ocr

echo "✅ Build complete!"
