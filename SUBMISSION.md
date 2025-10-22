# WindBorne Systems Junior Web Developer - Submission

## 📋 Application Details

### Candidate Information

- **Name**: Muhammad Abdullah Tahir
- **Email**: your@email.com _(replace with your actual email)_
- **Role**: Junior Web Developer

### Submission URLs

- **Live Application**: `https://your-deployment-url.vercel.app` _(update after deployment)_
- **Portfolio**: `https://your-portfolio-url.com` _(add your portfolio link)_
- **Resume**: `https://your-resume-url.com` _(add your resume link - Google Drive, etc.)_

---

## 🎯 Technical Implementation

### Challenge Requirements ✅

1. **✅ Fetch Balloon Data**

   - Fetches all 24 hourly JSON files (00.json - 23.json)
   - Implements fault-tolerant parsing for corrupted/missing data
   - Handles JSON validation and data sanitization

2. **✅ Reconstruct Flight Paths**

   - Groups coordinates into balloon trajectories
   - Displays 24-hour flight paths on interactive map
   - Color-coded paths for easy identification

3. **✅ External Dataset Integration**

   - Uses OpenWeatherMap API (free tier)
   - Overlays temperature, wind speed, and weather conditions
   - Strategically samples balloon locations to avoid rate limits

4. **✅ Frontend with Next.js + React + Tailwind**

   - Modern, responsive UI design
   - Real-time map visualization using Leaflet.js
   - Beautiful gradient backgrounds and smooth animations

5. **✅ Live Updates**

   - Auto-refresh every 5 minutes
   - Manual refresh button available
   - Shows last update timestamp

6. **✅ Robustness**

   - Comprehensive error handling for API failures
   - Smart caching system (5 min balloons, 10 min weather)
   - Graceful degradation with demo weather data
   - Loading states and error messages

7. **✅ Hosting**
   - Deployed on Vercel for optimal performance
   - Global CDN distribution
   - Automatic HTTPS and edge caching

---

## 💡 Key Design Decisions

### Why OpenWeatherMap?

**Weather data was chosen because it directly correlates with balloon movement:**

- Wind speed and direction influence flight trajectories
- Temperature and pressure affect balloon altitude
- Real-time weather provides scientific context for balloon positions
- Enables prediction of future balloon paths based on weather patterns

This dataset creates a meaningful visualization where users can:

- Understand WHY balloons move in certain directions (wind patterns)
- See atmospheric conditions at high altitudes
- Correlate weather systems with balloon clustering

### Technical Highlights

1. **Fault-Tolerant Parsing**

   - Validates coordinate ranges (lat: -90 to 90, lon: -180 to 180)
   - Attempts JSON repair for common issues
   - Filters invalid data points automatically

2. **Smart Caching Strategy**

   - Reduces API calls to stay within free tier limits
   - In-memory caching with timestamp tracking
   - Rounded coordinates for weather to maximize cache hits

3. **Performance Optimization**

   - Dynamic imports to prevent SSR issues with Leaflet
   - Parallel API fetching for all 24 hours
   - Efficient React rendering with proper key management

4. **User Experience**
   - Color-coded balloon paths for easy tracking
   - Interactive popups with detailed information
   - Responsive legend and info panel
   - Professional loading animations

---

## 🚀 API Submission Body

**POST to**: `https://windbornesystems.com/career_applications.json`

```json
{
  "career_application": {
    "name": "Muhammad Abdullah Tahir",
    "email": "your@email.com",
    "role": "Junior Web Developer",
    "notes": "I specialize in full-stack web development with React, Next.js, and modern data visualization techniques. I thrive in collaborative environments and love solving complex technical challenges. I chose OpenWeatherMap data because weather conditions (especially wind patterns) directly influence balloon trajectories, creating a scientifically meaningful visualization that helps understand atmospheric dynamics and predict balloon movement.",
    "submission_url": "https://your-deployment-url.vercel.app",
    "portfolio_url": "https://abdullah-tahir.vercel.app",
    "resume_url": "https://drive.google.com/file/d/1r920A2Q8MUHv5__knPGiGXBtpkBykchf/view?usp=sharing"
  }
}
```

---

## 📝 Before Submitting

### Checklist:

- [ ] Update your email in the JSON
- [ ] Deploy to Vercel and get live URL
- [ ] Update `submission_url` with your Vercel deployment URL
- [ ] Add your portfolio URL (GitHub, personal site, or best project)
- [ ] Upload resume to Google Drive/Dropbox and get public link
- [ ] Update `resume_url` with public resume link
- [ ] Test the live application thoroughly
- [ ] Verify all balloon paths render correctly
- [ ] Check weather overlays appear
- [ ] Confirm auto-refresh works

### To Submit:

```bash
# Using curl (replace with your actual data)
curl -X POST https://windbornesystems.com/career_applications.json \
  -H "Content-Type: application/json" \
  -d '{
    "career_application": {
      "name": "Muhammad Abdullah Tahir",
      "email": "your@email.com",
      "role": "Junior Web Developer",
      "notes": "I specialize in full-stack web development with React, Next.js, and modern data visualization techniques. I thrive in collaborative environments and love solving complex technical challenges. I chose OpenWeatherMap data because weather conditions (especially wind patterns) directly influence balloon trajectories, creating a scientifically meaningful visualization that helps understand atmospheric dynamics and predict balloon movement.",
      "submission_url": "https://your-deployment-url.vercel.app",
    "portfolio_url": "https://abdullah-tahir.vercel.app",
    "resume_url": "https://drive.google.com/file/d/1r920A2Q8MUHv5__knPGiGXBtpkBykchf/view?usp=sharing"
    }
  }'
```

Or use a tool like Postman/Insomnia with the JSON body.

---

## 🎓 Collaboration Pitch

As a full-stack developer, I bring:

- **Technical Versatility**: Comfortable with frontend (React/Next.js), backend (Node.js/FastAPI), and DevOps
- **Problem-Solving Mindset**: Implemented fault-tolerant parsing and smart caching without explicit requirements
- **User-Centric Design**: Created an intuitive, beautiful interface that makes complex data accessible
- **Documentation Skills**: Comprehensive README, deployment guide, and code comments
- **Initiative**: Added features like auto-refresh, demo mode, and performance optimizations

I'm excited about WindBorne's mission to improve weather forecasting and would love to contribute to building tools that help scientists and engineers understand atmospheric data.

---

## 📚 Repository Structure

```
onboarding/
├── app/
│   ├── api/
│   │   ├── balloons/route.ts    # Balloon data fetching & caching
│   │   └── weather/route.ts     # Weather API integration
│   ├── components/
│   │   └── BalloonMap.tsx       # Main map visualization
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Styles + Leaflet CSS
├── README.md                    # Full project documentation
├── DEPLOYMENT.md                # Deployment instructions
├── SUBMISSION.md                # This file
└── vercel.json                  # Vercel configuration
```

Good luck with your submission! 🎈
