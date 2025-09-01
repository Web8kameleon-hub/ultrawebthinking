import React, { useState, useEffect } from 'react';

/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

export function useBrowserData() {
  const [browserData, setBrowserData] = useState({
    userAgent: '',
    language: 'en',
    platform: '',
    cookieEnabled: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserData({
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled
      });
    }
  }, []);

  return browserData;
}

export function useRealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    timestamp: Date.now(),
    performance: {
      navigation: 0,
      memory: 0
    }
  });

  useEffect(() => {
    const updateMetrics = () => {
      if (typeof window !== 'undefined') {
        setMetrics({
          timestamp: Date.now(),
          performance: {
            navigation: performance.now(),
            memory: (performance as any).memory?.usedJSHeapSize || 0
          }
        });
      }
    };

    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
}

export const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasMounted = useClientOnly();
  
  if (!hasMounted) {
    return null;
  }

  return React.createElement(React.Fragment, null, children);
};
