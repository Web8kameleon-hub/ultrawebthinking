'use client';

import React, { lazy, Suspense } from 'react';

// Simple loading component
const SimpleLoader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <span className="ml-4 text-blue-500">Loading EuroWeb Platform...</span>
  </div>
);

// Lazy load major components that exist
const Web8TabSystem = lazy(() => import('./Web8TabSystem'));
const ALBSecurityDashboard = lazy(() => import('./ALBSecurityDashboard'));
const UTTDashboard = lazy(() => import('./UTTDashboard'));
const LoRaPhysicalDashboard = lazy(() => import('./LoRaPhysicalDashboard'));
const EuroMeshDashboard = lazy(() => import('./EuroMeshDashboard'));

interface EuroWebMainPlatformProps {
  initialTab?: string;
}

const EuroWebMainPlatform: React.FC<EuroWebMainPlatformProps> = ({ 
  initialTab = 'web8' 
}) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto h-full">
        <Suspense fallback={<SimpleLoader />}>
          <Web8TabSystem />
        </Suspense>
      </div>
    </div>
  );
};

export default EuroWebMainPlatform;
