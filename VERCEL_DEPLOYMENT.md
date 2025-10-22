# 🚀 Vercel Deployment Guide

## ✅ Fixed: Environment Variable Issue

The `vercel.json` has been updated to remove the secret reference that was causing the error.

---

## 📋 Step-by-Step Deployment

### Method 1: Via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "WindBorne Balloon Tracker - Ready for deployment"
git push origin main
```

#### Step 2: Import to Vercel
1. Go to https://vercel.com/
2. Click **"Add New Project"**
3. Click **"Import"** next to your GitHub repository
4. Click **"Import"** to proceed

#### Step 3: Configure Project Settings
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

#### Step 4: Add Environment Variable
**CRITICAL STEP** - Before deploying, add your API key:

1. Click **"Environment Variables"** section
2. Add the following:
   - **Key**: `OPENWEATHER_API_KEY`
   - **Value**: `89972890df182b96246044805e4d18c8`
   - **Environment**: Select all (Production, Preview, Development)

3. Click **"Add"**

#### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Get your deployment URL (e.g., `https://your-project.vercel.app`)

---

### Method 2: Via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Deploy
```bash
# From project directory
vercel

# When prompted, answer:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? (press enter to accept default)
# - Directory? ./ (press enter)
# - Override settings? No
```

#### Step 4: Add Environment Variable
```bash
# Add the environment variable
vercel env add OPENWEATHER_API_KEY

# When prompted:
# - Value: 89972890df182b96246044805e4d18c8
# - Environment: Production, Preview, Development (select all)
```

#### Step 5: Deploy to Production
```bash
vercel --prod
```

---

## 🔍 Verify Deployment

After deployment, test your app:

1. **Open your Vercel URL** in a browser
2. **Check the header** - should show stats for balloons, data sources, weather
3. **Check the map** - should show colorful balloon trajectories
4. **Check weather markers** - should show orange weather points
5. **Click "Refresh Data"** - should fetch new data

### ✅ What to Look For:
- Header with gradient background (purple/pink)
- Stats cards showing numbers
- Interactive map with balloon paths
- Weather data overlays (orange markers)
- Legend in bottom-right corner

### ❌ If Something's Wrong:

**No weather data showing?**
1. Go to Vercel Dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Verify `OPENWEATHER_API_KEY` is set to: `89972890df182b96246044805e4d18c8`
5. Redeploy: **Deployments** → **...** → **Redeploy**

**Build failed?**
- Check build logs in Vercel dashboard
- Look for TypeScript or import errors
- Try running `npm run build` locally first

**App loads but no balloons?**
- The WindBorne API might be rate-limiting
- Wait a few minutes and refresh
- Check browser console for errors

---

## 🎯 Your Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Environment variable added: `OPENWEATHER_API_KEY=89972890df182b96246044805e4d18c8`
- [ ] Deployment successful (green checkmark)
- [ ] App opens in browser
- [ ] Header shows stats
- [ ] Map shows balloon trajectories
- [ ] Weather data is visible
- [ ] Copied deployment URL

---

## 📝 Use Your Deployment URL

Once deployed, copy your Vercel URL and update `submission.json`:

```json
{
  "career_application": {
    "name": "Muhammad Abdullah Tahir",
    "email": "hafizabdullahtahir@gmail.com",
    "role": "Junior Web Developer",
    "notes": "I specialize in full-stack web development with React, Next.js, and modern data visualization techniques. I thrive in collaborative environments and love solving complex technical challenges. I chose OpenWeatherMap data because weather conditions (especially wind patterns) directly influence balloon trajectories, creating a scientifically meaningful visualization that helps understand atmospheric dynamics and predict balloon movement.",
    "submission_url": "https://your-project.vercel.app",
    "portfolio_url": "https://github.com/YOUR_USERNAME/windborne-balloon-tracker",
    "resume_url": "https://your-resume-url.com"
  }
}
```

---

## 🆘 Common Issues & Solutions

### Issue: "Environment variable not found"
**Solution**: Make sure to add the environment variable in Vercel Dashboard under Settings → Environment Variables

### Issue: "Build failed with TypeScript errors"
**Solution**: Run `npm run build` locally first to catch any errors

### Issue: "Function execution timeout"
**Solution**: The APIs might be slow. This is normal for first load. Add caching in production.

### Issue: "Rate limit exceeded"
**Solution**: The OpenWeatherMap free tier allows 1000 calls/day. Our app uses smart caching to minimize calls.

---

## 🎉 Success!

Once deployed, your WindBorne Balloon Tracker will be live at:
```
https://your-project.vercel.app
```

**Features Working:**
✅ 1000+ balloon trajectories  
✅ Live weather data  
✅ Auto-refresh every 5 minutes  
✅ Professional gradient header  
✅ Interactive map with legend  
✅ Smart caching system  

---

## 📞 Next Steps

1. **Test your deployment** - Open the URL and verify everything works
2. **Update submission.json** - Add your Vercel URL
3. **Submit to WindBorne** - Follow instructions in SUBMISSION.md

**Your app is production-ready!** 🎈🚀

