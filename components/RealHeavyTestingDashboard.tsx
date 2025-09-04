/**
 * Real Heavy Testing Dashboard Component - No Fake Functions
 * Swiss Precision Testing Interface
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

'use client'

import React, { useEffect, useState } from 'react'
import styles from './RealHeavyTesting.module.css'

interface TestResult {
  testName: string
  status: 'PASS' | 'FAIL' | 'ERROR'
  executionTime: number
  memoryUsage: NodeJS.MemoryUsage
  cpuUsage: NodeJS.CpuUsage
  timestamp: string
  details: any
  realData: true
}

interface SystemInfo {
  platform: string
  arch: string
  cpus: any[]
  totalMemory: number
  freeMemory: number
  uptime: number
  loadAverage: number[]
  nodeVersion: string
  processId: number
  realData: true
}

const RealHeavyTestingDashboard: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  // Load system info on component mount
  useEffect(() => {
    loadSystemInfo()
  }, [])

  const loadSystemInfo = async () => {
    try {
      const response = await fetch('/api/testing/heavy?testType=system-info')
      const data = await response.json()
      
      if (data.success && data.realData) {
        setSystemInfo(data.result)
      } else {
        setError('Failed to load system information')
      }
    } catch (err) {
      setError('Error loading system information')
      console.error('System info error:', err)
    }
  }

  const runTest = async (testType: string, testName: string) => {
    setIsRunning(testType)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/testing/heavy?testType=${testType}`)
      const data = await response.json()

      if (data.success && data.realData) {
        if (testType === 'full-stress') {
          setTestResults(data.result.detailedResults)
          setSuccess(`Full stress test completed: ${data.result.summary.passed}/${data.result.summary.totalTests} tests passed`)
        } else {
          setTestResults(prev => [data.result, ...prev.slice(0, 9)]) // Keep last 10 results
          setSuccess(`${testName} completed successfully`)
        }
      } else {
        setError(data.error || 'Test failed')
      }
    } catch (err) {
      setError(`Failed to run ${testName}`)
      console.error('Test error:', err)
    } finally {
      setIsRunning(null)
    }
  }

  const formatBytes = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const formatTime = (ms: number) => {
    return `${ms.toFixed(2)}ms`
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${mins}m`
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>🔥 Real Heavy Testing Engine</h1>
        <p className={styles.subtitle}>
          Swiss Precision Testing - No Fake Functions, Only Real System Tests
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className={styles.errorMessage}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          ✅ {success}
        </div>
      )}

      {/* System Information */}
      {systemInfo && (
        <div className={styles.systemInfo}>
          <h3 className={styles.detailsTitle}>💻 Real System Information</h3>
          <div className={styles.systemInfoGrid}>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Platform</div>
              <div className={styles.metricValue}>{systemInfo.platform} {systemInfo.arch}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>CPU Cores</div>
              <div className={styles.metricValue}>{systemInfo.cpus.length}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Total Memory</div>
              <div className={styles.metricValue}>{formatBytes(systemInfo.totalMemory)}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Free Memory</div>
              <div className={styles.metricValue}>{formatBytes(systemInfo.freeMemory)}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>System Uptime</div>
              <div className={styles.metricValue}>{formatUptime(systemInfo.uptime)}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Load Average</div>
              <div className={styles.metricValue}>{systemInfo.loadAverage.map(l => l.toFixed(2)).join(', ')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <button
          className={styles.testButton}
          onClick={() => runTest('memory-stress', 'Memory Stress Test')}
          disabled={isRunning !== null}
        >
          {isRunning === 'memory-stress' ? <span className={styles.loadingSpinner}></span> : '💾'} Memory Stress
        </button>

        <button
          className={styles.testButton}
          onClick={() => runTest('cpu-stress', 'CPU Stress Test')}
          disabled={isRunning !== null}
        >
          {isRunning === 'cpu-stress' ? <span className={styles.loadingSpinner}></span> : '⚡'} CPU Stress
        </button>

        <button
          className={styles.testButton}
          onClick={() => runTest('filesystem-stress', 'FileSystem Stress Test')}
          disabled={isRunning !== null}
        >
          {isRunning === 'filesystem-stress' ? <span className={styles.loadingSpinner}></span> : '💿'} FileSystem Stress
        </button>

        <button
          className={styles.testButton}
          onClick={() => runTest('network-stress', 'Network Stress Test')}
          disabled={isRunning !== null}
        >
          {isRunning === 'network-stress' ? <span className={styles.loadingSpinner}></span> : '🌐'} Network Stress
        </button>

        <button
          className={styles.testButton}
          onClick={() => runTest('benchmark', 'Performance Benchmark')}
          disabled={isRunning !== null}
        >
          {isRunning === 'benchmark' ? <span className={styles.loadingSpinner}></span> : '🎯'} Benchmark
        </button>

        <button
          className={styles.testButton}
          onClick={() => runTest('full-stress', 'Full System Stress Test')}
          disabled={isRunning !== null}
        >
          {isRunning === 'full-stress' ? <span className={styles.loadingSpinner}></span> : '🔥'} Full Stress Test
        </button>
      </div>

      {/* Test Results */}
      <div className={styles.resultsContainer}>
        {testResults.map((result, index) => (
          <div key={`${result.testName}-${index}`} className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultTitle}>{result.testName}</h3>
              <span className={`${styles.resultStatus} ${
                result.status === 'PASS' ? styles.statusPass :
                result.status === 'FAIL' ? styles.statusFail : styles.statusError
              }`}>
                {result.status}
              </span>
            </div>

            <div className={styles.resultMetrics}>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Execution Time</div>
                <div className={styles.metricValue}>{formatTime(result.executionTime)}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Memory Used</div>
                <div className={styles.metricValue}>{formatBytes(result.memoryUsage.heapUsed)}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>CPU User Time</div>
                <div className={styles.metricValue}>{(result.cpuUsage.user / 1000).toFixed(2)}ms</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>CPU System Time</div>
                <div className={styles.metricValue}>{(result.cpuUsage.system / 1000).toFixed(2)}ms</div>
              </div>
            </div>

            {result.details && (
              <div className={styles.resultDetails}>
                <div className={styles.detailsTitle}>📊 Test Details</div>
                <div className={styles.detailsContent}>
                  {JSON.stringify(result.details, null, 2)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <h3 className={styles.resultTitle}>🚀 Ready for Testing</h3>
          </div>
          <p className={styles.readyMessage}>
            Click any test button above to start real heavy-duty system testing.
            All tests use real system resources - no fake data or Math.random().
          </p>
        </div>
      )}
    </div>
  )
}

export default RealHeavyTestingDashboard
