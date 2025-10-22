import { NextResponse } from 'next/server';

interface WeatherData {
  lat: number;
  lon: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

// In-memory cache for weather data
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for weather data

// OpenWeatherMap API (free tier allows 1000 calls/day)
// For production, you'd use env variables, but for the demo we'll use a note
const API_KEY =  'demo'; // User needs to provide their own key

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lon = parseFloat(searchParams.get('lon') || '0');
    
    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }
    
    // Round coordinates to reduce cache misses
    const roundedLat = Math.round(lat * 10) / 10;
    const roundedLon = Math.round(lon * 10) / 10;
    const cacheKey = `${roundedLat},${roundedLon}`;
    
    // Check cache
    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cached.timestamp) / 1000)
      });
    }
    
    // If demo mode (no API key), return mock data
    if (API_KEY === 'demo') {
      const mockData: WeatherData = {
        lat: roundedLat,
        lon: roundedLon,
        temp: 15 + Math.random() * 15,
        feels_like: 15 + Math.random() * 15,
        pressure: 1013 + Math.random() * 20,
        humidity: 50 + Math.random() * 30,
        wind_speed: Math.random() * 10,
        wind_deg: Math.random() * 360,
        clouds: Math.random() * 100,
        weather: {
          main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
          description: 'simulated weather data',
          icon: '01d'
        }
      };
      
      weatherCache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      
      return NextResponse.json({
        ...mockData,
        cached: false,
        demo: true,
        note: 'Using simulated weather data. Set OPENWEATHER_API_KEY environment variable for real data.'
      });
    }
    
    // Fetch real weather data
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${roundedLat}&lon=${roundedLon}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const weatherData: WeatherData = {
      lat: data.coord.lat,
      lon: data.coord.lon,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      clouds: data.clouds.all,
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      }
    };
    
    // Update cache
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
    
    return NextResponse.json({
      ...weatherData,
      cached: false
    });
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: String(error) },
      { status: 500 }
    );
  }
}

