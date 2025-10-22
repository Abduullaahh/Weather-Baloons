'use client';

import dynamic from 'next/dynamic';

// Import map component dynamically to avoid SSR issues with Leaflet
const BalloonMap = dynamic(
  () => import('./components/BalloonMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Initializing map...</p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  return (
    <main className="w-full h-screen">
      <BalloonMap autoRefresh={true} refreshInterval={300000} />
    </main>
  );
}
