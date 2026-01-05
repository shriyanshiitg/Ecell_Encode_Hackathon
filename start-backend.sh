#!/bin/bash

echo "🚀 Starting Backend Server..."
echo ""

cd Smart-Ingredient-Analyzer/back-end

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo ""
    echo "Please run: ./install-all.sh first"
    exit 1
fi

# Check if API key is set
if grep -q "your_groq_api_key_here" .env; then
    echo "❌ ERROR: Groq API key not configured!"
    echo ""
    echo "Please:"
    echo "1. Get your FREE API key from: https://console.groq.com"
    echo "2. Edit Smart-Ingredient-Analyzer/back-end/.env"
    echo "3. Replace 'your_groq_api_key_here' with your actual key"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed. Installing now..."
    npm install
fi

echo "Starting backend on port 5000..."
echo "Keep this terminal window open!"
echo ""

npm start
