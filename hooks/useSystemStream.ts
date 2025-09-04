/**
 * EuroWeb Ultra - System Stream Hook
 * Real-Time Data Hook with SSE
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 ULTRA-DIAMANT
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  uptime: number;
  errors: number;
  warnings: number;
}

interface SystemMetrics {
  cpu: { usage: number; cores: number; temp: number };
  memory: { used: number; total: number; free: number };
  network: { latency: number; throughput: number; connections: number };
  agi: { processing: number; memory: number; operations: number };
}

interface SystemAlert {
  id: string;
  level: 'warn' | 'critical';
  message: string;
  timestamp: number;
}

interface SystemSnapshot {
  timestamp: number;
  version: string;
  health: SystemHealth;
  metrics: SystemMetrics;
  alerts: SystemAlert[];
  diff?: any;
}

interface StreamState {
  connected: boolean;
  loading: boolean;
  error: string | null;
  data: SystemSnapshot | null;
  lastUpdate: number;
  reconnectCount: number;
}

interface UseSystemStreamOptions {
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  onAlert?: (alert: SystemAlert) => void;
  onCritical?: (data: SystemSnapshot) => void;
}

export function useSystemStream(options: UseSystemStreamOptions = {}) {
  const {
    autoReconnect = true,
    maxReconnectAttempts = 10,
    reconnectDelay = 2000,
    onAlert,
    onCritical
  } = options;

  const [state, setState] = useState<StreamState>({
    connected: false,
    loading: true,
    error: null,
    data: null,
    lastUpdate: 0,
    reconnectCount: 0
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const alertHistory = useRef<Set<string>>(new Set());

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const eventSource = new EventSource('/api/system/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setState(prev => ({
          ...prev,
          connected: true,
          loading: false,
          error: null,
          reconnectCount: 0
        }));
      };

      eventSource.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          switch (message.type) {
            case 'connected':
              // Initial connection established
              break;
              
            case 'initial-state':
            case 'system-update':
              const data = message.data as SystemSnapshot;
              
              setState(prev => ({
                ...prev,
                data,
                lastUpdate: Date.now()
              }));

              // Handle alerts
              if (data.alerts?.length > 0) {
                data.alerts.forEach(alert => {
                  if (!alertHistory.current.has(alert.id)) {
                    alertHistory.current.add(alert.id);
                    onAlert?.(alert);
                  }
                });
              }

              // Handle critical states
              if (data.health.overall === 'critical' || 
                  data.metrics.agi.processing > 90) {
                onCritical?.(data);
              }
              
              break;
              
            case 'error':
              setState(prev => ({
                ...prev,
                error: message.data.message
              }));
              break;
          }
        } catch (parseError) {
          console.error('Failed to parse SSE message:', parseError);
        }
      };

      eventSource.onerror = () => {
        setState(prev => ({
          ...prev,
          connected: false,
          loading: false,
          error: 'Connection lost'
        }));

        eventSource.close();
        
        // Auto-reconnect logic
        if (autoReconnect && state.reconnectCount < maxReconnectAttempts) {
          const delay = reconnectDelay * Math.pow(1.5, state.reconnectCount); // Exponential backoff
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setState(prev => ({
              ...prev,
              reconnectCount: prev.reconnectCount + 1
            }));
            connect();
          }, delay);
        }
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        connected: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to connect'
      }));
    }
  }, [autoReconnect, maxReconnectAttempts, reconnectDelay, onAlert, onCritical]); // Removed state.reconnectCount to prevent infinite loop

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setState(prev => ({
      ...prev,
      connected: false,
      loading: false
    }));
  }, []);

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, reconnectCount: 0 }));
    connect();
  }, [connect]);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []); // Empty dependency array to prevent infinite loop

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // AGI Actions
  const agiActions = {
    throttle: useCallback(async (percentage: number = 10) => {
      try {
        const response = await fetch('/api/agi/throttle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ throttle: percentage })
        });
        return response.ok;
      } catch {
        return false;
      }
    }, []),

    boost: useCallback(async () => {
      try {
        const response = await fetch('/api/agi/boost', {
          method: 'POST'
        });
        return response.ok;
      } catch {
        return false;
      }
    }, []),

    resetJobs: useCallback(async () => {
      try {
        const response = await fetch('/api/agi/reset-jobs', {
          method: 'POST'
        });
        return response.ok;
      } catch {
        return false;
      }
    }, [])
  };

  return {
    // State
    ...state,
    
    // Data helpers
    isHealthy: state.data?.health.overall === 'excellent' || state.data?.health.overall === 'good',
    isCritical: state.data?.health.overall === 'critical',
    agiProcessing: state.data?.metrics.agi.processing || 0,
    cpuUsage: state.data?.metrics.cpu.usage || 0,
    memoryUsage: state.data?.metrics.memory.used || 0,
    networkLatency: state.data?.metrics.network.latency || 0,
    
    // Actions
    connect,
    disconnect,
    retry,
    
    // AGI Controls
    ...agiActions,
    
    // Status helpers
    canReconnect: autoReconnect && state.reconnectCount < maxReconnectAttempts,
    nextReconnectIn: reconnectTimeoutRef.current ? reconnectDelay * Math.pow(1.5, state.reconnectCount) : 0
  };
}
