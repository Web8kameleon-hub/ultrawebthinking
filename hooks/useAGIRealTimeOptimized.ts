/**
 * Optimized AGI Real-Time Hook - Reduced Memory Usage
 * @author Ledjan Ahmati
 * @version 8.0.0-OPTIMIZED
 * @contact dealsjona@gmail.com
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface AGIModuleActivity {
  moduleId: string;
  moduleName: string;
  status: 'active' | 'processing' | 'idle' | 'error' | 'safethink';
  activity: number;
  processingSpeed: number;
  memoryUsage: number;
  cpuUsage: number;
  networkTraffic: number;
  errors: number;
  warnings: number;
  lastUpdate: number;
  performance: {
    responseTime: number;
    throughput: number;
    efficiency: number;
  };
}

interface UseAGIRealTimeReturn {
  activities: AGIModuleActivity[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  refreshData: () => Promise<void>;
}

export const useAGIRealTimeOptimized = (options: {
  autoConnect?: boolean;
  maxRetries?: number;
} = {}): UseAGIRealTimeReturn => {
  const { autoConnect = true, maxRetries = 3 } = options;
  
  const [activities, setActivities] = useState<AGIModuleActivity[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;
    
    cleanup();
    
    try {
      socketRef.current = io('http://localhost:4000', {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: maxRetries,
        reconnectionDelay: 2000
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('✅ AGI Connected successfully');
        setIsConnected(true);
        setError(null);
        setIsLoading(false);
        retryCountRef.current = 0;
      });

      socket.on('connect_error', (err) => {
        console.error('❌ AGI Connection error:', err.message);
        setError(`Connection failed: ${err.message}`);
        setIsConnected(false);
        setIsLoading(false);
        
        retryCountRef.current++;
        if (retryCountRef.current < maxRetries) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`🔄 Retrying connection (${retryCountRef.current}/${maxRetries})...`);
            connect();
          }, 3000);
        } else {
          console.log('❌ Max retry attempts reached');
          setError('Max connection attempts reached. Please check AGI backend.');
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 AGI Disconnected:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          setTimeout(connect, 2000);
        }
      });

      socket.on('moduleActivity', (data: AGIModuleActivity[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Only update if data actually changed to reduce re-renders
          setActivities(prevData => {
            const hasChanged = JSON.stringify(prevData) !== JSON.stringify(data);
            return hasChanged ? data : prevData;
          });
        }
        setIsLoading(false);
      });

    } catch (error) {
      console.error('❌ Socket initialization error:', error);
      setError('Failed to initialize connection');
      setIsConnected(false);
      setIsLoading(false);
    }
  }, [maxRetries, cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setIsConnected(false);
    setActivities([]);
    setError(null);
  }, [cleanup]);

  const refreshData = useCallback(async () => {
    if (!socketRef.current?.connected) {
      await new Promise<void>((resolve) => {
        if (socketRef.current?.connected) {
          resolve();
        } else {
          connect();
          const checkConnection = () => {
            if (socketRef.current?.connected) {
              resolve();
            } else {
              setTimeout(checkConnection, 100);
            }
          };
          checkConnection();
        }
      });
    }
    
    // Request fresh data
    socketRef.current?.emit('requestUpdate');
  }, [connect]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [autoConnect, connect, cleanup]);

  return {
    activities,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    refreshData
  };
};

export default useAGIRealTimeOptimized;
