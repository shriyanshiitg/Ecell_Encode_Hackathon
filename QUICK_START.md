# ⚡ Quick Start Checklist

Get your AI Health Copilot running in 5 minutes!

## ☑️ Pre-Flight Checklist

- [ ] Node.js 18+ installed → Check: `node --version`
- [ ] Groq API key ready → Get at [console.groq.com](https://console.groq.com)
- [ ] Terminal/Command Prompt open
- [ ] Code editor ready (VS Code, etc.)

---

## 🚀 5-Minute Setup

### 1️⃣ Install Backend (2 min)

```bash
cd Smart-Ingredient-Analyzer/back-end
npm install
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

**✅ Success Check**: You should see `node_modules` folder created

---

### 2️⃣ Install Frontend (1 min)

```bash
cd ../front-end
npm install
```

**✅ Success Check**: You should see `node_modules` folder created

---

### 3️⃣ Start Backend (30 sec)

```bash
cd ../back-end
npm start
```

**✅ Success Check**: You should see:
```
🚀 Smart Food Analyzer API running on port 5000
```

**Keep this terminal running!**

---

### 4️⃣ Start Frontend (30 sec)

**Open a NEW terminal:**

```bash
cd Smart-Ingredient-Analyzer/front-end
npm run dev
```

**✅ Success Check**: You should see:
```
➜  Local:   http://localhost:5173/
```

---

### 5️⃣ Open Browser (1 min)

1. Open browser
2. Go to: [http://localhost:5173](http://localhost:5173)
3. You should see the AI Health Copilot!

**✅ Success Check**: Chat interface appears with welcome message

---

## 🧪 Quick Test

### Test 1: Chat
- Type: "I'm concerned about sugar"
- Press Enter
- AI should respond understanding your concern

✅ **Pass**: AI responds conversationally

---

### Test 2: Image Upload
- Click "Upload" button
- Select any food product image
- Wait for analysis

✅ **Pass**: Analysis appears with conversational explanation

---

### Test 3: Follow-up Question
- After analysis, type: "Is this safe for kids?"
- Press "Ask"
- AI should answer with reasoning

✅ **Pass**: AI answers with context and reasoning

---

## 🐛 Troubleshooting

### Backend won't start?

**Check 1**: Is port 5000 free?
```bash
# Mac/Linux
lsof -i :5000

# Windows
netstat -ano | findstr :5000
```

**Fix**: Change port in `.env` to 5001

---

**Check 2**: Is GROQ_API_KEY set?
```bash
cat .env
```

**Fix**: Make sure key is there and no extra spaces

---

### Frontend won't connect?

**Check 1**: Is backend running?
```bash
# Open in browser:
http://localhost:5000/health
```

**Expected**: `{"status":"OK",...}`

**Fix**: Start backend if not running

---

### OCR not working?

**Check 1**: Image quality
- ✅ Clear, focused image
- ✅ Good lighting
- ✅ Horizontal text
- ❌ Blurry, dark, or tilted

**Fix**: Try with better quality image

---

## 📋 What You Should Have Now

```
✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:5173
✅ Chat interface visible
✅ Can send messages
✅ Can upload/capture images
✅ Analysis appears with reasoning
✅ Can ask follow-up questions
```

---

## 🎯 Next Steps

1. [ ] Test with multiple food products
2. [ ] Try different types of questions
3. [ ] Test context inference (mention allergies)
4. [ ] Verify uncertainty handling works
5. [ ] Test follow-up questions
6. [ ] Plan your demo video
7. [ ] Record 2-minute demo
8. [ ] Submit to hackathon!

---

## 📞 Need Help?

### Common Issues

**"Cannot find module"**
→ Run `npm install` again

**"Port already in use"**
→ Change port in `.env`

**"API key invalid"**
→ Get new key from console.groq.com

**"OCR failed"**
→ Try clearer image with better lighting

**"Analysis too slow"**
→ Normal for first request, should be faster after

---

## 🎬 Ready for Demo?

Once everything works:

1. **Read**: [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
2. **Prepare**: Have food product ready
3. **Practice**: Do a full run-through
4. **Record**: 2-minute video
5. **Submit**: Add video link to README

---

## ✨ You're All Set!

Your AI-native health copilot is ready to help people understand ingredients at the moment of decision!

**Key Features Working**:
- ✅ Intent-first design (no forms)
- ✅ Context inference (learns from conversation)
- ✅ Reasoning transparency (explains why)
- ✅ Uncertainty handling (honest about limits)
- ✅ Conversational interaction (natural questions)
- ✅ Progressive disclosure (shows what matters)

**Good luck with your hackathon! 🚀**
