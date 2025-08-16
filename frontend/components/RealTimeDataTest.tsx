/**
 * Real-Time Data Test Component
 * Simple component to display real-time AGI data
 */

'use client'

import React from 'react'
import { useAGIRealTime } from '@/hooks/useAGIRealTime'

export function RealTimeDataTest() {
  const {
    activities,
    analytics,
    ethics,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  } = useAGIRealTime({
    autoConnect: false, // ❌ Nuk lidhet automatikisht
    modules: ['agi-core', 'neural-analytics', 'neural-search', 'agi-office', 'agi-med', 'agi-el', 'agi-eco', 'guardian']
  });

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      background: 'rgba(0, 0, 0, 0.95)',
      border: '2px solid #00ffff',
      borderRadius: '8px',
      padding: '16px',
      color: '#fff',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
    } as any}>
      <h3 style={{ margin: '0 0 16px 0', color: '#22c55e' } as any}>🔍 Real-Time Data Test</h3>
      
      {/* Manual Connection Controls */}
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #444', paddingBottom: '12px' } as any}>
        <button 
          onClick={connect}
          disabled={isConnected}
          style={{
            background: isConnected ? '#666' : '#22c55e',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            marginRight: '8px',
            cursor: isConnected ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          } as any}
        >
          {isConnected ? '✅ Connected' : '🔌 Connect to AGI'}
        </button>
        
        <button 
          onClick={disconnect}
          disabled={!isConnected}
          style={{
            background: !isConnected ? '#666' : '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: !isConnected ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          } as any}
        >
          🔌 Disconnect
        </button>
      </div>
      
      <div style={{ marginBottom: '12px' } as any}>
        <strong>Connection:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'}
      </div>
      
      <div style={{ marginBottom: '12px' } as any}>
        <strong>Loading:</strong> {isLoading ? '🔄 Loading...' : '✅ Ready'}
      </div>
      
      {error && (
        <div style={{ marginBottom: '12px', color: '#ef4444' } as any}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginBottom: '12px' } as any}>
        <strong>Activities:</strong> {activities.length} modules
      </div>
      
      <div style={{ marginBottom: '12px' } as any}>
        <strong>Analytics:</strong> {analytics ? '✅ Available' : '❌ Not available'}
      </div>
      
      <div style={{ marginBottom: '12px' } as any}>
        <strong>Ethics:</strong> {ethics ? '✅ Available' : '❌ Not available'}
      </div>
      
      {activities.length > 0 && (
        <div style={{ marginBottom: '12px' } as any}>
          <strong>Sample Module:</strong>
          <div style={{ paddingLeft: '8px', color: '#cbd5e1' } as any}>
            ID: {activities[0].moduleId}<br/>
            Name: {activities[0].moduleName}<br/>
            Status: {activities[0].status}<br/>
            Activity: {activities[0].activity.toFixed(2)}<br/>
            CPU: {activities[0].cpuUsage.toFixed(1)}%<br/>
            Memory: {activities[0].memoryUsage} MB
          </div>
        </div>
      )}
      
      {analytics && (
        <div style={{ marginBottom: '12px' } as any}>
          <strong>Global Metrics:</strong>
          <div style={{ paddingLeft: '8px', color: '#cbd5e1' } as any}>
            Total Ops: {analytics.globalMetrics.totalOperations.toLocaleString()}<br/>
            System Load: {analytics.globalMetrics.systemLoad.toFixed(1)}%<br/>
            Security: {analytics.globalMetrics.securityLevel}%<br/>
            Ethics: {analytics.globalMetrics.ethicalCompliance}%
          </div>
        </div>
      )}
      
      {ethics && (
        <div style={{ marginBottom: '12px' } as any}>
          <strong>Ethical Status:</strong>
          <div style={{ paddingLeft: '8px', color: '#cbd5e1' } as any}>
            Compliant: {ethics.ethicalCompliance.status}<br/>
            Safe Think: {ethics.ethicalCompliance.safeThinkActive ? 'Active' : 'Inactive'}<br/>
            Active Nodes: {ethics.ethicalCompliance.activeNodes}<br/>
            Alerts: {ethics.ethicalCompliance.alerts}
          </div>
        </div>
      )}
    </div>
  )
}

