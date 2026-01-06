# ✅ Deployment Checklist

Use this checklist to deploy your app step-by-step.

---

## 📋 Pre-Deployment

- [ ] You have a GitHub account
- [ ] Your code is pushed to GitHub
- [ ] You have a Groq API key ([Get one here](https://console.groq.com/keys))
- [ ] You've signed up for [Render](https://render.com) (free)
- [ ] You've signed up for [Vercel](https://vercel.com) (free)

---

## 🔧 Backend Deployment (Render)

- [ ] Go to [render.com/dashboard](https://dashboard.render.com/)
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Fill in settings:
  - [ ] **Name**: `smart-ingredient-api`
  - [ ] **Root Directory**: `Smart-Ingredient-Analyzer/backend`
  - [ ] **Build Command**: `./build.sh`
  - [ ] **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  - [ ] `GROQ_API_KEY` = (paste your key)
  - [ ] `NODE_ENV` = `production`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete (~5 mins)
- [ ] Copy your backend URL (looks like: `https://smart-ingredient-api.onrender.com`)
- [ ] Test backend health: Visit `https://your-url.onrender.com/health`

---

## 🎨 Frontend Deployment (Vercel)

- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Click "Import" on your repository
- [ ] Configure project:
  - [ ] **Root Directory**: `Smart-Ingredient-Analyzer/front-end`
  - [ ] **Framework Preset**: Vite (should auto-detect)
  - [ ] **Build Command**: `npm run build` (default)
  - [ ] **Output Directory**: `dist` (default)
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = (paste your Render backend URL, NO trailing slash)
- [ ] Click "Deploy"
- [ ] Wait for deployment (~2 mins)
- [ ] Copy your frontend URL (looks like: `https://your-app.vercel.app`)

---

## 🧪 Testing

- [ ] Visit your Vercel app URL
- [ ] Test manual ingredient input
- [ ] Test image upload (if it's slow, it's normal on free tier)
- [ ] Test chat functionality
- [ ] Test comparison mode
- [ ] Verify context memory persists

---

## 🎉 Post-Deployment

- [ ] Share your live app URL!
- [ ] Add URL to your GitHub README
- [ ] Monitor Render logs for errors
- [ ] Check Vercel analytics

---

## 🐛 If Something Breaks

**Backend Issues:**
1. Check Render dashboard → Logs
2. Verify environment variables are set
3. Test `/health` endpoint directly
4. Check Tesseract installed in build logs

**Frontend Issues:**
1. Check browser console for errors
2. Verify `VITE_API_URL` in Vercel settings
3. Ensure no trailing slash in API URL
4. Check network tab for failed requests

**OCR Not Working:**
- This is expected on free tier (limited CPU/memory)
- Manual input should work fine
- Consider upgrading Render plan for full OCR support

---

## 📱 Your Live URLs

Write them here once deployed:

- **Frontend**: `https://______________________.vercel.app`
- **Backend**: `https://______________________.onrender.com`

---

## 🎯 Done!

Share your app with friends, judges, and on social media! 🚀

Need help? Check:
- [README_DEPLOY.md](Smart-Ingredient-Analyzer/README_DEPLOY.md) - Detailed guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Troubleshooting
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
