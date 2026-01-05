# ⚠️ FIX: Port 5000 Already in Use

## The Problem
Something is already running on port 5000. Let's fix it!

---

## SOLUTION: Kill the Process on Port 5000

Run this command in your terminal:

```bash
lsof -ti:5000 | xargs kill -9
```

This will kill whatever is using port 5000.

---

## THEN START BACKEND AGAIN

```bash
npm start
```

---

## ✅ You Should See:
```
🚀 Smart Food Analyzer API running on port 5000
📍 Environment: development
🤖 AI Model: llama-3.3-70b-versatile
```

---

## If That Doesn't Work - Use Different Port

Edit the .env file to use a different port:

```bash
nano .env
```

Change:
```
PORT=5000
```

To:
```
PORT=5001
```

Save (Ctrl+X, Y, Enter)

Then update frontend to use port 5001:
- Frontend will need to know the new port
- But let's try killing port 5000 first!

---

## Quick Fix Command:

Just copy and paste this:

```bash
lsof -ti:5000 | xargs kill -9 && npm start
```

This kills the process and starts backend in one command!

---
