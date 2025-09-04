/**
 * Safe System Stream Hook - Anti-Loop Version
 * @author Ledjan Ahmati
 * @version 8.0.0 SAFE
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface StreamData {
  timestamp: number;
  health: {
    overall: string;
    uptime: number;
    errors: number;
    warnings: number;
  };
  metrics: {
    cpu: { usage: number; cores: number; temp: number };
    memory: { used: number; total: number; free: number };
    agi: { processing: number; memory: number; operations: number };
    network: { latency: number; throughput: number; connections: number };
  };
  alerts: Array<{
    id: string;
    level: string;
    message: string;
    timestamp: number;
  }>;
  logs: Array<{
    id: string;
    level: string;
    message: string;
    timestamp: string;
    source: string;
  }>;
}

export function useSystemStreamSafe() {
  const [data, setData] = useState<StreamData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [isClient, setIsClient] = useState(false);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const mountedRef = useRef(true);

  // Client-side only
  useEffect(() => {
    setIsClient(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      if (!mountedRef.current) return;

      try {
        // Close existing connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        setConnectionState('connecting');
        setError(null);

        eventSourceRef.current = new EventSource('/api/system/stream');
        
        eventSourceRef.current.onopen = () => {
          if (!mountedRef.current) return;
          setIsConnected(true);
          setConnectionState('connected');
          setError(null);
        };

        eventSourceRef.current.onmessage = (event) => {
          if (!mountedRef.current) return;
          
          try {
            const eventData = JSON.parse(event.data);
            if (eventData.type === 'update' && eventData.data) {
              setData(eventData.data);
            } else if (eventData.type === 'initial' && eventData.data) {
              setData(eventData.data);
            }
          } catch (err) {
            console.error('Failed to parse SSE data:', err);
          }
        };

        eventSourceRef.current.onerror = () => {
          if (!mountedRef.current) return;
          
          setIsConnected(false);
          setConnectionState('disconnected');
          setError('Connection lost');
          
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          
          // Reconnect after 5 seconds
          reconnectTimeout = setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, 5000);
        };

      } catch (err) {
        if (!mountedRef.current) return;
        setError('Failed to connect');
        setIsConnected(false);
        setConnectionState('disconnected');
      }
    };

    // Initial connection
    connect();

    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      
      setIsConnected(false);
      setConnectionState('disconnected');
    };
  }, [isClient]); // Only depend on isClient

  return {
    data,
    isConnected,
    error,
    connectionState
  };
}
