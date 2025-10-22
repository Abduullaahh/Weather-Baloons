import { NextResponse } from 'next/server';

interface BalloonData {
  id: string;
  coordinates: number[][];
  hour: number;
}

interface ParsedBalloonData {
  balloons: Map<string, number[][]>;
}

// In-memory cache
let cachedData: { data: ParsedBalloonData; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchBalloonFile(hour: number): Promise<number[][] | null> {
  try {
    const hourStr = hour.toString().padStart(2, '0');
    const url = `https://a.windbornesystems.com/treasure/${hourStr}.json`;
    
    const response = await fetch(url, { 
      next: { revalidate: 300 }, // Cache for 5 minutes
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${hourStr}.json: ${response.status}`);
      return null;
    }
    
    const text = await response.text();
    
    // Fault-tolerant parsing
    try {
      const data = JSON.parse(text);
      
      // Validate that it's an array
      if (!Array.isArray(data)) {
        console.warn(`Invalid data format in ${hourStr}.json: not an array`);
        return null;
      }
      
      // Filter valid coordinates [lat, lon, value]
      const validCoords = data.filter((coord: any) => {
        return Array.isArray(coord) && 
               coord.length === 3 && 
               typeof coord[0] === 'number' && 
               typeof coord[1] === 'number' && 
               typeof coord[2] === 'number' &&
               coord[0] >= -90 && coord[0] <= 90 && // valid latitude
               coord[1] >= -180 && coord[1] <= 180; // valid longitude
      });
      
      return validCoords;
    } catch (parseError) {
      // Try to repair common JSON issues
      const repaired = text
        .replace(/,\s*]/g, ']') // Remove trailing commas
        .replace(/,\s*}/g, '}')
        .replace(/\n/g, ' ')
        .trim();
      
      try {
        const data = JSON.parse(repaired);
        if (Array.isArray(data)) {
          return data.filter((coord: any) => 
            Array.isArray(coord) && coord.length === 3
          );
        }
      } catch {
        console.warn(`Unable to parse ${hourStr}.json after repair attempt`);
      }
      
      return null;
    }
  } catch (error) {
    console.warn(`Error fetching hour ${hour}:`, error);
    return null;
  }
}

function groupBalloonsByTrajectory(allCoordinates: number[][][]): Map<string, number[][]> {
  const balloons = new Map<string, number[][]>();
  
  // More sophisticated approach: Track balloons across hours
  // Each coordinate in the first hour represents a potential balloon
  const firstHourData = allCoordinates[0];
  if (!firstHourData || firstHourData.length === 0) {
    return balloons;
  }
  
  // Initialize balloons from the first hour
  firstHourData.forEach((coord, idx) => {
    const balloonId = `balloon_${idx}`;
    balloons.set(balloonId, [[
      coord[0], // latitude
      coord[1], // longitude
      coord[2], // altitude/value
      0 // hour index
    ]]);
  });
  
  // Try to match subsequent hours to existing balloons
  for (let hourIndex = 1; hourIndex < allCoordinates.length; hourIndex++) {
    const hourData = allCoordinates[hourIndex];
    if (!hourData) continue;
    
    // For each balloon, find the closest coordinate in the next hour
    balloons.forEach((balloonCoords, balloonId) => {
      const lastCoord = balloonCoords[balloonCoords.length - 1];
      const lastLat = lastCoord[0];
      const lastLon = lastCoord[1];
      
      // Find closest coordinate in current hour
      let closestCoord = null;
      let closestDistance = Infinity;
      let closestIndex = -1;
      
      hourData.forEach((coord, idx) => {
        const distance = Math.sqrt(
          Math.pow(coord[0] - lastLat, 2) + Math.pow(coord[1] - lastLon, 2)
        );
        if (distance < closestDistance && distance < 50) { // Max 50 degrees distance
          closestDistance = distance;
          closestCoord = coord;
          closestIndex = idx;
        }
      });
      
      if (closestCoord) {
        balloonCoords.push([
          closestCoord[0],
          closestCoord[1],
          closestCoord[2],
          hourIndex
        ]);
        
        // Remove the matched coordinate from hourData to avoid duplicates
        hourData.splice(closestIndex, 1);
      }
    });
    
    // Add any remaining unmatched coordinates as new balloons
    hourData.forEach((coord, idx) => {
      const balloonId = `balloon_new_${hourIndex}_${idx}`;
      balloons.set(balloonId, [[
        coord[0],
        coord[1],
        coord[2],
        hourIndex
      ]]);
    });
  }
  
  // Filter out balloons with only one data point
  const filteredBalloons = new Map<string, number[][]>();
  balloons.forEach((coords, id) => {
    if (coords.length >= 2) {
      filteredBalloons.set(id, coords);
    }
  });
  
  return filteredBalloons;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    // Check cache (unless force refresh)
    if (!forceRefresh && cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedData.data,
        cached: true,
        cacheAge: Math.floor((Date.now() - cachedData.timestamp) / 1000)
      });
    }
    
    // Fetch all 24 hours in parallel
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const fetchPromises = hours.map(hour => fetchBalloonFile(hour));
    
    const results = await Promise.all(fetchPromises);
    
    // Group coordinates by balloon trajectory
    const balloons = groupBalloonsByTrajectory(results as number[][][]);
    
    // Convert Map to object for JSON serialization
    const balloonsObj: { [key: string]: number[][] } = {};
    balloons.forEach((coords, id) => {
      // Only include balloons with at least 2 data points
      if (coords.length >= 2) {
        balloonsObj[id] = coords;
      }
    });
    
    const responseData: ParsedBalloonData = {
      balloons: balloons
    };
    
    // Update cache
    cachedData = {
      data: responseData,
      timestamp: Date.now()
    };
    
    return NextResponse.json({
      balloons: balloonsObj,
      totalBalloons: Object.keys(balloonsObj).length,
      dataPointsCollected: results.filter(r => r !== null).length,
      cached: false,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching balloon data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balloon data', details: String(error) },
      { status: 500 }
    );
  }
}

