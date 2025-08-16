/**
 * Web8 Frontend AGI Hook - Lidh UI me AGI Gateway
 * React hook për komunikim real-time me AGI backend
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-FRONTEND-BRIDGE
 */

'use client';
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

const AGI_GATEWAY_URL = '/api/gateway'; // Use unified gateway

/**
 * 🧠 Main AGI Hook - Unified Gateway Version
 */
export function useAGI() {
  const [metrics, setMetrics] = useState<AGIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const callGateway = async (module: string, payload?: any) => {
    try {
      const response = await fetch(AGI_GATEWAY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ module, payload })
      });

      if (!response.ok) {
        throw new Error(`Gateway error: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      throw new Error(err.message || 'Gateway request failed');
    }
  };

  useEffect(() => {
    const fetchAllMetrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all module data in parallel
        const [eco, energy, guardian, neural, system] = await Promise.all([
          callGateway('eco'),
          callGateway('el'), // Energy/Electric
          callGateway('guardian'),
          callGateway('neural'),
          callGateway('realtime')
        ]);

        // Combine into metrics structure
        const combinedMetrics: AGIMetrics = {
          eco: eco || {
            carbonFootprint: 0,
            energyEfficiency: 0,
            renewablePercent: 0,
            sustainabilityScore: 0,
            recommendations: []
          },
          energy: energy || {
            totalGeneration: 0,
            gridEfficiency: 0,
            powerDistribution: { solar: 0, wind: 0, hydroelectric: 0, nuclear: 0 },
            currentLoad: 0,
            peakDemand: 0
          },
          guardian: guardian || {
            threatLevel: 'LOW' as const,
            activeProtections: 0,
            blockedAttacks: 0,
            securityScore: 0,
            recentEvents: []
          },
          neural: neural || {
            processingSpeed: 0,
            accuracy: 0,
            learningRate: 0,
            activeConnections: 0,
            knowledgeBase: { totalEntries: 0, categories: 0, lastUpdate: new Date() }
          },
          system: system || {
            uptime: 0,
            cpuUsage: 0,
            memoryUsage: 0,
            networkLatency: 0,
            responseTime: 0
          }
        };

        setMetrics(combinedMetrics);
        setConnected(true);
      } catch (err: any) {
        setError(err.message);
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMetrics();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchAllMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setLoading(true);
    // Trigger useEffect refresh by updating a dependency
  };

  return {
    metrics,
    loading,
    error,
    connected,
    refreshData,
    callGateway // Expose for individual module calls
  };
}

/**
 * 🌱 AGIEco Hook - Uses unified gateway
 */
export function useAGIEco() {
  const [ecoData, setEcoData] = useState<EcoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEcoData = async () => {
      try {
        const response = await fetch(AGI_GATEWAY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'eco' })
        });
        
        const result = await response.json();
        
        if (result.ok) {
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
 * ⚡ AGI×Energy Hook - Uses unified gateway
 */
export function useAGIEnergy() {
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await fetch(AGI_GATEWAY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'el' })
        });
        
        const result = await response.json();
        
        if (result.ok) {
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
 * 🛡️ Guardian Hook - Uses unified gateway
 */
export function useGuardian() {
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuardianData = async () => {
      try {
        const response = await fetch(AGI_GATEWAY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module: 'guardian' })
        });
        
        const result = await response.json();
        
        if (result.ok) {
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

