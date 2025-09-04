/**
 * Lightweight System Stream Hook
 * Optimized for performance
 */

import { useEffect, useRef, useState } from 'react';

interface LightMetrics {
  timestamp: number;
  cpu: number;
  memory: number;
  agi: number;
  network: number;
}

export function useLightSystemStream() {
  const [data, setData] = useState<LightMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const connect = () => {
      try {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        eventSourceRef.current = new EventSource('/api/system/stream-light');
        
        eventSourceRef.current.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        eventSourceRef.current.onmessage = (event) => {
          try {
            const newData = JSON.parse(event.data);
            setData(newData);
          } catch (err) {
            console.error('Failed to parse SSE data:', err);
          }
        };

        eventSourceRef.current.onerror = () => {
          setIsConnected(false);
          setError('Connection lost');
          
          // Auto-reconnect after 5 seconds
          setTimeout(connect, 5000);
        };

      } catch {
        setError('Failed to connect');
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isClient]);

  return { data, isConnected, error };
}
