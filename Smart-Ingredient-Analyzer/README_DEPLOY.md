# 🚀 Deploy Your App in 5 Minutes

## ✅ What's Ready

Your app is **100% ready to deploy**! All configuration files are set up:

- ✅ Backend: Python FastAPI with OCR
- ✅ Frontend: React with Vite
- ✅ CORS configured
- ✅ Environment variables ready
- ✅ Build scripts created
- ✅ Deployment configs ready

---

## 🎯 Simple Steps

### 1️⃣ Push to GitHub (if not done)

```bash
cd ~/Desktop/ECell_Hackathon
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2️⃣ Deploy Backend (Render - Free)

1. Go to **[render.com](https://render.com)** → Sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your repository
4. Fill in:
   - **Name**: `smart-ingredient-api`
   - **Root Directory**: `Smart-Ingredient-Analyzer/backend`
   - **Build Command**: `./build.sh`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **"Advanced"** → Add environment variables:
   ```
   GROQ_API_KEY = <paste-your-groq-key>
   NODE_ENV = production
   ```
6. Click **"Create Web Service"**
7. **COPY THE URL** (like `https://smart-ingredient-api.onrender.com`)

### 3️⃣ Deploy Frontend (Vercel - Free)

1. Go to **[vercel.com/new](https://vercel.com/new)** → Sign in with GitHub
2. Click **"Import"** on your repository
3. Configure:
   - **Root Directory**: `Smart-Ingredient-Analyzer/front-end`
   - **Framework**: Vite (auto-detected)
4. Add Environment Variable:
   ```
   VITE_API_URL = <paste-your-render-url-from-step-2>
   ```
   *(Without trailing slash!)*
5. Click **"Deploy"**

### 🎉 Done!

Your app is live at: `https://your-app.vercel.app`

---

## 🔑 Get Your Groq API Key

Don't have one? Get it here:
1. Go to https://console.groq.com
2. Sign in
3. Navigate to **API Keys**
4. Click **"Create API Key"**
5. Copy and save it

---

## ✨ Features That Work Live

- ✅ Upload ingredient images (OCR)
- ✅ Type ingredients manually
- ✅ AI analysis with context memory
- ✅ Chat with AI
- ✅ Compare products
- ✅ Privacy controls

---

## 📱 Test Your Live App

Visit your Vercel URL and try:
1. Upload an ingredient photo
2. Chat with the AI
3. Compare two products

---

## 🛠️ Troubleshooting

**Backend taking long?**
- Free tier spins down after inactivity
- First request may take 30 seconds
- Subsequent requests are fast

**OCR not working?**
- Check Render logs
- Verify Tesseract installed in build logs
- Try manual input as fallback

**Frontend errors?**
- Verify `VITE_API_URL` is correct
- Check browser console for errors
- Ensure backend is running (`/health` endpoint)

---

## 💡 Tips

- **Backend URL**: No trailing slash
- **First Load**: Takes 30s (free tier cold start)
- **Logs**: Check Render dashboard for backend errors
- **Updates**: Push to GitHub → Auto-deploys on Vercel

---

Need detailed help? See [DEPLOYMENT.md](../DEPLOYMENT.md)
