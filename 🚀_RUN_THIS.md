# 🚀 FINAL INSTRUCTIONS - RUN YOUR APP

Everything is configured! Your API key is already set up. Just follow these steps:

---

## ⚠️ FIRST: Check if Node.js is Installed

Open **Terminal** and run:
```bash
node --version
```

**If you see a version number** (like v18.x.x or v20.x.x):
✅ Great! Skip to "RUN THE APP" below

**If you see "command not found"**:
❌ You need to install Node.js first:
1. Go to: https://nodejs.org
2. Download the LTS version (left button)
3. Install it
4. Restart Terminal
5. Come back to this guide

---

## 🚀 RUN THE APP (After Node.js is installed)

### Step 1: Install Dependencies (One time, ~3-5 minutes)

Open Terminal and copy-paste this:

```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
npm install
```

Wait for it to finish, then:

```bash
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/front-end
npm install
```

✅ You should see "added XXX packages"

---

### Step 2: Start Backend

In Terminal, run:

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

**⚠️ KEEP THIS TERMINAL WINDOW OPEN! Don't close it!**

---

### Step 3: Start Frontend (New Terminal Window)

**Open a NEW Terminal window** (Cmd+N or File → New Window)

Then run:

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

## 🌐 STEP 4: OPEN YOUR APP!

**Click this link or copy to browser:**

# 👉 http://localhost:5173

---

## ✅ YOUR APP IS NOW RUNNING!

You should see:
- 🤖 AI Health Copilot interface
- Chat welcome message
- Camera and Upload buttons
- Text input at bottom

---

## 🧪 QUICK TEST

1. **Type**: "I'm concerned about sugar for diabetes"
2. **Press Enter**
3. **AI should respond** understanding your concern

4. **Click "Upload"** button
5. **Select any food label image** from your computer
6. **Wait 5-15 seconds**
7. **See conversational analysis** appear!

---

## 🛑 TO STOP THE APP

When you're done testing:

1. Go to **first terminal** (backend) → Press `Ctrl+C`
2. Go to **second terminal** (frontend) → Press `Ctrl+C`

---

## 🎬 READY TO RECORD DEMO?

Once the app is working:

1. Read: **DEMO_SCRIPT.md**
2. Have a food product with clear ingredient label ready
3. Record your 2-minute video showing:
   - Chat interface (no forms!)
   - Type health concern
   - Upload/scan product
   - Show conversational analysis
   - Ask follow-up question

---

## 🐛 TROUBLESHOOTING

### Problem: "Port 5000 already in use"
**Solution**:
```bash
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```
Then start backend again

---

### Problem: "Cannot connect to server" in browser
**Solution**: Make sure backend terminal is still running with `npm start`

---

### Problem: OCR not reading text
**Solution**:
- Use clear, well-lit image
- Focus on ingredient list
- Make sure text is horizontal (not tilted)

---

## 📋 SUMMARY OF COMMANDS

```bash
# STEP 1: Install backend (one time)
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
npm install

# Install frontend (one time)
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/front-end
npm install

# STEP 2: Start backend (terminal 1, keep open)
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/back-end
npm start

# STEP 3: Start frontend (terminal 2, keep open)
cd /Users/shriyanshraj/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/front-end
npm run dev

# STEP 4: Open in browser
http://localhost:5173
```

---

## ✅ CHECKLIST

- [ ] Node.js installed (check: `node --version`)
- [ ] Backend dependencies installed (`npm install` in back-end folder)
- [ ] Frontend dependencies installed (`npm install` in front-end folder)
- [ ] Backend running (terminal shows "running on port 5000")
- [ ] Frontend running (terminal shows "Local: http://localhost:5173")
- [ ] Browser open at http://localhost:5173
- [ ] App loads with chat interface
- [ ] Can type messages and get AI responses
- [ ] Can upload images and get analysis
- [ ] Can ask follow-up questions

**All checked?** → Ready to record demo! 🎉

---

## 🎯 THE LINK YOU NEED

Once everything is running, your app will be at:

# http://localhost:5173

**This only works when:**
1. Backend terminal is running (Step 2)
2. Frontend terminal is running (Step 3)
3. Both terminals are kept open

---

## 💡 QUICK TIPS

- **First time takes longer**: Initial npm install takes 3-5 minutes
- **Keep terminals open**: Don't close them while using the app
- **To restart**: Just run Step 2 and Step 3 again (no need to reinstall)
- **For demo**: Practice once before recording

---

## ⏰ YOU'RE ALMOST DONE!

1. ✅ Code is ready
2. ✅ API key is configured
3. ⏳ Install Node.js (if needed)
4. ⏳ Run the commands above
5. ⏳ Test the app
6. ⏳ Record demo video
7. ⏳ Submit to hackathon

**Good luck! 🚀**
