/**
 * UTT API Test Page
 * EuroWeb Platform - API Testing
 */

'use client'

import { useState } from 'react'

export default function UTTTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testSimpleAPI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/utt/test')
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(`API Error: ${response.status} - ${data.error}`)
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testUTTInfo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/utt/info')
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(`API Error: ${response.status} - ${data.error}`)
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testPhysicalSigning = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const testData = {
        tokenId: 'TEST-ALB-001',
        serial: 'S-TEST-001',
        owner: '11111111111111111111111111111112',
        expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000
      }

      const response = await fetch('/api/utt/sign-physical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(`API Error: ${response.status} - ${data.error}`)
      }
    } catch (err: any) {
      setError(`Network Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%)',
      minHeight: '100vh',
      color: '#f8fafc',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '32px' }}>
        🔧 UTT API Test Page
      </h1>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={testSimpleAPI}
          disabled={loading}
          style={{
            background: '#8b5cf6',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test Simple API'}
        </button>

        <button
          onClick={testUTTInfo}
          disabled={loading}
          style={{
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test UTT Info'}
        </button>

        <button
          onClick={testPhysicalSigning}
          disabled={loading}
          style={{
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test Physical Token'}
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          color: '#fecaca'
        }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h3 style={{ marginBottom: '12px' }}>✅ API Response:</h3>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '14px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
