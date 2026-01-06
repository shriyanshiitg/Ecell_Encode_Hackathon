# ⚡ Quick Deploy (5 Minutes)

## Option 1: One-Click Deploy (Easiest)

### Backend (Render)
1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo
4. Use these settings:
   ```
   Name: smart-ingredient-api
   Root Directory: Smart-Ingredient-Analyzer/backend
   Build Command: ./build.sh
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add environment variables:
   ```
   GROQ_API_KEY=<your-key>
   NODE_ENV=production
   ```
6. Click **Deploy** → Copy your URL

### Frontend (Vercel)
1. Go to: https://vercel.com/new
2. Import your GitHub repo
3. Settings:
   ```
   Root Directory: Smart-Ingredient-Analyzer/front-end
   Framework: Vite
   ```
4. Add environment variable:
   ```
   VITE_API_URL=<your-render-backend-url>
   ```
5. Click **Deploy**

**Done! 🎉**

---

## Option 2: Use Render Blueprint (Even Easier)

The `render.yaml` file is already configured!

1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repo
4. It will auto-detect `render.yaml`
5. Add your `GROQ_API_KEY`
6. Click **Deploy**

Done for backend! Then deploy frontend to Vercel as above.

---

## Your URLs After Deploy

- **App**: `https://your-app.vercel.app`
- **API**: `https://your-api.onrender.com`

Test the health endpoint: `https://your-api.onrender.com/health`

---

## Troubleshooting

**Can't find Groq API Key?**
- Get it from: https://console.groq.com/keys

**Backend not responding?**
- Check Render logs in dashboard
- First request takes 30s (free tier spins down)

**Frontend can't connect?**
- Verify `VITE_API_URL` in Vercel settings
- No trailing slash in URL

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.
