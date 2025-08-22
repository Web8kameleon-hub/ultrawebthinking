/**
 * Enhanced ALB Security Dashboard
 * EuroWeb Platform - Real Token Analysis & Risk Management
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TokenInfo {
  isVerified: boolean
  marketCap: number
  totalSupply: number
  liquidity: number
  priceUSD: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  hasRevokeFreezeAuthority: boolean
  hasRevokeMintAuthority: boolean
  slippageRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  volume24h: number
  transactions24h: number
}

interface SecurityStatus {
  healthScore: number
  alerts: string[]
  lastMonitored: number | null
  monitoringActive: boolean
}

interface OperationalLimits {
  maxTransferUSD: number
  maxSlippage: number
  recommendedMaxUSD: number
}

interface EnhancedUTTInfo {
  network: string
  mint: string
  decimals: number
  euroPerALB: number
  bridge: string
  bridgeBalanceALB: number
  bridgeBalanceUSD: number
  transfersEnabled: boolean
  status: string
  tokenInfo: TokenInfo
  securityStatus: SecurityStatus
  operationalLimits: OperationalLimits
  dataSources: string[]
  lastUpdated: number
}

const ALBSecurityDashboard: React.FC = () => {
  const [uttInfo, setUttInfo] = useState<EnhancedUTTInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUTTInfo()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadUTTInfo, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadUTTInfo = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/utt/info')
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setError('API returned HTML instead of JSON - check if route exists')
        return
      }
      
      const data = await response.json()
      
      if (response.ok) {
        setUttInfo(data)
      } else {
        setError(data.error || 'Failed to load UTT info')
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return '#22c55e'
      case 'MEDIUM': return '#f59e0b'
      case 'HIGH': return '#ef4444'
      case 'CRITICAL': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    if (score >= 40) return '#ef4444'
    return '#dc2626'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c1426 0%, #1e293b 25%, #374151 50%, #4b5563 75%, #6b7280 100%)',
      color: '#f8fafc',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #ef4444, #f59e0b, #22c55e)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          margin: 0,
          marginBottom: '8px'
        }}>
          🔒 ALB Security Dashboard
        </h1>
        <p style={{
          margin: 0,
          fontSize: '18px',
          color: '#cbd5e1',
          fontWeight: 500
        }}>
          Real-time Risk Analysis & Token Monitoring
        </p>
      </motion.div>

      {/* Security Alert Banner */}
      {uttInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: uttInfo?.tokenInfo?.isVerified ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `2px solid ${uttInfo?.tokenInfo?.isVerified ? '#22c55e' : '#ef4444'}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            {uttInfo?.tokenInfo?.isVerified ? '✅ Verified Token' : '⚠️ UNVERIFIED TOKEN'}
          </div>
          <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
            {uttInfo?.tokenInfo?.isVerified 
              ? 'This token has been verified and audited'
              : 'This token is UNVERIFIED. Exercise extreme caution. Only interact if you trust the source.'
            }
          </div>
        </motion.div>
      )}

      {/* Main Dashboard Grid */}
      {uttInfo && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Token Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#3b82f6' }}>
              📊 Token Information
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Price:</span>
                <span style={{ fontWeight: 600 }}>${uttInfo?.tokenInfo?.priceUSD?.toFixed(6) || '0.000000'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Market Cap:</span>
                <span style={{ fontWeight: 600 }}>${uttInfo?.tokenInfo?.marketCap?.toLocaleString() || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Total Supply:</span>
                <span style={{ fontWeight: 600 }}>{uttInfo?.tokenInfo?.totalSupply?.toLocaleString() || 'N/A'} ALB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Liquidity:</span>
                <span style={{ fontWeight: 600, color: (uttInfo?.tokenInfo?.liquidity || 0) < 5000 ? '#ef4444' : '#22c55e' }}>
                  ${uttInfo?.tokenInfo?.liquidity?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>24h Volume:</span>
                <span style={{ fontWeight: 600 }}>${uttInfo?.tokenInfo?.volume24h?.toLocaleString() || 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${getRiskColor(uttInfo?.tokenInfo?.riskLevel || 'UNKNOWN')}`,
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: getRiskColor(uttInfo?.tokenInfo?.riskLevel || 'UNKNOWN') }}>
              🚨 Risk Assessment
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Overall Risk:</span>
                <span style={{ 
                  fontWeight: 600, 
                  color: getRiskColor(uttInfo?.tokenInfo?.riskLevel || 'UNKNOWN'),
                  padding: '4px 8px',
                  background: `${getRiskColor(uttInfo?.tokenInfo?.riskLevel || 'UNKNOWN')}20`,
                  borderRadius: '4px'
                }}>
                  {uttInfo?.tokenInfo?.riskLevel || 'UNKNOWN'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Slippage Risk:</span>
                <span style={{ fontWeight: 600, color: getRiskColor(uttInfo?.tokenInfo?.slippageRisk || 'UNKNOWN') }}>
                  {uttInfo?.tokenInfo?.slippageRisk || 'UNKNOWN'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Freeze Authority:</span>
                <span style={{ fontWeight: 600, color: uttInfo?.tokenInfo?.hasRevokeFreezeAuthority ? '#f59e0b' : '#22c55e' }}>
                  {uttInfo?.tokenInfo?.hasRevokeFreezeAuthority ? 'PRESENT' : 'REVOKED'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Mint Authority:</span>
                <span style={{ fontWeight: 600, color: uttInfo?.tokenInfo?.hasRevokeMintAuthority ? '#f59e0b' : '#22c55e' }}>
                  {uttInfo?.tokenInfo?.hasRevokeMintAuthority ? 'PRESENT' : 'REVOKED'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Security Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${getHealthColor(uttInfo?.securityStatus?.healthScore || 0)}`,
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: getHealthColor(uttInfo?.securityStatus?.healthScore || 0) }}>
              💚 Security Health
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Health Score:</span>
                <span style={{ 
                  fontSize: '24px',
                  fontWeight: 700,
                  color: getHealthColor(uttInfo?.securityStatus?.healthScore || 0)
                }}>
                  {uttInfo?.securityStatus?.healthScore || 0}/100
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Monitoring:</span>
                <span style={{ fontWeight: 600, color: uttInfo?.securityStatus?.monitoringActive ? '#22c55e' : '#ef4444' }}>
                  {uttInfo?.securityStatus?.monitoringActive ? '🟢 ACTIVE' : '🔴 INACTIVE'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Active Alerts:</span>
                <span style={{ fontWeight: 600, color: (uttInfo?.securityStatus?.alerts?.length || 0) > 0 ? '#ef4444' : '#22c55e' }}>
                  {uttInfo?.securityStatus?.alerts?.length || 0}
                </span>
              </div>
              {uttInfo?.securityStatus?.lastMonitored && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  Last check: {new Date(uttInfo.securityStatus.lastMonitored).toLocaleTimeString()}
                </div>
              )}
            </div>
          </motion.div>

          {/* Operational Limits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#22c55e' }}>
              ⚙️ Operational Limits
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Max Transfer:</span>
                <span style={{ fontWeight: 600 }}>
                  ${uttInfo?.operationalLimits?.maxTransferUSD?.toFixed(2) ?? 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Recommended Max:</span>
                <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                  ${uttInfo?.operationalLimits?.recommendedMaxUSD?.toFixed(2) ?? 'N/A'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Max Slippage:</span>
                <span style={{ fontWeight: 600 }}>{uttInfo?.operationalLimits?.maxSlippage ?? 'N/A'}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Bridge Balance:</span>
                <span style={{ fontWeight: 600 }}>
                  {uttInfo?.bridgeBalanceALB?.toFixed(2) ?? 'N/A'} ALB
                  <br />
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    (${uttInfo?.bridgeBalanceUSD?.toFixed(2) ?? 'N/A'})
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Security Alerts */}
      {uttInfo && uttInfo?.securityStatus?.alerts && uttInfo.securityStatus.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#ef4444' }}>
            🚨 Active Security Alerts
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {uttInfo?.securityStatus?.alerts?.map((alert, index) => (
              <div key={index} style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#fecaca'
              }}>
                {alert}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Data Sources */}
      {uttInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(107, 114, 128, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#9ca3af'
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong>Data Sources:</strong> {uttInfo?.dataSources?.join(', ') || 'N/A'}
          </div>
          <div>
            <strong>Last Updated:</strong> {uttInfo?.lastUpdated ? new Date(uttInfo.lastUpdated).toLocaleString() : 'N/A'}
          </div>
        </motion.div>
      )}

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          textAlign: 'center',
          marginBottom: '24px'
        }}
      >
        <button
          onClick={loadUTTInfo}
          disabled={loading}
          style={{
            background: loading ? '#6b7280' : 'rgba(59, 130, 246, 0.2)',
            border: '1px solid #3b82f6',
            color: '#3b82f6',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
        </button>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#fecaca'
          }}
        >
          ❌ {error}
          <button
            onClick={() => setError(null)}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default ALBSecurityDashboard
