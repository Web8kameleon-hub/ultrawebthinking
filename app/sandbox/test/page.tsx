/**
 * SANDBOX TEST PAGE - SAFE AGI TESTING
 * @author Ledjan Ahmati
 * @version SANDBOX-8.0.0
 * PURPOSE: Safe testing environment for AGI components
 */

'use client'
import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically load sandbox component to avoid SSR issues
const AGISandbox = dynamic(() => 
  import('../../../sandbox/AGI-SANDBOX-SAFE').then(mod => ({ default: mod.AGISandbox })), 
  { 
    ssr: false,
    loading: () => (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🧪</div>
          <div>Loading AGI Sandbox...</div>
          <div style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '5px' }}>
            Safe testing environment - No production impact
          </div>
        </div>
      </div>
    )
  }
)

export default function SandboxTestPage() {
  return (
    <div style={{ background: '#047857', minHeight: '100vh' }}>
      {/* Safety Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #10b981, #059669)',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        🧪 SANDBOX MODE ACTIVE • SAFE TESTING ENVIRONMENT • NO PRODUCTION IMPACT
      </div>
      
      <AGISandbox />
    </div>
  )
}
