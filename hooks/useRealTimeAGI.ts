/**
 * Real-Time React Hook for AGI Data
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export interface RealTimeSystemData {
  cpu: {
    load: number
    cores: Array<{
      load: number
      loadIdle: number
    }>
  }
  memory: {
    total: number
    free: number
    used: number
    utilization: number
  }
  network: Array<{
    iface: string
    rxSec: number
    txSec: number
    operstate: string
  }>
  process: {
    uptime: number
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
  }
  neural: {
    connections: number
    operations: number
    learningRate: number
    accuracy: number
  }
}

export interface AGIRealTimeState {
  data: RealTimeSystemData | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
}

export function useAGIRealTime(): AGIRealTimeState {
  const [state, setState] = useState<AGIRealTimeState>({
    data: null,
    isConnected: false,
    isLoading: true,
    error: null,
    lastUpdate: null,
  })

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const eventSource = new EventSource('/api/realtime/stream')
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isLoading: false,
          error: null,
        }))
      }

      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data)
          
          if (parsedData.type === 'connection') {
            console.log('AGI Real-Time Stream:', parsedData.message)
          } else if (parsedData.type === 'metrics') {
            setState(prev => ({
              ...prev,
              data: parsedData.data,
              lastUpdate: new Date(parsedData.timestamp),
              isConnected: true,
              isLoading: false,
              error: null,
            }))
          } else if (parsedData.type === 'error') {
            setState(prev => ({
              ...prev,
              error: parsedData.error,
              isLoading: false,
            }))
          }
        } catch (error) {
          console.error('Failed to parse real-time data:', error)
          setState(prev => ({
            ...prev,
            error: 'Failed to parse real-time data',
            isLoading: false,
          }))
        }
      }

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        setState(prev => ({
          ...prev,
          isConnected: false,
          error: 'Connection lost. Attempting to reconnect...',
          isLoading: false,
        }))

        // Auto-reconnect after 3 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 3000)
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown connection error',
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  return state
}

// Additional hook for specific metrics
export function useSystemMetrics() {
  const { data, isConnected, error } = useAGIRealTime()
  
  return {
    cpuLoad: data?.cpu.load || 0,
    memoryUsage: data?.memory.utilization || 0,
    networkActivity: data?.network.reduce((total, net) => total + net.rxSec + net.txSec, 0) || 0,
    uptime: data?.process.uptime || 0,
    neuralConnections: data?.neural.connections || 0,
    neuralAccuracy: data?.neural.accuracy || 0,
    isConnected,
    error,
    isHealthy: isConnected && !error && data !== null
  }
}

// Hook for neural analytics
export function useNeuralAnalytics() {
  const { data, isConnected, error } = useAGIRealTime()
  
  return {
    connections: data?.neural.connections || 0,
    operations: data?.neural.operations || 0,
    learningRate: data?.neural.learningRate || 0,
    accuracy: data?.neural.accuracy || 0,
    processingLoad: data?.cpu.load || 0,
    memoryEfficiency: data?.memory.free && data?.memory.total 
      ? Math.round((data.memory.free / data.memory.total) * 100) 
      : 0,
    isActive: isConnected && !error,
    lastUpdate: data ? new Date() : null
  }
}
