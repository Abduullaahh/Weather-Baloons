'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
// Marker component imported but not used in current implementation
// const Marker = dynamic(
//   () => import('react-leaflet').then((mod) => mod.Marker),
//   { ssr: false }
// );
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

interface BalloonData {
  balloons: { [key: string]: number[][] };
  totalBalloons: number;
  dataPointsCollected: number;
  cached: boolean;
  timestamp: string;
}

interface WeatherPoint {
  lat: number;
  lon: number;
  temp: number;
  wind_speed: number;
  weather: {
    main: string;
    description: string;
  };
}

interface BalloonMapProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const getColorForBalloon = (index: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E63946', '#A8DADC', '#457B9D', '#F1FAEE', '#E76F51'
  ];
  return colors[index % colors.length];
};

export default function BalloonMap({ autoRefresh = true, refreshInterval = 300000 }: BalloonMapProps) {
  const [balloonData, setBalloonData] = useState<BalloonData | null>(null);
  const [weatherData, setWeatherData] = useState<Map<string, WeatherPoint>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch balloon data
      const balloonRes = await fetch('/api/balloons');
      if (!balloonRes.ok) throw new Error('Failed to fetch balloon data');
      const balloonJson = await balloonRes.json();
      setBalloonData(balloonJson);
      
      // Fetch weather data for a sample of balloon locations
      const weatherPromises: Promise<void>[] = [];
      const newWeatherData = new Map<string, WeatherPoint>();
      
      // Sample every 20th balloon to avoid rate limits
      let count = 0;
      for (const [, coordsRaw] of Object.entries(balloonJson.balloons)) {
        const coords = coordsRaw as number[][];
        if (count % 20 === 0 && coords.length > 0) {
          const lastCoord = coords[coords.length - 1];
          const lat = lastCoord[0];
          const lon = lastCoord[1];
          
          const key = `${Math.round(lat * 2) / 2},${Math.round(lon * 2) / 2}`;
          if (!newWeatherData.has(key)) {
            weatherPromises.push(
              fetch(`/api/weather?lat=${lat}&lon=${lon}`)
                .then(res => res.json())
                .then(data => {
                  newWeatherData.set(key, {
                    lat: data.lat,
                    lon: data.lon,
                    temp: data.temp,
                    wind_speed: data.wind_speed,
                    weather: data.weather
                  });
                })
                .catch(err => console.warn('Weather fetch error:', err))
            );
          }
        }
        count++;
      }
      
      await Promise.all(weatherPromises);
      setWeatherData(newWeatherData);
      setLastUpdate(new Date());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (loading && !balloonData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading balloon constellation data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching 24 hours of flight paths</p>
        </div>
      </div>
    );
  }

  if (error && !balloonData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Creative Header */}
      <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl overflow-hidden z-50">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 80%, white 1px, transparent 1px),
                              radial-gradient(circle at 40% 20%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Left Section - Branding */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="text-5xl animate-bounce" style={{ animationDuration: '3s' }}>🎈</div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
                    WindBorne
                  </h1>
                  <p className="text-sm text-indigo-100 font-medium -mt-1">Balloon Constellation Tracker</p>
                </div>
              </div>
              
              {/* Stats Cards */}
              {balloonData && (
                <div className="flex items-center space-x-3 ml-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🎈</div>
                      <div>
                        <div className="text-xs text-indigo-100 font-medium">Active Balloons</div>
                        <div className="text-2xl font-bold text-white">{balloonData.totalBalloons}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">📡</div>
                      <div>
                        <div className="text-xs text-indigo-100 font-medium">Data Sources</div>
                        <div className="text-2xl font-bold text-white">{balloonData.dataPointsCollected}/24</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🌤️</div>
                      <div>
                        <div className="text-xs text-indigo-100 font-medium">Weather Points</div>
                        <div className="text-2xl font-bold text-white">{weatherData.size}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Section - Controls */}
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="text-xs text-indigo-100">Last Updated</div>
                  <div className="text-sm font-semibold text-white">{lastUpdate.toLocaleTimeString()}</div>
                </div>
              )}
              
              {loading && (
                <div className="flex items-center bg-blue-500/30 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-blue-300/30">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  <span className="text-white font-medium">Updating...</span>
                </div>
              )}
              
              <button
                onClick={fetchData}
                disabled={loading}
                className="group relative px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center space-x-2 group-hover:text-white transition-colors duration-300">
                  <span className="text-xl">🔄</span>
                  <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Map */}
        <MapContainer
          center={[20, 0] as LatLngExpression}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Balloon flight paths */}
          {balloonData && Object.entries(balloonData.balloons).map(([balloonId, coords], index) => {
            const positions: LatLngExpression[] = coords.map(coord => [coord[0], coord[1]]);
            const color = getColorForBalloon(index);
            const lastCoord = coords[coords.length - 1];
            
            return (
              <div key={balloonId}>
                <Polyline
                  positions={positions}
                  pathOptions={{
                    color: color,
                    weight: 2,
                    opacity: 0.7
                  }}
                />
                <CircleMarker
                  center={[lastCoord[0], lastCoord[1]]}
                  radius={5}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.8
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{balloonId}</p>
                      <p>Position: {lastCoord[0].toFixed(2)}°, {lastCoord[1].toFixed(2)}°</p>
                      <p>Altitude: {lastCoord[2].toFixed(2)} km</p>
                      <p>Data points: {coords.length}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              </div>
            );
          })}
          
          {/* Weather overlays */}
          {Array.from(weatherData.entries()).map(([key, weather]) => (
            <CircleMarker
              key={key}
              center={[weather.lat, weather.lon]}
              radius={8}
              pathOptions={{
                color: '#FFD700',
                fillColor: '#FFA500',
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">Weather Data</p>
                  <p>🌡️ Temp: {weather.temp.toFixed(1)}°C</p>
                  <p>💨 Wind: {weather.wind_speed.toFixed(1)} m/s</p>
                  <p>☁️ {weather.weather.description}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* Legend - Bottom Right */}
        <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl z-50 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-indigo-900 flex items-center">
              <span className="text-xl mr-2">🗺️</span>
              Map Legend
            </h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center group hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200">
              <div className="relative mr-3">
                <div className="w-8 h-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-gray-700 font-medium">Balloon Flight Path</span>
            </div>
            <div className="flex items-center group hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200">
              <div className="relative mr-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-lg"></div>
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20"></div>
              </div>
              <span className="text-gray-700 font-medium">Current Position</span>
            </div>
            <div className="flex items-center group hover:bg-indigo-50 p-2 rounded-lg transition-all duration-200">
              <div className="relative mr-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 border-2 border-yellow-300 shadow-lg"></div>
                <div className="absolute -top-1 -right-1 text-xs">🌤️</div>
              </div>
              <span className="text-gray-700 font-medium">Weather Data</span>
            </div>
          </div>
          
          {/* Live Indicator */}
          <div className="mt-4 pt-3 border-t border-indigo-100">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Live Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

