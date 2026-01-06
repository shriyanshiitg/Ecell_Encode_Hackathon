# 🚀 Deployment Guide - Smart Ingredient Analyzer

This guide will help you deploy your app live in ~10 minutes.

## Overview
- **Backend**: Python FastAPI on Render (Free tier)
- **Frontend**: React on Vercel (Free tier)

---

## 📋 Prerequisites

1. **GitHub account** (create at github.com)
2. **Render account** (sign up at render.com with GitHub)
3. **Vercel account** (sign up at vercel.com with GitHub)
4. **Groq API Key** (from console.groq.com)

---

## Part 1: Deploy Backend to Render (5 mins)

### Step 1: Push Code to GitHub

```bash
cd ~/Desktop/ECell_Hackathon
git add .
git commit -m "Prepare for deployment"
git push origin main
```

If you don't have a GitHub repo yet:
```bash
# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com/dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `smart-ingredient-analyzer-api`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `Smart-Ingredient-Analyzer/backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && apt-get update && apt-get install -y tesseract-ocr
     ```
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   GROQ_API_KEY=<your-groq-api-key>
   NODE_ENV=production
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. **Copy your backend URL** (something like `https://smart-ingredient-analyzer-api.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel (3 mins)

### Step 1: Configure Frontend for Production

1. Create `.env.production` in `front-end/` folder:
   ```bash
   cd ~/Desktop/ECell_Hackathon/Smart-Ingredient-Analyzer/front-end
   nano .env.production
   ```

2. Add your Render backend URL:
   ```
   VITE_API_URL=https://smart-ingredient-analyzer-api.onrender.com
   ```
   *(Replace with YOUR actual Render URL from Part 1, Step 8)*

3. Save and commit:
   ```bash
   git add .env.production
   git commit -m "Add production API URL"
   git push
   ```

### Step 2: Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Smart-Ingredient-Analyzer/front-end`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)

4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://smart-ingredient-analyzer-api.onrender.com
   ```
   *(Use YOUR Render backend URL)*

5. Click **"Deploy"**
6. Wait 2-3 minutes
7. **Your app is live!** 🎉

---

## Part 3: Test Your Live App

1. Open your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Try all features:
   - ✅ Upload an ingredient image
   - ✅ Type ingredients manually
   - ✅ Chat with AI
   - ✅ Comparison mode
   - ✅ Context memory

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- Check Render logs for errors
- Verify `GROQ_API_KEY` is set correctly
- Ensure Tesseract installed (check build logs)

**Problem**: CORS errors in browser
- Verify backend `NODE_ENV=production` is set
- Check CORS settings in `main.py` allow `*` origins

### Frontend Issues

**Problem**: "Failed to fetch" or network errors
- Check `VITE_API_URL` points to correct Render URL
- Ensure no trailing slash in API URL
- Verify Render backend is running (visit `/health` endpoint)

**Problem**: OCR not working
- This is expected on free tier (Tesseract may timeout)
- Manual input should work fine
- Consider upgrading Render plan for OCR support

---

## 💰 Free Tier Limits

### Render (Backend)
- ✅ 750 hours/month free
- ⚠️ Spins down after 15 mins of inactivity (first request takes 30s)
- ⚠️ Limited CPU (OCR may be slow)

### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ Fast CDN worldwide
- ✅ Automatic SSL

---

## 🎯 Next Steps

1. **Custom Domain** (optional):
   - Add domain in Vercel dashboard
   - Update CORS in backend if needed

2. **Upgrade Plans** (for better performance):
   - Render: $7/month for always-on backend
   - Keeps OCR fast and responsive

3. **Monitor Usage**:
   - Render dashboard: Check logs and metrics
   - Vercel dashboard: Check analytics

---

## 📱 Share Your App

Your live URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-api.onrender.com`

Share the frontend URL with anyone! 🎉

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Check deployment logs in both dashboards

**Good luck with your deployment! 🚀**
