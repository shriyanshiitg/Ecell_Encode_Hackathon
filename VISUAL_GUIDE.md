# 📸 Visual Setup Guide

A picture is worth a thousand words! Here's what you should see at each step.

---

## Step 1: Terminal After Installing Backend

```
📦 Installing backend dependencies...

added 147 packages in 45s

✅ Backend dependencies installed!
```

---

## Step 2: Terminal After Installing Frontend

```
🎨 Installing frontend dependencies...

added 213 packages in 38s

✅ Frontend dependencies installed!
```

---

## Step 3: Your .env File Should Look Like This

```env
# Groq API Configuration
GROQ_API_KEY=gsk_abcdefghijklmnopqrstuvwxyz123456789
GROQ_MODEL=llama-3.3-70b-versatile

# Server Configuration
NODE_ENV=development
PORT=5000
```

❌ **WRONG**: `GROQ_API_KEY=your_groq_api_key_here`
✅ **RIGHT**: `GROQ_API_KEY=gsk_xxxxx...` (your actual key)

---

## Step 4: Backend Running Successfully

```
🚀 Smart Food Analyzer API running on port 5000
📍 Environment: development
🤖 AI Model: llama-3.3-70b-versatile
```

**What this means**:
- ✅ Backend is running
- ✅ API is accessible on port 5000
- ✅ Connected to Groq AI

**If you see errors**:
- ❌ "GROQ_API_KEY is required" → Edit your .env file
- ❌ "Port 5000 in use" → Change port in .env
- ❌ "Cannot find module" → Run `npm install` again

---

## Step 5: Frontend Running Successfully

```
  VITE v6.3.5  ready in 847 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**What this means**:
- ✅ Frontend is running
- ✅ Development server is ready
- ✅ Open http://localhost:5173 in browser

---

## Step 6: The App Interface

### Initial Screen (Chat Interface)

```
┌─────────────────────────────────────────┐
│   🤖 AI Health Copilot                  │
│   Understanding ingredients at the      │
│   moment of decision                    │
├─────────────────────────────────────────┤
│                                         │
│  [AI Message Bubble - Gray]            │
│  Hi! 👋 I'm your AI health copilot.   │
│  I help you understand food             │
│  ingredients right when you need it...  │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [Camera Button] [Upload Button]       │
├─────────────────────────────────────────┤
│  [Type message here...]        [Send]  │
└─────────────────────────────────────────┘
```

**You should see**:
- ✅ Clean chat interface
- ✅ AI welcome message
- ✅ Camera and Upload buttons
- ✅ Text input at bottom

---

## Step 7: After Typing a Message

**You type**: "I'm concerned about sugar for diabetes"

```
┌─────────────────────────────────────────┐
│  [AI Message - Gray]                    │
│  Hi! 👋 I'm your AI health copilot...  │
│                                         │
│                    [User Message - Blue]│
│          I'm concerned about sugar for  │
│                              diabetes   │
│                                         │
│  [AI Response - Gray]                   │
│  I understand diabetes management is    │
│  important to you. When you scan a...   │
│                                         │
└─────────────────────────────────────────┘
```

**What this shows**:
- ✅ AI understood your concern
- ✅ AI responds conversationally
- ✅ Context is being inferred

---

## Step 8: After Uploading Image

**Processing screen**:
```
┌─────────────────────────────────────────┐
│  [AI Message - Gray with spinner]       │
│  🔍 Let me read that label for you...   │
│  ⏳ Reading ingredient label...         │
└─────────────────────────────────────────┘
```

**Analysis result**:
```
┌─────────────────────────────────────────┐
│  🤖 Summary                             │
│  This product has moderate sugar        │
│  content. Given your diabetes concern,  │
│  the 15g sugar per serving could...     │
│                                         │
│  💡 Key Insights                        │
│  ✓ High in added sugars                │
│    May spike blood sugar levels         │
│    → Given your diabetes concern...     │
│    [low certainty]                      │
│                                         │
│  📋 Detailed Breakdown [Click to expand]│
│                                         │
│  Questions you might have:              │
│  [Is this safe for kids?]               │
│  [What about the preservatives?]        │
├─────────────────────────────────────────┤
│  [Ask follow-up question...]   [Ask]   │
│  ← Scan Another Product                │
└─────────────────────────────────────────┘
```

**You should see**:
- ✅ Conversational summary
- ✅ Key insights with reasoning
- ✅ Uncertainty levels shown
- ✅ Suggested questions
- ✅ Input for follow-up questions

---

## Step 9: After Asking Follow-Up

**You ask**: "Is this safe for kids?"

```
┌─────────────────────────────────────────┐
│  [Previous analysis above]              │
│                                         │
│                    [User Message - Blue]│
│                   Is this safe for kids?│
│                                         │
│  [AI Answer - Gray]                     │
│  For kids, the high sugar content is    │
│  concerning. Children's smaller bodies  │
│  process sugar differently...           │
│  → Research shows high sugar intake...  │
│                                         │
└─────────────────────────────────────────┘
```

**What this shows**:
- ✅ AI answers with reasoning
- ✅ Considers previous analysis
- ✅ Maintains conversation context

---

## Common Issues Visual Guide

### ❌ Issue: "Cannot GET /"
**What you see**: Blank page or error in browser

**Solution**:
- Make sure frontend is running
- Check URL is http://localhost:5173 (not 5000)

---

### ❌ Issue: "Failed to fetch"
**What you see**: Error message in app

**Solution**:
- Backend not running
- Open new terminal, run: `./start-backend.sh`

---

### ❌ Issue: Red error box in app
**What you see**: "Cannot connect to server"

**What to check**:
1. Is backend terminal still running?
2. Visit http://localhost:5000/health
   - ✅ Should show: `{"status":"OK"}`
   - ❌ If timeout: Backend not running

---

### ❌ Issue: "OCR failed"
**What you see**: "Could not read text from image"

**Solution - Image quality**:
```
❌ BAD IMAGE:                 ✅ GOOD IMAGE:
- Blurry                      - Clear and focused
- Dark/poor lighting          - Good lighting
- Tilted/angled              - Straight on
- Too far away               - Close up
- Reflective glare           - No glare
```

---

## Screenshots Checklist for Demo

When recording your demo video, show:

- [✅] Initial chat interface
- [✅] Typing a health concern
- [✅] AI understanding context
- [✅] Clicking Upload/Camera button
- [✅] Processing indicator
- [✅] Conversational analysis appearing
- [✅] Key insights section
- [✅] Typing follow-up question
- [✅] AI answering with reasoning

---

## Browser Console (F12) - What's Normal

**Normal messages** (these are OK):
```
📱 Device capabilities: {isMobile: false, ...}
🌐 Using API URL: http://localhost:5000
📊 Request settings: fastMode=true, isMobile=false
📡 Response status: 200
```

**Error messages** (these need fixing):
```
❌ ERR_CONNECTION_REFUSED → Backend not running
❌ 401 Unauthorized → Wrong API key
❌ CORS error → Backend/frontend mismatch
❌ 404 Not Found → Wrong URL
```

---

## Success Indicators

### ✅ Everything Working:
1. Two terminal windows open
2. Both showing active servers
3. Browser at http://localhost:5173
4. Chat interface loads
5. Can send messages
6. AI responds
7. Can upload images
8. Analysis appears
9. Can ask follow-ups

### Ready for Demo! 🎬

---

## Quick Troubleshooting Visual

```
Problem? → Check This:

App won't load          → Frontend running?
  ↓                        Terminal 2 active?
[✅ Fixed]

"Cannot connect"        → Backend running?
  ↓                        Terminal 1 active?
[✅ Fixed]                 Port 5000 open?

"Invalid API key"       → .env file correct?
  ↓                        Key has no spaces?
[✅ Fixed]                 Key starts with gsk_?

Image won't scan        → Image clear?
  ↓                        Good lighting?
[✅ Fixed]                 Close to label?
```

---

**Visual guide complete! You should now know exactly what to expect at each step.** 🎯
