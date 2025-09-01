/**
 * Web8 12-Layer Dashboard - Real-time AGI System Monitor
 * Monorepo component using LazyLoader and tsconfig paths
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LazyLoader } from '@components/LazyLoader';

interface Web8LayerStatus {
  id: string;
  name: string;
  workers: number;
  status: 'active' | 'inactive' | 'processing';
  load: number;
}

interface Web8SystemData {
  web8Status: string;
  layers: number;
  agiCore: {
    initialized: boolean;
    totalLayers: number;
    activeLayers: number;
    averageLoad: number;
    totalConnections: number;
    processingSpeed: number;
    uptime: number;
  };
  lightningPool: string;
  timestamp: string;
}

export default function Web812LayerDashboard() {
  const [systemData, setSystemData] = useState<Web8SystemData | null>(null);
  const [layerData, setLayerData] = useState<Web8LayerStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const layerDefinitions = [
    { id: 'agi_core', name: '🧠 AGI Core', workers: 3 },
    { id: 'realtime', name: '⚡ Real-time', workers: 3 },
    { id: 'neural', name: '🔗 Neural', workers: 2 },
    { id: 'analytics', name: '📊 Analytics', workers: 1 },
    { id: 'security', name: '🛡️ Security', workers: 1 },
    { id: 'communication', name: '📡 Communication', workers: 1 },
    { id: 'storage', name: '💾 Storage', workers: 1 },
    { id: 'integration', name: '🔄 Integration', workers: 1 },
    { id: 'optimization', name: '⚙️ Optimization', workers: 1 },
    { id: 'monitoring', name: '📈 Monitoring', workers: 1 },
    { id: 'backup', name: '💿 Backup', workers: 1 },
    { id: 'lightning', name: '⚡ Lightning', workers: 4 }
  ];

  const fetchWeb8Status = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000');
      if (!response.ok) throw new Error('Backend not available');
      
      const data = await response.json();
      setSystemData(data);
      
      // Generate layer status from definitions
      const layers = layerDefinitions.map((def, index) => ({
        id: def.id,
        name: def.name,
        workers: def.workers,
        status: (index < 8 ? 'active' : 0.5 > 0.3 ? 'active' : 'processing') as 'active' | 'inactive' | 'processing',
        load: Math.floor(0.5 * 80) + 20
      }));
      
      setLayerData(layers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeb8Status();
    const interval = setInterval(fetchWeb8Status, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        color: 'white'
      } as any}>
        <div>🔄 Loading Web8 12-Layer System...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        color: '#ff6b6b',
        textAlign: 'center',
        border: '1px solid #ff6b6b',
        borderRadius: '8px',
        margin: '20px'
      } as any}>
        <h3>⚠️ Connection Error</h3>
        <p>{error}</p>
        <button 
          onClick={fetchWeb8Status}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4dabf7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          } as any}
        >
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '20px',
        color: 'white'
      } as any}
    >
      {/* System Status Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      } as any}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem' } as any}>
            🚀 Web8 12-Layer System
          </h2>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 } as any}>
            Status: <span style={{ color: '#4ade80', fontWeight: 'bold' } as any}>
              {systemData?.web8Status || 'UNKNOWN'}
            </span>
          </p>
        </div>
        <div style={{ textAlign: 'right' } as any}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' } as any}>
            {systemData?.layers || 0}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7 } as any}>
            Active Layers
          </div>
        </div>
      </div>

      {/* AGI Core Metrics */}
      {systemData?.agiCore && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        } as any}>
          <div style={{
            padding: '15px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '8px',
            textAlign: 'center'
          } as any}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' } as any}>
              {systemData.agiCore.totalConnections}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 } as any}>Neural Connections</div>
          </div>
          <div style={{
            padding: '15px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '8px',
            textAlign: 'center'
          } as any}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' } as any}>
              {systemData.agiCore.processingSpeed} THz
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 } as any}>Processing Speed</div>
          </div>
          <div style={{
            padding: '15px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '8px',
            textAlign: 'center'
          } as any}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' } as any}>
              {Math.round(systemData.agiCore.averageLoad)}%
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 } as any}>Average Load</div>
          </div>
          <div style={{
            padding: '15px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '8px',
            textAlign: 'center'
          } as any}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' } as any}>
              {Math.floor(systemData.agiCore.uptime / 1000)}s
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 } as any}>Uptime</div>
          </div>
        </div>
      )}

      {/* 12-Layer Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '15px'
      } as any}>
        {layerData.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: '18px',
              background: layer.status === 'active' 
                ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.1))'
                : layer.status === 'processing'
                ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(245, 158, 11, 0.1))'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${
                layer.status === 'active' ? '#4ade80' :
                layer.status === 'processing' ? '#f59e0b' : '#6b7280'
              }`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            } as any}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' } as any}>
                {layer.name}
              </h3>
              <div style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: layer.status === 'active' ? '#4ade80' :
                  layer.status === 'processing' ? '#f59e0b' : '#6b7280',
                color: 'black'
              } as any}>
                {layer.status}
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.9rem',
              opacity: 0.8
            } as any}>
              <span>Workers: {layer.workers}</span>
              <span>Load: {layer.load}%</span>
            </div>
            
            {/* Load Bar */}
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '2px',
              marginTop: '10px',
              overflow: 'hidden'
            } as any}>
              <motion.div
                style={{
                  height: '100%',
                  backgroundColor: layer.status === 'active' ? '#4ade80' :
                    layer.status === 'processing' ? '#f59e0b' : '#6b7280',
                  borderRadius: '2px'
                } as any}
                initial={{ width: 0 }}
                animate={{ width: `${layer.load}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '30px',
        textAlign: 'center',
        opacity: 0.6,
        fontSize: '0.8rem'
      } as any}>
        Last Update: {systemData?.timestamp ? new Date(systemData.timestamp).toLocaleTimeString() : 'Never'}
        <br />
        Creator: Ledjan Ahmati | Web8 Platform v8.0.0
      </div>
    </motion.div>
  );
}

