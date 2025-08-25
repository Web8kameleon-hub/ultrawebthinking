'use client';

/**
 * LoRa Gateway Dashboard Page
 * @author Ledjan Ahmati  
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the dashboard to avoid SSR issues
const Web8LoRaDashboard = dynamic(() => import('@/components/Web8LoRaDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-purple-700">🚀 Loading LoRa Gateway...</h2>
        <p className="text-purple-600 mt-2">Initializing Web8 IoT Dashboard</p>
      </div>
    </div>
  )
});

export default function LoRaGatewayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-pulse w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-purple-700">🔄 Preparing Dashboard...</h2>
        </div>
      </div>
    }>
      <Web8LoRaDashboard />
    </Suspense>
  );
}
