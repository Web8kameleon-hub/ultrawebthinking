/**
 * AGI Memory Test Page
 * Tests the real memory system integration
 */

'use client'

import { useEffect, useState } from 'react'
import MemoryGraph from '../../components/MemoryGraph-Clean'
import styles from './page.module.css'

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
    <div className={`theme-euroweb ${styles.container}`}>
      <h1 className={styles.title}>AGI Memory System Test</h1>
      
      <div className={styles.statusCard}>
        <h3>API Status: {apiStatus}</h3>
        {memoryData && (
          <pre className={styles.jsonOutput}>
            {JSON.stringify(memoryData, null, 2)}
          </pre>
        )}
      </div>

      <MemoryGraph />
    </div>
  )
}

