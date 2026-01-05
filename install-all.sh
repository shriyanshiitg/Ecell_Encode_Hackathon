#!/bin/bash

echo "🚀 Installing AI Health Copilot..."
echo ""

# Backend
echo "📦 Installing backend dependencies..."
cd Smart-Ingredient-Analyzer/back-end
npm install
echo "✅ Backend dependencies installed!"
echo ""

# Frontend
echo "🎨 Installing frontend dependencies..."
cd ../front-end
npm install
echo "✅ Frontend dependencies installed!"
echo ""

# Create .env if it doesn't exist
cd ../back-end
if [ ! -f .env ]; then
    echo "🔑 Creating .env file..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit .env and add your Groq API key!"
    echo "   Get your FREE key at: https://console.groq.com"
else
    echo "✅ .env file already exists"
fi
echo ""

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Get your FREE Groq API key from: https://console.groq.com"
echo "2. Edit Smart-Ingredient-Analyzer/back-end/.env and add your key"
echo "3. Run: ./start-app.sh"
echo ""
