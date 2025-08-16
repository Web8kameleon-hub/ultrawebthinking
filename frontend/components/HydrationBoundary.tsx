/**
 * Hydration Boundary Component
 * Prevents hydration mismatches by ensuring client-only rendering for dynamic content
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-Web8
 */

'use client';

import React, { useState, useEffect } from 'react';

interface HydrationBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * HydrationBoundary - Prevents hydration mismatches
 * Only renders children after hydration is complete
 */
export default function HydrationBoundary({ 
  children, 
  fallback = null, 
  className,
  style 
}: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect only runs on the client side
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // During SSR and before hydration, show fallback or nothing
    return fallback ? (
      <div className={className} style={style}>
        {fallback}
      </div>
    ) : null;
  }

  // After hydration, render the actual content
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * Hook for checking hydration status
 */
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Client-only wrapper component
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <HydrationBoundary fallback={fallback}>
      {children}
    </HydrationBoundary>
  );
}
