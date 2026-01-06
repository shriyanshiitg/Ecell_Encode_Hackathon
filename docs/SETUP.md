# Setup Instructions

## Quick Setup (5 Minutes)

### 1. Prerequisites
- Python 3.9+ installed
- Node.js 18+ installed (for frontend)
- Text editor
- Terminal access

### 2. Install Dependencies

```bash
# Backend
cd Smart-Ingredient-Analyzer/backend
pip install -r requirements.txt

# Frontend
cd ../front-end
npm install
```

### 3. Configure API Key

The Groq API key is already configured in `backend/.env`:
```
GROQ_API_KEY=Enter_your_api_key
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
PORT=5001
```

### 4. Run the App

**Terminal 1 - Backend:**
```bash
cd Smart-Ingredient-Analyzer/backend
uvicorn main:app --reload --port 5001
# Or use: ./start.sh
```
Wait for: `INFO:     Uvicorn running on http://0.0.0.0:5001`

**Terminal 2 - Frontend:**
```bash
cd Smart-Ingredient-Analyzer/front-end
npm run dev
```
Wait for: `➜  Local:   http://localhost:5173/`

### 5. Open Browser
Navigate to: **http://localhost:5173**

---

## Testing the App

### 1. Basic Chat
- Type "Hello" in the input box
- AI should respond conversationally

### 2. Manual Input
- Click "Type" button
- Enter or load example ingredients
- Click "Analyze"
- Verify all sections appear (trade-offs, proactive, verdict, etc.)

### 3. Memory Test
- Chat: "I'm reducing sugar"
- Refresh page
- Should see "Welcome back!" message

### 4. Comparison Mode
- Click "Compare" button
- Load example
- Verify side-by-side results

### 5. Clear Memory
- Find context display box
- Click "Clear Memory" button
- Confirm it clears

---

## Ready for Demo!

All features working? You're ready to go!
