/**
 * AGI Memory Test Page
 * Tests the real memory system integration
 */

'use client'

import { useEffect, useState } from 'react'
import MemoryGraph from '../../components/MemoryGraph-Clean'

export default function MemoryTestPage() {
  const [apiStatus, setApiStatus] = useState('checking...')
  const [memoryData, setMemoryData] = useState(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('/api/agi/memory')
        if (response.ok) {
          const data = await response.json()
          setApiStatus('✅ Connected')
          setMemoryData(data)
          console.log('AGI Memory API Response:', data)
        } else {
          setApiStatus(`❌ Error: ${response.status}`)
        }
      } catch (error: any) {
        setApiStatus(`❌ Failed: ${error?.message || 'Unknown error'}`)
        console.error('AGI Memory API Error:', error)
      }
    }

    testAPI()
  }, [])

  return (
    <div className="theme-euroweb" style={{ padding: '20px', minHeight: '100vh' }}>
      <h1 style={{ color: '#f8fafc', marginBottom: '20px' }}>AGI Memory System Test</h1>
      
      <div style={{ 
        backgroundColor: '#1e293b', 
        border: '1px solid #475569', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '20px',
        color: '#f8fafc'
      }}>
        <h3>API Status: {apiStatus}</h3>
        {memoryData && (
          <pre style={{ 
            backgroundColor: '#0f172a', 
            padding: '10px', 
            borderRadius: '4px', 
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {JSON.stringify(memoryData, null, 2)}
          </pre>
        )}
      </div>

      <MemoryGraph />
    </div>
  )
}
