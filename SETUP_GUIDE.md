# 🚀 Setup Guide - AI Health Copilot

Complete guide to get your AI-native ingredient analyzer running locally.

## Prerequisites

Before you begin, make sure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **Groq API Key** (free tier) - Get yours at [console.groq.com](https://console.groq.com)

## Step 1: Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up or log in (it's free!)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it in Step 3)

The free tier is generous and perfect for this hackathon project!

## Step 2: Install Dependencies

```bash
# Navigate to the project directory
cd Smart-Ingredient-Analyzer

# Install backend dependencies
cd back-end
npm install

# Install frontend dependencies
cd ../front-end
npm install
```

## Step 3: Configure Backend

```bash
# Navigate to backend
cd back-end

# Copy the example environment file
cp .env.example .env

# Open .env in your favorite editor
# Replace 'your_groq_api_key_here' with your actual Groq API key
```

Your `.env` file should look like:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
PORT=5000
```

## Step 4: Start the Backend

```bash
# From the back-end directory
npm start
```

You should see:
```
🚀 Smart Food Analyzer API running on port 5000
📍 Environment: development
🤖 AI Model: llama-3.3-70b-versatile
```

Keep this terminal running!

## Step 5: Start the Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend
cd Smart-Ingredient-Analyzer/front-end

# Start the development server
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 6: Open the App

1. Open your browser
2. Go to [http://localhost:5173](http://localhost:5173)
3. You should see the AI Health Copilot interface!

## Testing the App

### Quick Test Flow:

1. **Chat Interface**: You'll see a welcome message from the AI copilot
2. **Try messaging**: Type something like "I'm concerned about sugar" and send
3. **Take a photo**: Click the "Camera" or "Upload" button
4. **Scan a label**:
   - Use your device camera to capture a food label
   - OR upload a photo of ingredient list from your phone/computer
5. **Get Analysis**: The AI will analyze and explain the ingredients conversationally
6. **Ask Questions**: Follow up with questions like "Is this safe for kids?" or "What about the preservatives?"

### Test Images

If you don't have food products handy, you can:
1. Google "food ingredient label" and download images
2. Use product images from online shopping sites
3. Test with packaged foods from your kitchen

## Troubleshooting

### Backend Issues

**Error: `GROQ_API_KEY is required`**
- Make sure you created the `.env` file in the `back-end` directory
- Check that your API key is correct (no extra spaces)

**Error: `Port 5000 is already in use`**
- Another app is using port 5000
- Change `PORT=5000` to `PORT=5001` in `.env`
- Update frontend API URL if needed

**Error: `Groq API HTTP 401`**
- Your API key is invalid or expired
- Get a new key from [console.groq.com](https://console.groq.com)

### Frontend Issues

**Error: `Cannot connect to server`**
- Make sure backend is running on port 5000
- Check that `http://localhost:5000` is accessible
- Try opening `http://localhost:5000/health` in browser - should return `{"status":"OK"}`

**Camera not working**
- Browser needs camera permissions
- Make sure you're on HTTPS or localhost
- Try the "Upload" option instead

**OCR not reading text**
- Make sure the image is clear and focused
- Try better lighting
- Get closer to the ingredient list
- Make sure text is horizontal (not tilted)

### Performance Issues

**Analysis is slow**
- First request is always slower (model initialization)
- Groq free tier has rate limits
- Try using smaller/clearer images
- Check your internet connection

## Architecture Overview

```
┌─────────────────┐
│   React App     │  Port 5173
│  (Frontend)     │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Express API    │  Port 5000
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴─────┬────────────┐
    ▼          ▼            ▼
┌────────┐ ┌────────┐ ┌──────────┐
│Tesseract│ │ Groq   │ │ Context  │
│  OCR    │ │  AI    │ │ Service  │
└─────────┘ └────────┘ └──────────┘
```

## API Endpoints Reference

### Health Check
```bash
curl http://localhost:5000/health
```

### Analyze Image
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_data"}'
```

### Infer Context
```bash
curl -X POST http://localhost:5000/api/context \
  -H "Content-Type: application/json" \
  -d '{"message": "I have diabetes"}'
```

### Ask Question
```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Is this safe for kids?",
    "analysisContext": {...},
    "userContext": {...}
  }'
```

## Development Tips

### Hot Reload
- Frontend: Automatically reloads on file changes
- Backend: Restart manually after changes (or use `nodemon`)

### Installing nodemon (optional)
```bash
cd back-end
npm install -D nodemon
# Change "start" script to "nodemon server.js"
```

### Debugging
- Backend logs: Check the terminal where `npm start` is running
- Frontend logs: Open browser DevTools (F12) → Console
- Network requests: DevTools → Network tab

## Next Steps

Once everything is running:

1. ✅ Test basic image upload and analysis
2. ✅ Try the conversational features (ask follow-up questions)
3. ✅ Test context inference (mention allergies or health concerns)
4. ✅ Try different food products
5. 📹 Record your demo video!

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Look at console/terminal errors
3. Verify all dependencies installed correctly
4. Make sure both backend and frontend are running

## Ready for Demo!

You're all set! The app demonstrates:
- ✅ AI-native interface (chat-first, not forms)
- ✅ Intent inference (learns from conversation)
- ✅ Reasoning transparency (explains WHY, not just WHAT)
- ✅ Uncertainty handling (honest about mixed evidence)
- ✅ Low cognitive load (easy decision-making)

Good luck with your hackathon! 🚀
