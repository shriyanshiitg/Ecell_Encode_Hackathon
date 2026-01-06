# AI Health Copilot

An AI-native food ingredient analyzer that helps people make informed decisions at the moment of purchase.

---

## Problem Statement

At the grocery store, consumers face decision paralysis when evaluating food products. Traditional nutrition apps simply display data, leaving users to interpret complex ingredient lists themselves.

## Our Solution

An AI copilot that doesn't just analyze ingredients—it **converses**, **reasons**, and **guides decisions**. The AI acts as the primary interface, not a feature bolted onto traditional workflows.

---

## Key Features

### 1. Conversational Analysis
Natural language explanations instead of data dumps. The AI interprets ingredients in context of what matters to the user.

### 2. Trade-off Reasoning
Every ingredient analysis includes explicit trade-off explanations:
- What benefit it provides (taste, preservation, cost)
- What cost it carries (health impact, processing)
- Concrete alternatives when concerns exist

### 3. Proactive Intelligence
The AI anticipates user needs and offers relevant suggestions without being prompted. Priority-based recommendations guide decision-making.

### 4. Two-Way Dialogue
Unlike traditional Q&A systems, the AI asks clarifying questions to better understand user context and provide personalized guidance.

### 5. Clear Decision Support
Each analysis concludes with an actionable verdict:
- Who should buy this product
- Who should avoid it
- What alternatives exist

### 6. Context Memory
User preferences and health concerns persist across sessions via localStorage, enabling truly personalized recommendations without requiring accounts or forms.

### 7. Product Comparison
Side-by-side analysis of two products with AI-generated recommendations on which is better and why.

### 8. Privacy Controls
Users maintain full control over their data with a one-click memory clear feature for shared devices.

---

## Technical Implementation

### Architecture
**Frontend**: React (Vite), Tailwind CSS
**Backend**: Express.js, Node.js
**AI Model**: Llama 3.3 70B via Groq API
**OCR**: Tesseract.js for image text extraction
**Storage**: Browser localStorage (no backend database)

### Input Methods
- Camera capture for real-time scanning
- Photo upload from gallery
- Manual text input for online research
- Comparison mode for evaluating options

### API Endpoints
```
POST /api/analyze         - Analyze ingredient image
POST /api/analyze-text    - Analyze typed ingredients
POST /api/chat           - Conversational responses
POST /api/context        - Infer user preferences
POST /api/ask            - Answer follow-up questions
POST /api/compare        - Compare two products
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Groq API key (free tier: https://console.groq.com/)

### Installation

1. **Install backend dependencies**
```bash
cd Smart-Ingredient-Analyzer/back-end
npm install
```

2. **Configure environment**
Create or verify `.env` file in `back-end/`:
```
GROQ_API_KEY=your_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
PORT=5001
```

3. **Install frontend dependencies**
```bash
cd ../front-end
npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd back-end
npm start
```

**Terminal 2 - Frontend:**
```bash
cd front-end
npm run dev
```

Open browser to `http://localhost:5173`

---

## Project Structure

```
Smart-Ingredient-Analyzer/
├── back-end/
│   ├── services/
│   │   ├── groqService.js        # AI analysis logic
│   │   └── contextService.js     # Context learning
│   ├── server.js                 # Express API
│   ├── optimized-ocr.js          # Image processing
│   └── .env                      # Configuration
│
├── front-end/
│   └── src/
│       ├── components/
│       │   ├── ConversationalResult.jsx    # Analysis display
│       │   ├── ComparisonMode.jsx          # Product comparison
│       │   ├── ContextDisplay.jsx          # User preferences
│       │   ├── ManualInput.jsx             # Text input
│       │   ├── WebcamCapture.jsx           # Camera
│       │   └── ImageUploader.jsx           # Upload
│       ├── App.jsx               # Main application
│       └── utils/                # Helper functions
```

---

## Design Decisions

### AI-Native Approach
Rather than adding AI to a traditional form-based workflow, we built the entire interface around conversational AI. Users interact through natural language, and the AI infers intent rather than requiring explicit configuration.

### Trade-off Focus
We prioritize explaining *why* ingredients matter and what trade-offs exist, rather than simply categorizing things as "good" or "bad". This acknowledges the complexity of food choices and helps users make decisions aligned with their specific needs.

### Uncertainty Transparency
When scientific evidence is mixed or inconclusive, we explicitly communicate this with confidence levels and reasoning. This builds trust and prevents overconfident recommendations.

### Context Accumulation
By learning user preferences through conversation and persisting them locally, we eliminate the need for tedious profile configuration while still delivering personalized analysis.

### Proactive Intelligence
The AI suggests next steps, asks clarifying questions, and offers alternatives without waiting to be prompted. This mirrors how a knowledgeable assistant would naturally guide a conversation.

---

## Technical Challenges & Solutions

### Challenge: Real-time AI inference latency
**Solution**: Implemented tiered response strategy with loading states and optimistic UI updates. Used Groq for fast inference (<5s response times).

### Challenge: Maintaining conversation context
**Solution**: Built context service that tracks user preferences across chat history and persists to localStorage. AI receives accumulated context with each request.

### Challenge: Structured output from LLM
**Solution**: Engineered detailed JSON schema in system prompts with validation and fallback defaults. Handles partial or malformed responses gracefully.

### Challenge: Privacy on shared devices
**Solution**: Implemented one-click memory clear with confirmation dialog. All data stored locally, nothing on backend.

---

## Testing

The application includes:
- Manual ingredient input with example data
- Camera and upload functionality for real-world use
- Comparison mode for evaluating multiple products
- Context learning and persistence verification
- Privacy controls testing

See `HACKATHON_GUIDE.md` for detailed testing procedures.

---

## Future Enhancements

- Voice input for hands-free scanning
- Barcode scanning for instant product lookup
- Integration with grocery store APIs for pricing data
- Multi-language support
- Dietary restriction presets (vegan, kosher, halal, etc.)
- Meal planning based on learned preferences

---

## License

MIT License

---

## Acknowledgments

Built for ECell Hackathon 2026
Challenge: AI-Native Consumer Health Experience
Submission Date: January 5, 2026
