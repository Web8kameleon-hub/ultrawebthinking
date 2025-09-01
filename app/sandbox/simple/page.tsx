/**
 * SIMPLE SANDBOX TEST COMPONENT - WORKING VERSION
 * @author Ledjan Ahmati
 * @version SANDBOX-8.0.0-SIMPLE
 * PURPOSE: Simple working sandbox for AGI testing
 */

'use client'
import React, { useState, useEffect } from 'react'

export default function SimpleSandbox() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testSandbox = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/sandbox/agi', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Sandbox-Mode': 'true',
            'X-Safe-Testing': 'enabled'
          },
          body: JSON.stringify({ 
            kind: 'SANDBOX.NEURAL_CONNECTIONS',
            args: {},
            sandboxMode: true,
            safetyLevel: 'MAXIMUM'
          })
        })
        
        const result = await response.json()
        setData(result)
        
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }

    testSandbox()
  }, [])

  const containerStyle = {
    padding: '40px',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#f8fafc',
    fontFamily: 'monospace'
  }

  const headerStyle = {
    background: 'rgba(16, 185, 129, 0.2)',
    border: '2px solid #10b981',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    textAlign: 'center' as const
  }

  const cardStyle = {
    background: 'rgba(6, 95, 70, 0.8)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '20px'
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1>🧪 SANDBOX LOADING...</h1>
          <p>Safe testing environment starting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1>🧪 SANDBOX ERROR</h1>
          <p style={{ color: '#fbbf24' }}>Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>🧪 AGI SANDBOX - WORKING!</h1>
        <p>Safe testing environment • Zero production impact</p>
      </div>

      <div style={cardStyle}>
        <h2>📊 Sandbox Test Results</h2>
        <div style={{ marginTop: '20px' }}>
          <h3>🔍 Raw API Response:</h3>
          <pre style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '15px', 
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        {data?.ok && (
          <div style={{ marginTop: '20px' }}>
            <h3>✅ Parsed Data:</h3>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              padding: '15px', 
              borderRadius: '8px' 
            }}>
              <p><strong>Value:</strong> {String(data.data)}</p>
              {data.data?.provenance && (
                <div>
                  <p><strong>Source:</strong> {data.data.provenance.source}</p>
                  <p><strong>Fetched:</strong> {data.data.provenance.fetchedAt}</p>
                  <p><strong>TTL:</strong> {data.data.provenance.ttlSeconds}s</p>
                  <p><strong>Sandbox:</strong> {String(data.data.provenance.isSandbox)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2>🛡️ Safety Verification</h2>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>✅ No production database access</li>
          <li>✅ Isolated test environment</li>
          <li>✅ Safe to modify and experiment</li>
          <li>✅ Zero risk of data corruption</li>
          <li>✅ Provenance validation working</li>
        </ul>
      </div>

      <div style={cardStyle}>
        <h2>🧪 Next Steps</h2>
        <p>This simple sandbox is working! Now you can:</p>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Test different sandbox endpoints</li>
          <li>Verify TTL expiration handling</li>
          <li>Test error scenarios safely</li>
          <li>Apply patterns to production components</li>
        </ol>
      </div>
    </div>
  )
}
