# 🤖 AI Health Copilot - AI-Native Ingredient Understanding

An AI-native consumer health experience that helps people understand food ingredients at the moment of decision-making. Built for the ECell Hackathon.

---

## 🚀 QUICK START (Choose One)

### Option 1: Automated Setup (Easiest)
```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon
./install-all.sh
# Then edit Smart-Ingredient-Analyzer/back-end/.env with your Groq API key
./start-backend.sh    # Terminal 1
./start-frontend.sh   # Terminal 2 (new window)
```

### Option 2: Step-by-Step
📖 **Read**: [START_HERE.md](./START_HERE.md) for complete instructions

### Option 3: Quick Reference
📋 **Read**: [QUICK_START.md](./QUICK_START.md) for 5-minute checklist

---

## 🎯 Problem Statement

Traditional food label apps dump raw ingredient data and expect users to figure out health implications themselves. This creates cognitive overload at the exact moment when people need quick, confident decisions.

## ✨ Our Solution: AI-Native Experience

We reimagined ingredient understanding as an **AI copilot** rather than a database browser:

### Core Principles

1. **Intent-First**: AI infers what matters to you without forms or settings
2. **Reasoning-Driven**: Explains WHY things matter, not just WHAT they are
3. **Uncertainty-Aware**: Honest about mixed evidence and trade-offs
4. **Low Cognitive Load**: Makes decisions easier, not harder

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Smart OCR**: Extracts ingredient lists from photos using Tesseract.js
- **Conversational AI**: Uses Groq API (Llama models) for:
  - Intent-first ingredient analysis
  - User context inference (allergies, preferences, health goals)
  - Follow-up question answering
- **Context Management**: Builds user profile automatically from conversation

### Frontend (React/Vite)
- **Chat-First Interface**: Natural conversation, not forms
- **Progressive Disclosure**: Shows what matters, hides what doesn't
- **Real-time Context**: Learns from your questions without explicit configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Groq API key (free tier) - Get at [console.groq.com](https://console.groq.com)

### Installation

```bash
# Clone the repository
cd Smart-Ingredient-Analyzer

# Install backend dependencies
cd back-end
npm install

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Start backend
npm start
# Backend runs on http://localhost:5000

# In a new terminal, install frontend dependencies
cd ../front-end
npm install

# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Environment Variables

Create `back-end/.env`:
```
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
PORT=5000
```

## 💡 How It's Different

### Traditional Apps
- Show long ingredient lists
- Expect users to research each ingredient
- Static filters and settings
- Data-dump driven

### Our AI-Native Approach
- Conversational explanation of what matters
- AI does the research and reasoning
- Intent inference without configuration
- Reasoning-driven with uncertainty handling

## 🎨 Key Features

✅ **Zero Configuration**: No forms to fill, AI infers your concerns
✅ **Context-Aware**: Learns what matters to you from conversation
✅ **Uncertainty Transparency**: Honest about mixed evidence
✅ **Trade-off Explanation**: "Taste vs. health" reasoning
✅ **Follow-up Questions**: Natural conversation, not one-shot analysis
✅ **Progressive Disclosure**: Shows key insights first, details on demand

## 📊 API Endpoints

### `POST /api/analyze`
Analyzes ingredient image with user context
```json
{
  "image": "base64_image_data",
  "userContext": {
    "healthConcerns": ["diabetes"],
    "allergens": ["nuts"]
  }
}
```

### `POST /api/context`
Infers user context from messages
```json
{
  "message": "I'm worried about sugar for my diabetes",
  "previousContext": {}
}
```

### `POST /api/ask`
Answers follow-up questions
```json
{
  "question": "Is this safe for kids?",
  "analysisContext": { /* previous analysis */ },
  "userContext": { /* inferred context */ }
}
```

## 🏆 Judging Criteria Alignment

### AI-Native Experience (50%)
- ✅ Behaves like intelligent copilot, not a tool
- ✅ Infers intent from images and conversation
- ✅ Minimal user effort - just snap and ask

### Reasoning & Explainability (30%)
- ✅ Explains WHY conclusions matter to you
- ✅ Expresses uncertainty clearly ("evidence is mixed")
- ✅ Shows reasoning behind every insight

### Technical Execution (20%)
- ✅ Clean architecture with separated concerns
- ✅ Appropriate model usage (Groq for speed, context inference)
- ✅ Working prototype with real OCR and AI

## 📁 Project Structure

```
Smart-Ingredient-Analyzer/
├── back-end/
│   ├── services/
│   │   ├── groqService.js       # Conversational AI analysis
│   │   └── contextService.js    # User context inference
│   ├── optimized-ocr.js         # Image processing & OCR
│   └── server.js                # Express API
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConversationalResult.jsx  # AI chat results
│   │   │   ├── WebcamCapture.jsx
│   │   │   └── ImageUploader.jsx
│   │   └── App.jsx              # Main chat interface
│   └── package.json
└── README.md
```

## 🎥 Demo Video

[Link to 2-minute demo video showing the user journey]

## 🔮 Future Enhancements

- Voice interface for hands-free shopping
- Proactive suggestions ("Based on what you usually buy...")
- Comparison mode ("Product A vs Product B")
- Shopping list generation with health optimization

## 👥 Team

Built for ECell Hackathon - January 2026

## 📝 License

MIT License

---

**Built with**: React, Node.js, Express, Groq AI (Llama), Tesseract.js, Tailwind CSS

**Core Innovation**: AI-first interaction paradigm for consumer health decisions
