# 🚀 Setup Instructions

## Quick Setup (5 Minutes)

### 1. Prerequisites
- Node.js 18+ installed
- Text editor
- Terminal access

### 2. Install Dependencies

```bash
# Backend
cd Smart-Ingredient-Analyzer/back-end
npm install

# Frontend
cd ../front-end
npm install
```

### 3. Configure API Key

The Groq API key is already configured in `back-end/.env`:
```
GROQ_API_KEY=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
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
PORT=5001
```

### 4. Run the App

**Terminal 1 - Backend:**
```bash
cd Smart-Ingredient-Analyzer/back-end
npm start
```
Wait for: `🚀 Smart Food Analyzer API running on port 5001`

**Terminal 2 - Frontend:**
```bash
cd Smart-Ingredient-Analyzer/front-end
npm run dev
```
Wait for: `➜  Local:   http://localhost:5173/`

### 5. Open Browser
Navigate to: **http://localhost:5173**

---

## Troubleshooting

### Port 5001 Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Then restart backend
npm start
```

### Backend Won't Start
- Check if Node.js is installed: `node --version`
- Verify you're in correct directory: `pwd`
- Check `.env` file exists in `back-end/`

### Frontend Won't Start
- Make sure backend is running first
- Clear node_modules: `rm -rf node_modules && npm install`
- Try different port: Update `vite.config.js`

### Features Not Loading
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
- Clear browser cache
- Check browser console for errors (F12)

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

All features working? → See [HACKATHON_GUIDE.md](../HACKATHON_GUIDE.md) for demo script
