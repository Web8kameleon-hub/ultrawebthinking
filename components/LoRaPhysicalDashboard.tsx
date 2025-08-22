/**
 * LoRa Physical Verification Dashboard
 * EuroWeb Platform - IoT Integration for UTT-ALB
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'

interface LoRaStatus {
  timestamp: string
  loraNetwork: {
    connectedNodes: number
    lastActivity: string | null
    status: 'active' | 'inactive'
  }
  physicalVerification: {
    pendingVerifications: number
    verifiedTokens: number
    status: 'active' | 'standby'
  }
  specificToken?: {
    verified?: any
    pending?: any
  } | null
}

export default function LoRaPhysicalDashboard() {
  const [status, setStatus] = useState<LoRaStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testTokenId, setTestTokenId] = useState('')
  const [testNodeId, setTestNodeId] = useState('node_251')

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/lora/status')
      if (!response.ok) throw new Error('Failed to fetch LoRa status')
      
      const data = await response.json()
      setStatus(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const simulatePhysicalToken = async () => {
    if (!testTokenId || !testNodeId) {
      setError('Please enter both Token ID and Node ID')
      return
    }

    try {
      const response = await fetch('/api/lora/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate',
          tokenId: testTokenId,
          nodeId: testNodeId
        })
      })

      if (!response.ok) throw new Error('Failed to simulate token event')
      
      const result = await response.json()
      console.log('Token simulation result:', result)
      
      // Refresh status after simulation
      setTimeout(fetchStatus, 1000)
      
    } catch (err: any) {
      setError(err.message)
    }
  }

  const verifyToken = async (tokenId: string) => {
    try {
      const response = await fetch('/api/lora/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          tokenId
        })
      })

      if (!response.ok) throw new Error('Failed to verify token')
      
      const result = await response.json()
      console.log('Token verification result:', result)
      
      // Refresh status after verification
      setTimeout(fetchStatus, 1000)
      
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading && !status) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '12px',
        color: '#e2e8f0'
      }}>
        <div style={{ fontSize: '18px' }}>🛰️ Loading LoRa Network...</div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: '#e2e8f0',
      minHeight: '600px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #334155',
        paddingBottom: '16px'
      }}>
        <div>
          <h2 style={{ 
            margin: 0, 
            color: '#60a5fa',
            fontSize: '24px',
            fontWeight: 700
          }}>
            🛰️ LoRa Physical Verification
          </h2>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            IoT Integration for UTT-ALB Physical Token Management
          </p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          style={{
            background: loading ? '#374151' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#fecaca'
        }}>
          ❌ Error: {error}
        </div>
      )}

      {status && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Network Status */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #334155'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#60a5fa' }}>
              📡 LoRa Network Status
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Connected Nodes</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
                  {status.loraNetwork.connectedNodes}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Network Status</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: status.loraNetwork.status === 'active' ? '#10b981' : '#f59e0b'
                }}>
                  {status.loraNetwork.status === 'active' ? '🟢 Active' : '🟡 Inactive'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Last Activity</div>
                <div style={{ fontSize: '14px', color: '#e2e8f0' }}>
                  {status.loraNetwork.lastActivity ? 
                    new Date(status.loraNetwork.lastActivity).toLocaleTimeString() : 
                    'No activity'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Physical Verification Status */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #334155'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#60a5fa' }}>
              🏷️ Physical Token Verification
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Pending Verifications</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>
                  {status.physicalVerification.pendingVerifications}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Verified Tokens</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
                  {status.physicalVerification.verifiedTokens}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Verification Status</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 600, 
                  color: status.physicalVerification.status === 'active' ? '#10b981' : '#94a3b8'
                }}>
                  {status.physicalVerification.status === 'active' ? '🟢 Active' : '⚪ Standby'}
                </div>
              </div>
            </div>
          </div>

          {/* Test Physical Token */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #3b82f6'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#60a5fa' }}>
              🧪 Test Physical Token Verification
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Token ID
                  </label>
                  <input
                    type="text"
                    value={testTokenId}
                    onChange={(e) => setTestTokenId(e.target.value)}
                    placeholder="token_test_001"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Node ID
                  </label>
                  <select
                    value={testNodeId}
                    onChange={(e) => setTestNodeId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '14px'
                    }}
                  >
                    <option value="node_251">node_251</option>
                    <option value="node_752">node_752</option>
                    <option value="node_782">node_782</option>
                    <option value="node_918">node_918</option>
                    <option value="node_840">node_840</option>
                  </select>
                </div>
              </div>
              <button
                onClick={simulatePhysicalToken}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                🏷️ Simulate Physical Token Event
              </button>
            </div>
          </div>

          {/* Status Footer */}
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#6b7280',
            paddingTop: '16px',
            borderTop: '1px solid #334155'
          }}>
            Last updated: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}
