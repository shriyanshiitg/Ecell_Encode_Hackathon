#!/bin/bash

# Start Script for Python Backend
# This script starts the FastAPI server

echo "🚀 Starting Python Backend (FastAPI)..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Virtual environment not found. Creating one..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/installed" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    touch venv/installed
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Please edit .env and add your GROQ_API_KEY"
    exit 1
fi

# Start the server
echo "✅ Starting FastAPI server on port 5001..."
uvicorn main:app --reload --port 5001
