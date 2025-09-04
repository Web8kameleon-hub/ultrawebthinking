/**
 * EuroWeb AGI Real-Time Data Hook
 * React hook for consuming live AGI data via WebSocket and REST API
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 Real-Time Production
 * @contact dealsjona@gmail.com
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Type definitions
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

interface AGIAnalytics {
  timestamp: number;
  modules: AGIModuleActivity[];
  globalMetrics: {
    totalOperations: number;
    systemLoad: number;
    networkHealth: number;
    securityLevel: number;
    ethicalCompliance: number;
  };
  statistics: {
    hourlyStats: Record<string, number>;
    dailyStats: Record<string, number>;
    trends: Array<{
      metric: string;
      trend: 'increasing' | 'decreasing' | 'stable';
      change: number;
    }>;
  };
  predictions: {
    nextHourLoad: number;
    riskAssessment: 'low' | 'medium' | 'high';
    recommendations: string[];
  };
}

interface EthicalCompliance {
  timestamp: number;
  ethicalCompliance: {
    status: string;
    n7Controller: {
      activity: number;
      pulseRate: number;
      flickering: number;
      status: string;
    };
    violations: boolean;
    safeThinkActive: boolean;
    activeNodes: number;
    alerts: number;
  };
  recommendations: string[];
  strictMode: {
    flickeringThreshold: number;
    maxPulseRate: number;
    safeThinkDuration: number;
    monitoringInterval: number;
  };
}

interface UseAGIRealTimeOptions {
  apiUrl?: string;
  websocketUrl?: string;
  autoConnect?: boolean;
  modules?: string[];
  pollInterval?: number;
}

interface UseAGIRealTimeReturn {
  // Data
  activities: AGIModuleActivity[];
  analytics: AGIAnalytics | null;
  ethics: EthicalCompliance | null;
  statistics: Record<string, any>;
  
  // Connection status
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Controls
  connect: () => void;
  disconnect: () => void;
  subscribe: (modules: string[]) => void;
  unsubscribe: () => void;
  refreshData: () => Promise<void>;
  
  // Specific data getters
  getModuleActivity: (moduleId: string) => AGIModuleActivity | undefined;
  getGlobalMetrics: () => any;
  getSystemHealth: () => number;
  
  // Live HTTP functions
  performNeuralSearch: (query: string) => Promise<any>;
  askOpenMind: (query: string) => Promise<any>;
  getLiveData: (endpoint: string) => Promise<any>;
}

const DEFAULT_OPTIONS: UseAGIRealTimeOptions = {
  apiUrl: 'http://localhost:4000/api',
  websocketUrl: 'http://localhost:4000',
  autoConnect: true,
  modules: [],
  pollInterval: 30000
};

export function useAGIRealTime(options: UseAGIRealTimeOptions = {}): UseAGIRealTimeReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // State
  const [activities, setActivities] = useState<AGIModuleActivity[]>([]);
  const [analytics, setAnalytics] = useState<AGIAnalytics | null>(null);
  const [ethics, setEthics] = useState<EthicalCompliance | null>(null);
  const [statistics, setStatistics] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const socketRef = useRef<Socket | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WebSocket connection
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;
    
    console.log('🔌 Connecting to AGI Real-Time Server...');
    
    const socket = io(opts.websocketUrl!, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 3000,
      timeout: 30000,
      forceNew: false,
      upgrade: true,
      autoConnect: true
    });
    
    socket.on('connect', () => {
      console.log('✅ Connected to AGI Real-Time Server');
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      
      // Subscribe to modules if specified
      if (opts.modules && opts.modules.length > 0) {
        socket.emit('subscribe', opts.modules);
        console.log('📡 Subscribed to modules:', opts.modules);
      } else {
        socket.emit('subscribe', ['all']);
        console.log('📡 Subscribed to all modules');
      }
    });
    
    socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from AGI Real-Time Server, reason:', reason);
      setIsConnected(false);
      
      // Clear any existing heartbeat intervals
      const intervals = (socket as any).heartbeatIntervals || [];
      intervals.forEach((interval: NodeJS.Timeout) => clearInterval(interval));
      
      // Auto-reconnect based on disconnect reason
      if (reason === 'transport close' || reason === 'transport error') {
        console.log('🔄 Transport issue - reconnecting in 2 seconds...');
        setTimeout(() => {
          if (!socketRef.current?.connected) {
            connect();
          }
        }, 2000);
      } else if (reason === 'ping timeout') {
        console.log('🔄 Ping timeout - reconnecting immediately...');
        setTimeout(() => {
          if (!socketRef.current?.connected) {
            connect();
          }
        }, 1000);
      } else if (reason !== 'io client disconnect') {
        console.log('🔄 Attempting to reconnect in 3 seconds...');
        setTimeout(() => {
          if (!socketRef.current?.connected) {
            connect();
          }
        }, 3000);
      }
    });
    
    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setError(null);
    });
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt', attemptNumber);
    });
    
    socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });
    
    socket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err);
      setError(`Connection failed: ${err.message}`);
      setIsConnected(false);
    });
    
    // Real-time data handlers
    socket.on('moduleActivity', (data: AGIModuleActivity[]) => {
      console.log('📊 Received moduleActivity:', data?.length || 0, 'modules');
      if (Array.isArray(data)) {
        setActivities(data);
      }
      setIsLoading(false);
    });
    
    socket.on('analytics', (data: AGIAnalytics) => {
      console.log('📈 Received analytics:', data ? 'Data received' : 'No data');
      if (data) {
        setAnalytics(data);
      }
    });
    
    socket.on('ethicalCompliance', (data: EthicalCompliance) => {
      console.log('🛡️ Received ethical compliance:', data ? 'Data received' : 'No data');
      if (data) {
        setEthics(data);
      }
    });
    
    socket.on('statistics', (data: Record<string, any>) => {
      console.log('📋 Received statistics:', Object.keys(data || {}).length, 'entries');
      if (data) {
        setStatistics(data);
      }
    });
    
    // Keep alive heartbeat
    socket.on('pong', () => {
      console.log('💓 Heartbeat pong received');
    });
    
    socketRef.current = socket;
    
    // Keep alive heartbeat with improved management
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping', { timestamp: Date.now() });
        console.log('💓 Heartbeat ping sent');
      }
    }, 15000); // Send ping every 15 seconds
    
    // Store heartbeat interval for cleanup
    (socket as any).heartbeatIntervals = [(socket as any).heartbeatIntervals || [], heartbeatInterval].flat();
    
    // Add visibility change handler to maintain connection
    const handleVisibilityChange = () => {
      if (!document.hidden && socket.connected) {
        console.log('👁️ Page visible - sending keep-alive ping');
        socket.emit('ping', { timestamp: Date.now(), type: 'visibility' });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Store cleanup function
    (socket as any).cleanup = () => {
      const intervals = (socket as any).heartbeatIntervals || [];
      intervals.forEach((interval: NodeJS.Timeout) => clearInterval(interval));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [opts.websocketUrl, opts.modules]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting from AGI Real-Time Server...');
      
      // Clean up heartbeat and event listeners
      if ((socketRef.current as any).cleanup) {
        (socketRef.current as any).cleanup();
      }
      
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
    
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const subscribe = useCallback((modules: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribe', modules);
      console.log('📡 Subscribed to modules:', modules);
    }
  }, []);

  const unsubscribe = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe');
      console.log('📴 Unsubscribed from real-time updates');
    }
  }, []);

  // REST API fallback
  const fetchData = useCallback(async (endpoint: string) => {
    try {
      const response = await fetch(`${opts.apiUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error(`❌ Failed to fetch ${endpoint}:`, err);
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  }, [opts.apiUrl]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [activitiesData, analyticsData, ethicsData, statisticsData] = await Promise.all([
        fetchData('/agi/activities'),
        fetchData('/agi/analytics'),
        fetchData('/agi/ethics'),
        fetchData('/agi/statistics')
      ]);
      
      if (activitiesData) setActivities(activitiesData);
      if (analyticsData) setAnalytics(analyticsData);
      if (ethicsData) setEthics(ethicsData);
      if (statisticsData) setStatistics(statisticsData);
      
    } catch (err) {
      console.error('❌ Failed to refresh data:', err);
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  // Helper functions
  const getModuleActivity = useCallback((moduleId: string): AGIModuleActivity | undefined => {
    return activities.find(activity => activity.moduleId === moduleId);
  }, [activities]);

  const getGlobalMetrics = useCallback(() => {
    return analytics?.globalMetrics || null;
  }, [analytics]);

  const getSystemHealth = useCallback((): number => {
    if (!analytics) return 0;
    
    const { systemLoad, networkHealth, securityLevel, ethicalCompliance } = analytics.globalMetrics;
    return Math.floor((networkHealth + securityLevel + ethicalCompliance + (100 - systemLoad)) / 4);
  }, [analytics]);

  // Live HTTP API functions
  const performNeuralSearch = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/neural-search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.log('🧠 Neural Search Response:', data);
      return data;
    } catch (error) {
      console.error('Neural Search Error:', error);
      return { error: 'Neural search failed' };
    }
  }, []);

  const askOpenMind = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/openmind-live?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.log('🎯 OpenMind Response:', data);
      return data;
    } catch (error) {
      console.error('OpenMind Error:', error);
      return { error: 'OpenMind request failed' };
    }
  }, []);

  const getLiveData = useCallback(async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.log(`📡 Live Data (${endpoint}):`, data);
      return data;
    } catch (error) {
      console.error(`Live Data Error (${endpoint}):`, error);
      return { error: `Failed to fetch ${endpoint}` };
    }
  }, []);

  // Effects
  useEffect(() => {
    if (opts.autoConnect) {
      connect();
    }
    
    // Fallback polling for when WebSocket is not available
    if (!isConnected && opts.pollInterval) {
      pollIntervalRef.current = setInterval(refreshData, opts.pollInterval);
    }
    
    return () => {
      disconnect();
    };
  }, [opts.autoConnect, opts.pollInterval, connect, disconnect, refreshData, isConnected]);

  // Initial data fetch
  useEffect(() => {
    if (!isConnected) {
      refreshData();
    }
  }, [isConnected, refreshData]);

  return {
    // Data
    activities,
    analytics,
    ethics,
    statistics,
    
    // Connection status
    isConnected,
    isLoading,
    error,
    
    // Controls
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    refreshData,
    
    // Helper functions
    getModuleActivity,
    getGlobalMetrics,
    getSystemHealth,
    
    // Live HTTP functions
    performNeuralSearch,
    askOpenMind,
    getLiveData
  };
}

export type {
  AGIModuleActivity,
  AGIAnalytics,
  EthicalCompliance,
  UseAGIRealTimeOptions,
  UseAGIRealTimeReturn
};
