'use client';

/**
 * Web8 Root Layout - Real Data Architecture
 * NO artificial metadata, ONLY verified runtime data
 */

import * as React from 'react';
import PerformanceMonitor from '@/components/PerformanceMonitor';
// NO metadata imports - Web8 uses real data
// import type { Metadata } from 'next'; // FORBIDDEN

interface RootLayoutProps {
  children: React.ReactNode;
}

// Web8 Dynamic Export - NO default exports
function RootLayout({ children }: RootLayoutProps) {

  return (
    <html lang="en">
      <head>
        <title>Web8 Platform - Real Data Architecture</title>
        {/* Web8 Critical CSS - NO metadata, ONLY performance */}
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #fff;
            background: #000;
            overflow-x: hidden;
          }
          .web8-accelerated {
            transform: translateZ(0);
            will-change: transform, opacity;
            backface-visibility: hidden;
          }
        `}</style>
      </head>
      <body className="web8-accelerated" suppressHydrationWarning={true}>
        {/* Web8 Pure Children - NO artificial providers */}
        {children}

        {/* Web8 Performance Monitor - Global System Monitoring */}
        <React.Suspense fallback={null}>
          <PerformanceMonitor />
        </React.Suspense>
      </body>
    </html>
  );
}

// Web8 Dynamic Export - NO default exports (Named export)
export { RootLayout };

// Next.js App Router compatibility requirement
export default RootLayout;
