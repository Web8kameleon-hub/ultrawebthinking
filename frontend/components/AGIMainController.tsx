/**
 * EuroWeb AGI Main Tab Controller
 * Controls which tab system to use - New or Classic
 */

'use client'

import React, { useState } from 'react'
import { AGITabSystem } from './AGITabSystem'
import { Web8TabSystem } from './Web8TabSystem'

export function AGIMainController() {
  const [useNewTabSystem, setUseNewTabSystem] = useState<boolean>(true)

  if (useNewTabSystem) {
    return (
      <div style={{ position: 'relative' } as any}>
        {/* Toggle button */}
        <button
          onClick={() => setUseNewTabSystem(false)}
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'monospace'
          } as any}
        >
          📱 Switch to Classic View
        </button>
        <AGITabSystem />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' } as any}>
      {/* Toggle button */}
      <button
        onClick={() => setUseNewTabSystem(true)}
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          border: '2px solid #8b5cf6',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
          cursor: 'pointer',
          fontFamily: 'monospace'
        } as any}
      >
        🚀 Switch to New Tab System
      </button>
      <Web8TabSystem />
    </div>
  )
}

export default AGIMainController
