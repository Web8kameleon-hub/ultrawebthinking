/**
 * Web8 Frontend AGI Hook - Lidh UI me AGI Gateway
 * React hook për komunikim real-time me AGI backend
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-FRONTEND-BRIDGE
 */

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Type definitions (copy from aggregator)
export interface AGIMetrics {
  eco: EcoData;
  energy: EnergyData;
  guardian: GuardianData;
  neural: NeuralData;
  system: SystemData;
}

export interface EcoData {
  carbonFootprint: number;
  energyEfficiency: number;
  renewablePercent: number;
  sustainabilityScore: number;
  recommendations: string[];
}

export interface EnergyData {
  totalGeneration: number;
  gridEfficiency: number;
  powerDistribution: {
    solar: number;
    wind: number;
    hydroelectric: number;
    nuclear: number;
  };
  currentLoad: number;
  peakDemand: number;
}

export interface GuardianData {
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeProtections: number;
  blockedAttacks: number;
  securityScore: number;
  recentEvents: Array<{
    type: string;
    severity: string;
    timestamp: Date;
    description: string;
  }>;
}

export interface NeuralData {
  processingSpeed: number;
  accuracy: number;
  learningRate: number;
  activeConnections: number;
  knowledgeBase: {
    totalEntries: number;
    categories: number;
    lastUpdate: Date;
  };
}

export interface SystemData {
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  responseTime: number;
}

const AGI_GATEWAY_URL = process.env.NEXT_PUBLIC_AGI_GATEWAY || 'http://localhost:4000';

/**
 * 🧠 Main AGI Hook - Për të gjitha dashboard-et
 */
export function useAGI() {
  const [metrics, setMetrics] = useState<AGIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(AGI_GATEWAY_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔗 Connected to AGI Gateway');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from AGI Gateway');
      setConnected(false);
    });

    socket.on('agi-metrics', (data: AGIMetrics) => {
      setMetrics(data);
      setLoading(false);
      setError(null);
    });

    socket.on('agi-error', (err: { error: string }) => {
      setError(err.error);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const refreshData = () => {
    if (socketRef.current) {
      socketRef.current.emit('refresh-agi');
    }
  };

  return {
    metrics,
    loading,
    error,
    connected,
    refreshData
  };
}

/**
 * 🌱 AGI×Eco Hook - Specifik për Eco dashboard
 */
export function useAGIEco() {
  const [ecoData, setEcoData] = useState<EcoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEcoData = async () => {
      try {
        const response = await fetch(`${AGI_GATEWAY_URL}/api/agi/eco`);
        const result = await response.json();
        
        if (result.success) {
          setEcoData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch eco data');
      } finally {
        setLoading(false);
      }
    };

    fetchEcoData();
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchEcoData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { ecoData, loading, error };
}

/**
 * ⚡ AGI×Energy Hook - Specifik për Energy dashboard
 */
export function useAGIEnergy() {
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await fetch(`${AGI_GATEWAY_URL}/api/agi/energy`);
        const result = await response.json();
        
        if (result.success) {
          setEnergyData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch energy data');
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
    
    // Refresh every 3 seconds for energy (more critical)
    const interval = setInterval(fetchEnergyData, 3000);
    return () => clearInterval(interval);
  }, []);

  return { energyData, loading, error };
}

/**
 * 🛡️ Guardian Hook - Specifik për Security dashboard
 */
export function useGuardian() {
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuardianData = async () => {
      try {
        const response = await fetch(`${AGI_GATEWAY_URL}/api/agi/guardian`);
        const result = await response.json();
        
        if (result.success) {
          setGuardianData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch guardian data');
      } finally {
        setLoading(false);
      }
    };

    fetchGuardianData();
    
    // Refresh every 2 seconds for security (most critical)
    const interval = setInterval(fetchGuardianData, 2000);
    return () => clearInterval(interval);
  }, []);

  return { guardianData, loading, error };
}

/**
 * 🔍 Neural Search Hook
 */
export function useNeuralSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${AGI_GATEWAY_URL}/api/agi/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      
      if (result.success) {
        setResults(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return { search, results, loading, error };
}

/**
 * 🩺 Gateway Health Hook
 */
export function useGatewayHealth() {
  const [health, setHealth] = useState<any>(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${AGI_GATEWAY_URL}/api/health`);
        const result = await response.json();
        setHealth(result);
        setOnline(true);
      } catch (err) {
        setOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return { health, online };
}
