# 🚀 START HERE - Complete Setup Instructions

Follow these steps EXACTLY to get your AI Health Copilot running!

## ⚠️ IMPORTANT - You Need This First!

### Get Your FREE Groq API Key

1. **Go to**: https://console.groq.com
2. **Sign up** with your email (it's FREE!)
3. **Go to API Keys** section
4. **Create API Key** and copy it
5. **Keep it handy** - you'll need it in Step 3 below

---

## 📦 Step 1: Install Backend Dependencies

Open Terminal and run:

```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
npm install
```

⏱️ **This will take 2-3 minutes**

✅ **You should see**: "added XXX packages" at the end

---

## 🎨 Step 2: Install Frontend Dependencies

In the same terminal:

```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/front-end
npm install
```

⏱️ **This will take 2-3 minutes**

✅ **You should see**: "added XXX packages" at the end

---

## 🔑 Step 3: Configure Your API Key

### Copy the example file:

```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
cp .env.example .env
```

### Edit the .env file:

**Option 1 - Using nano (easiest):**
```bash
nano .env
```
- Replace `your_groq_api_key_here` with your actual API key
- Press `Ctrl+X`, then `Y`, then `Enter` to save

**Option 2 - Using any text editor:**
- Open `.env` file in VS Code, TextEdit, or any editor
- Replace `your_groq_api_key_here` with your actual API key
- Save the file

Your `.env` should look like:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
PORT=5000
```

✅ **Check**: Make sure there are NO spaces before or after the key!

---

## 🚀 Step 4: Start the Backend

Open a terminal and run:

```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
npm start
```

✅ **You should see**:
```
🚀 Smart Food Analyzer API running on port 5000
📍 Environment: development
🤖 AI Model: llama-3.3-70b-versatile
```

**⚠️ KEEP THIS TERMINAL WINDOW OPEN!**

---

## 🎨 Step 5: Start the Frontend

**Open a NEW terminal window** (keep the backend running!) and run:

```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/front-end
npm run dev
```

✅ **You should see**:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**⚠️ KEEP THIS TERMINAL WINDOW OPEN TOO!**

---

## 🌐 Step 6: Open the App

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the AI Health Copilot interface!

---

## ✅ Quick Test

### Test 1: Chat Works
- You should see a welcome message from the AI
- Type: "I'm concerned about sugar for diabetes"
- Press Enter
- AI should respond understanding your concern

✅ **PASS**: If AI responds conversationally

---

### Test 2: Image Analysis Works
- Click the **"Upload"** or **"Camera"** button
- Upload a photo of any food label (or use camera)
- Wait for analysis (5-10 seconds)

✅ **PASS**: If you see conversational analysis with key insights

---

## 🎉 You're Ready!

If both tests pass, your app is fully working! Now you can:

1. ✅ Test with different food products
2. ✅ Try asking follow-up questions
3. ✅ Test context inference
4. ✅ Record your demo video

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution**: You need to install Node.js
- Go to: https://nodejs.org
- Download and install Node.js 18 or higher
- Restart terminal and try again

---

### Problem: Backend won't start - "GROQ_API_KEY is required"
**Solution**: Check your .env file
```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
cat .env
```
- Make sure your API key is there
- Make sure there are no extra spaces
- Make sure the file is named `.env` exactly (not `.env.txt`)

---

### Problem: "Port 5000 already in use"
**Solution**: Another app is using port 5000
```bash
# Find what's using port 5000
lsof -i :5000

# Kill that process or change port in .env
```

---

### Problem: Frontend shows "Cannot connect to server"
**Solution**: Make sure backend is running
- Check that backend terminal is still open
- Open http://localhost:5000/health in browser
- Should show: `{"status":"OK"}`

---

### Problem: "API key invalid" or "403 Forbidden"
**Solution**: Your API key is wrong
- Go back to https://console.groq.com
- Create a new API key
- Update your .env file

---

### Problem: OCR not reading ingredients
**Solution**: Image quality issue
- Make sure image is clear and focused
- Good lighting
- Text should be horizontal (not tilted)
- Try getting closer to the label

---

## 📝 To Stop the App

When you're done testing:

1. Go to backend terminal
2. Press `Ctrl+C`
3. Go to frontend terminal
4. Press `Ctrl+C`

To restart: Just run Step 4 and Step 5 again!

---

## 📋 Final Checklist

Before recording your demo:

- [ ] Backend running (terminal shows "running on port 5000")
- [ ] Frontend running (terminal shows "Local: http://localhost:5173")
- [ ] Browser open at http://localhost:5173
- [ ] Chat interface visible
- [ ] Can type and send messages
- [ ] Can upload/capture images
- [ ] Analysis shows with conversational explanation
- [ ] Can ask follow-up questions
- [ ] Have food product ready for demo

---

## 🎬 Ready to Record Demo?

Read: [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)

---

## 💡 Quick Commands Reference

```bash
# Start Backend
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
npm start

# Start Frontend (in new terminal)
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/front-end
npm run dev

# Stop: Press Ctrl+C in each terminal
```

---

## ❓ Need More Help?

Check these files:
- **QUICK_START.md** - Shorter version
- **SETUP_GUIDE.md** - Detailed troubleshooting
- **KEY_INNOVATIONS.md** - What makes this AI-native
- **DEMO_SCRIPT.md** - How to record demo video

---

**Good luck with your hackathon! 🚀**
