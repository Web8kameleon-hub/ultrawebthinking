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

import { useEffect, useState } from 'react'

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

export default function LoRaPhysicalDashboard({ autoRefresh = false }: { autoRefresh?: boolean }) {
  const [status, setStatus] = useState<LoRaStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testTokenId, setTestTokenId] = useState('')
  const [testNodeId, setTestNodeId] = useState('node_251')
  const [isActive, setIsActive] = useState(autoRefresh)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/lora/status')
      if (!response.ok) {throw new Error('Failed to fetch LoRa status')}

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

      if (!response.ok) {throw new Error('Failed to simulate token event')}

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

      if (!response.ok) {throw new Error('Failed to verify token')}

      const result = await response.json()
      console.log('Token verification result:', result)

      // Refresh status after verification
      setTimeout(fetchStatus, 1000)

    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (isActive) {
      fetchStatus()
      const interval = setInterval(fetchStatus, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isActive])

  const toggleLoRaGateway = () => {
    setIsActive(!isActive)
    if (!isActive) {
      fetchStatus() // Fetch once when activating
    }
  }

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
      background: 'linear-gradient(135deg, #0f4a5c 0%, #1e40af 50%, #065f46 100%)',
      borderRadius: '16px',
      padding: '24px',
      color: '#e2e8f0',
      minHeight: '600px',
      border: '2px solid #0ea5e9'
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
            color: '#7dd3fc',
            fontSize: '24px',
            fontWeight: 700
          }}>
            🏥 AGI Medical Engine Ultra
          </h2>
          <p style={{
            margin: '4px 0 0 0',
            color: '#a5f3fc',
            fontSize: '14px'
          }}>
            Advanced Healthcare Intelligence & Medical Analytics System
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={toggleLoRaGateway}
            style={{
              background: isActive ? '#059669' : '#0ea5e9',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isActive ? '🏥 Medical Active' : '⚕️ Start Medical'}
          </button>
          <button
            onClick={fetchStatus}
            disabled={loading ?? !isActive}
            style={{
              background: (loading ?? !isActive) ? '#64748b' : '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {loading ? '🔄 Refreshing...' : '� Refresh Medical'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(251, 146, 60, 0.15)',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#fed7aa'
        }}>
          ⚠️ Medical Alert: {error}
        </div>
      )}

      {status && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Network Status */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #06b6d4'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#7dd3fc' }}>
              � Medical Performance Metrics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#a5f3fc', marginBottom: '4px' }}>👥 Patients Monitored</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#22d3ee' }}>
                  {status.loraNetwork.connectedNodes}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#a5f3fc', marginBottom: '4px' }}>🏥 System Status</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: status.loraNetwork.status === 'active' ? '#22d3ee' : '#fbbf24'
                }}>
                  {status.loraNetwork.status === 'active' ? '🟢 Medical Active' : '🟡 Standby'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#a5f3fc', marginBottom: '4px' }}>⏰ Last Medical Check</div>
                <div style={{ fontSize: '14px', color: '#e2e8f0' }}>
                  {status.loraNetwork.lastActivity ?
                    new Date(status.loraNetwork.lastActivity).toLocaleTimeString() :
                    'No recent activity'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Patient Health Monitoring */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #10b981'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#6ee7b7' }}>
              👥 Patient Monitoring
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>🚨 Critical Cases</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#fbbf24' }}>
                  {status.physicalVerification.pendingVerifications}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>✅ Stable Patients</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#22d3ee' }}>
                  {status.physicalVerification.verifiedTokens}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>🏥 Medical Status</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: status.physicalVerification.status === 'active' ? '#22d3ee' : '#a5f3fc'
                }}>
                  {status.physicalVerification.status === 'active' ? '🟢 Monitoring Active' : '⚪ Standby Mode'}
                </div>
              </div>
            </div>
          </div>

          {/* Medical Test Simulation */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.15)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #3b82f6'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#93c5fd' }}>
              🧪 Medical Test Simulation
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#bfdbfe', display: 'block', marginBottom: '4px' }}>
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={testTokenId}
                    onChange={(e) => setTestTokenId(e.target.value)}
                    placeholder="patient_001"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#bfdbfe', display: 'block', marginBottom: '4px' }}>
                    Medical Department
                  </label>
                  <select
                    value={testNodeId}
                    onChange={(e) => setTestNodeId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '14px'
                    }}
                  >
                    <option value="node_251">🏥 ICU</option>
                    <option value="node_752">🚑 Emergency</option>
                    <option value="node_782">❤️ Cardiology</option>
                    <option value="node_918">🔬 Surgery</option>
                    <option value="node_840">💊 Pharmacy</option>
                  </select>
                </div>
              </div>
              <button
                onClick={simulatePhysicalToken}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  width: '100%',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                � Simulate Medical Event
              </button>
            </div>
          </div>

          {/* Medical Status Footer */}
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#a5f3fc',
            paddingTop: '16px',
            borderTop: '1px solid #0ea5e9'
          }}>
            🏥 Last Medical Update: {new Date(status.timestamp).toLocaleString()} | AGI Medical Engine Active
          </div>
        </div>
      )}
    </div>
  )
}
