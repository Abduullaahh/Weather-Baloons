# 🎈 WindBorne Balloon Tracker

A professional real-time visualization of WindBorne Systems' weather balloon constellation, combining live balloon telemetry with global weather data.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🗺️ **Live Balloon Tracking**
- Visualizes **1000+ balloon trajectories** over the last 24 hours
- Color-coded flight paths with altitude data
- Interactive popups showing position, altitude, and data points

### 🌤️ **Weather Integration**
- Real-time weather data from **OpenWeatherMap API**
- Temperature, wind speed, and conditions overlaid on balloon positions
- Scientifically meaningful: weather (especially wind) directly influences balloon trajectories

### 🛡️ **Production-Ready**
- **Fault-tolerant parsing**: Handles corrupted or missing JSON data gracefully
- **Smart caching**: Prevents API rate limits with intelligent cache management
- **Auto-refresh**: Updates every 5 minutes automatically
- **Responsive design**: Works on desktop and mobile

### 🎨 **Professional UI**
- Clean dashboard-style interface
- Real-time metrics: Active balloons, data sources, weather points
- Interactive map legend
- Loading states and error handling

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript 5
- **Styling**: Tailwind CSS 3
- **Mapping**: Leaflet.js + React-Leaflet
- **APIs**: WindBorne Systems + OpenWeatherMap
- **Deployment**: Vercel (serverless)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free tier: https://openweathermap.org/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/windborne-balloon-tracker.git
cd windborne-balloon-tracker

# Install dependencies
npm install

# Set up environment variables
echo "OPENWEATHER_API_KEY=your_api_key_here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

See **[DEPLOY.md](./DEPLOY.md)** for detailed deployment instructions.

**Quick Deploy to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# OPENWEATHER_API_KEY=your_api_key_here
```

## 📋 Project Structure

```
windborne-balloon-tracker/
├── app/
│   ├── api/
│   │   ├── balloons/route.ts    # Balloon data API
│   │   └── weather/route.ts     # Weather data API
│   ├── components/
│   │   └── BalloonMap.tsx       # Main map component
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── public/                      # Static assets
├── DEPLOY.md                    # Deployment guide
├── SUBMISSION_CHECKLIST.md      # Pre-submission checklist
└── submission.json              # Career application template
```

## 🔧 API Routes

### `/api/balloons`
Fetches and processes balloon constellation data from WindBorne Systems.

**Features:**
- Fetches 24 hourly JSON files in parallel (00.json - 23.json)
- Fault-tolerant JSON parsing with repair attempts
- Trajectory reconstruction algorithm
- 5-minute cache with force-refresh option

**Query Parameters:**
- `refresh=true` - Force cache refresh

### `/api/weather`
Fetches weather data from OpenWeatherMap API.

**Features:**
- 10-minute cache per coordinate
- Smart coordinate rounding to reduce cache misses
- Fallback to demo mode if API key not set

**Query Parameters:**
- `lat` - Latitude (required)
- `lon` - Longitude (required)

## 🎨 UI Components

### Header Bar
- Application title with balloon emoji
- Real-time metrics (balloons, data sources, weather points)
- Last update timestamp
- Refresh button with loading state

### Interactive Map
- Full-screen Leaflet map
- Color-coded balloon trajectories
- Weather data overlays (orange markers)
- Clickable popups with detailed info

### Legend
- Visual guide for map elements
- Clean, professional design
- Positioned bottom-right for easy reference

## 🧪 Technical Highlights

### Fault-Tolerant JSON Parsing
```typescript
// Attempts to repair corrupted JSON
function repairJSON(text: string): string {
  return text
    .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
    .replace(/'/g, '"')              // Single quotes to double
    .replace(/(\w+):/g, '"$1":')     // Unquoted keys
    .replace(/,\s*}/g, '}');         // Trailing comma in objects
}
```

### Smart Trajectory Reconstruction
- Tracks balloons across 24 hourly data points
- Uses proximity matching to link coordinates
- Filters out single-point anomalies
- Handles new balloons appearing mid-flight

### Efficient Caching Strategy
- Balloon data: 5-minute cache
- Weather data: 10-minute cache with coordinate rounding
- In-memory caching prevents excessive API calls
- Cache-busting for development/debugging

## 📊 Data Justification

**Why OpenWeatherMap?**

Weather data (especially wind patterns) directly influences balloon trajectories. By overlaying live weather conditions on balloon positions, we can:

1. **Understand atmospheric dynamics** - See how wind affects balloon movement
2. **Predict future paths** - Weather patterns help forecast balloon trajectories
3. **Scientific correlation** - Temperature and pressure affect balloon altitude
4. **Visual insight** - Immediate understanding of environmental conditions

This creates a scientifically meaningful visualization that goes beyond simple location tracking.

## 🤝 Contributing

This project was built as part of the WindBorne Systems Junior Web Developer challenge.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **WindBorne Systems** for the fascinating balloon constellation data
- **OpenWeatherMap** for comprehensive weather API
- **Leaflet.js** for the excellent mapping library
- **Vercel** for seamless deployment platform

## 📞 Contact

**Muhammad Abdullah Tahir**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your@email.com

---

Built with ❤️ for WindBorne Systems | Powered by Next.js + React + Leaflet 🎈
