# 🚀 Deployment Guide - WindBorne Balloon Tracker

## Quick Deploy to Vercel (Recommended)

### Step 1: Prepare Your Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: WindBorne Balloon Tracker"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/windborne-balloon-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to**: https://vercel.com/
2. **Sign up/Login** with your GitHub account
3. **Click**: "Add New Project"
4. **Import** your GitHub repository
5. **Configure Environment Variables**:
   - Click "Environment Variables"
   - Add: `OPENWEATHER_API_KEY` = `89972890df182b96246044805e4d18c8`
6. **Click**: "Deploy"

### Step 3: Your App Will Be Live! 🎉

Vercel will automatically:
- Build your Next.js app
- Deploy to a global CDN
- Provide you with a URL like: `https://your-project.vercel.app`

---

## Alternative: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
vercel

# Follow prompts and when asked about environment variables, add:
# OPENWEATHER_API_KEY=89972890df182b96246044805e4d18c8

# Deploy to production
vercel --prod
```

---

## Environment Variables Required

For production deployment, you MUST set:

```
OPENWEATHER_API_KEY=89972890df182b96246044805e4d18c8
```

---

## After Deployment

1. **Get your deployment URL** (e.g., `https://windborne-tracker.vercel.app`)
2. **Test the app** - refresh the page and verify balloons are loading
3. **Use this URL** for your submission to WindBorne Systems

---

## Troubleshooting

### Weather data not loading?
- Check that `OPENWEATHER_API_KEY` is set in Vercel environment variables
- Go to: Your Project → Settings → Environment Variables

### Build fails?
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Try running `npm run build` locally first

### Need to redeploy?
```bash
# Make changes, commit, and push to GitHub
git add .
git commit -m "Update"
git push

# Vercel will auto-deploy!
```

---

## 🎈 Your App is Ready!

Once deployed, you'll have:
- ✅ Live balloon tracking with 1000+ trajectories
- ✅ Real-time weather data integration
- ✅ Auto-refresh every 5 minutes
- ✅ Professional, responsive UI
- ✅ Fault-tolerant API handling
- ✅ Smart caching to avoid rate limits

**Next Step**: Use your Vercel URL in the WindBorne submission JSON!

