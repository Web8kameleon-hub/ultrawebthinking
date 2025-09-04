/**
 * ServerClientHybridComponent.tsx
 * Harmoni absolute mes Next.js SSR + React Client
 * Lidhet me backend AGI për të dhëna reale
 * © Web8 UltraThinking – Ledjan Ahmati
 */

'use client';

import React, { useEffect, useState } from 'react';
import { getAGIStatus, getNeuralStats, testServerConnection } from '../lib/serverApi';

interface NeuralStats {
  totalNodes: number;
  activeNodes: number;
  averageActivity: number;
  throughput: number;
  latency: number;
  accuracy: number;
  learningRate: number;
  memoryUsage: number;
  networkTopology: number[];
  nodes: Array<{
    id: string;
    type: string;
    activity: number;
    pulseRate: number;
    connections: number;
    status: string;
    errors: number;
  }>;
}

interface ComponentState {
  neuralStats: NeuralStats | null;
  agiStatus: any;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  lastUpdate: string;
}

export default function ServerClientHybridComponent() {
  const [state, setState] = useState<ComponentState>({
    neuralStats: null,
    agiStatus: null,
    isConnected: false,
    loading: true,
    error: null,
    lastUpdate: ''
  });

  // Test koneksionin me serverin
  const checkConnection = async () => {
    const connected = await testServerConnection();
    setState(prev => ({ ...prev, isConnected: connected }));
    return connected;
  };

  // Ngarkon të dhënat reale nga backend
  const loadRealData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Test koneksioni para se të vazhdojmë
      const connected = await checkConnection();
      if (!connected) {
        throw new Error('Nuk mund të lidhem me serverin AGI');
      }

      // Merr të dhënat reale nga backend
      const [neuralResponse, agiResponse] = await Promise.all([
        getNeuralStats(),
        getAGIStatus()
      ]);

      if (!neuralResponse.success) {
        throw new Error(neuralResponse.error || 'Gabim duke marrë neural stats');
      }

      if (!agiResponse.success) {
        throw new Error(agiResponse.error || 'Gabim duke marrë AGI status');
      }

      setState(prev => ({
        ...prev,
        neuralStats: neuralResponse.data!,
        agiStatus: agiResponse.data,
        loading: false,
        lastUpdate: new Date().toLocaleTimeString()
      }));

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // Ngarkon të dhënat kur komponenti montohet
  useEffect(() => {
    loadRealData();

    // Refresh çdo 5 sekonda për real-time data
    const interval = setInterval(loadRealData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Inline styles për komponent
  const containerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    fontFamily: 'Inter, system-ui, sans-serif',
    maxWidth: '800px',
    margin: '20px auto'
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const statusStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '16px'
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '16px',
    backdropFilter: 'blur(10px)'
  };

  const errorStyle: React.CSSProperties = {
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    color: '#fca5a5'
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px'
  };

  if (state.loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          🔄 Duke ngarkuar të dhënat reale nga AGI...
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          ❌ AGI Server-Client Sync
        </div>
        <div style={errorStyle}>
          <strong>Gabim:</strong> {state.error}
        </div>
        <button 
          onClick={loadRealData}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          🔄 Provo Sërish
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        🧠 AGI Server-Client Sync
      </div>
      
      <div style={statusStyle}>
        <span style={{ color: state.isConnected ? '#10b981' : '#ef4444' }}>
          {state.isConnected ? '🟢' : '🔴'}
        </span>
        Status: {state.isConnected ? 'I lidhur' : 'I shkëputur'} | 
        Përditësuar: {state.lastUpdate}
      </div>

      {state.neuralStats && (
        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>📊 Neural Nodes</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {state.neuralStats.activeNodes}/{state.neuralStats.totalNodes}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {state.neuralStats.averageActivity.toFixed(1)}% aktivitet
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>⚡ Performance</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {state.neuralStats.accuracy.toFixed(1)}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              {state.neuralStats.latency.toFixed(1)}ms latency
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>🧮 Memory</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {state.neuralStats.memoryUsage.toFixed(1)} MB
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Learning rate: {state.neuralStats.learningRate.toFixed(1)}%
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>🔄 Throughput</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {state.neuralStats.throughput}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              requests të përpunuara
            </div>
          </div>
        </div>
      )}

      {state.agiStatus && (
        <div style={{ ...cardStyle, marginTop: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>🤖 AGI Core Status</h3>
          <pre style={{ 
            fontSize: '12px', 
            background: 'rgba(0,0,0,0.2)', 
            padding: '8px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(state.agiStatus, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

