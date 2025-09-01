/**
 * AGICore REAL-ONLY Test
 * Verifies that the component only works with real data and shows "No data / Missing tool"
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AGICore } from './AGICore'

// Mock fetch for AGI calls
const mockFetch = vi.fn()
global.fetch = mockFetch as any

describe('AGICore REAL-ONLY', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state initially', () => {
    // Mock pending promise to keep loading state
    mockFetch.mockReturnValue(new Promise(() => {}))
    
    render(<AGICore />)
    
    expect(screen.getByText('Loading real AGI metrics...')).toBeDefined()
    expect(screen.getByText('No fake data - waiting for real sources')).toBeDefined()
  })

  it('should show error when AGI service fails', async () => {
    mockFetch.mockRejectedValue(new Error('Service unavailable'))
    
    render(<AGICore />)
    
    await waitFor(() => {
      expect(screen.getByText('AGI Metrics Unavailable')).toBeDefined()
      expect(screen.getByText(/Failed to fetch real AGI metrics/)).toBeDefined()
      expect(screen.getByText('Fix: Configure AGI backend services')).toBeDefined()
    })
  })

  it('should show "No Data / Missing tool" when AGI returns NO_DATA', async () => {
    const mockNoDataResponse = {
      ok: false,
      kind: 'NO_DATA',
      message: 'Neural service unavailable'
    }
    
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockNoDataResponse)
    } as any)
    
    render(<AGICore />)
    
    await waitFor(() => {
      expect(screen.getByText('No Data')).toBeDefined()
      expect(screen.getByText('Missing tool: Neural Monitor')).toBeDefined()
      expect(screen.getByText('Fix: Set NEURAL_SERVICE_URL')).toBeDefined()
    })
  })

  it('should render real data with provenance when available', async () => {
    const mockRealResponse = {
      ok: true,
      data: {
        neuralConnections: 150000,
        provenance: {
          source: 'neural-monitor-v1',
          fetchedAt: new Date().toISOString(),
          ttlSeconds: 60
        }
      }
    }
    
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockRealResponse)
    } as any)
    
    render(<AGICore />)
    
    await waitFor(() => {
      expect(screen.getByText('150,000')).toBeDefined()
      expect(screen.getByText('Source: neural-monitor-v1')).toBeDefined()
      expect(screen.getByText('Neural Connections')).toBeDefined()
    })
  })

  it('should show specific missing tool messages for each metric', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ ok: false, kind: 'NO_DATA' })
    } as any)
    
    render(<AGICore />)
    
    await waitFor(() => {
      // Each metric should show its specific missing tool message
      expect(screen.getByText('Missing tool: Neural Monitor')).toBeDefined()
      expect(screen.getByText('Fix: Set NEURAL_SERVICE_URL')).toBeDefined()
      
      expect(screen.getByText('Missing tool: CPU Monitor')).toBeDefined()
      expect(screen.getByText('Fix: Set SYSTEM_METRICS_URL')).toBeDefined()
      
      expect(screen.getByText('Missing tool: AI Learning Monitor')).toBeDefined()
      expect(screen.getByText('Fix: Set LEARNING_SERVICE_URL')).toBeDefined()
      
      expect(screen.getByText('Missing tool: Latency Monitor')).toBeDefined()
      expect(screen.getByText('Fix: Set NETWORK_MONITOR_URL')).toBeDefined()
    })
  })

  it('should block stale data', async () => {
    const staleResponse = {
      ok: true,
      data: {
        neuralConnections: 100000,
        provenance: {
          source: 'neural-monitor',
          fetchedAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
          ttlSeconds: 60 // TTL expired
        }
      }
    }
    
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(staleResponse)
    } as any)
    
    render(<AGICore />)
    
    await waitFor(() => {
      expect(screen.getByText('Data stale (TTL expired)')).toBeDefined()
    })
  })

  it('should call real AGI endpoints with correct parameters', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ ok: false, kind: 'NO_DATA' })
    } as any)
    
    render(<AGICore />)
    
    await waitFor(() => {
      // Verify all AGI endpoints are called
      expect(mockFetch).toHaveBeenCalledWith('/api/agi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'SYSTEM.NEURAL_CONNECTIONS', args: {} })
      })
      
      expect(mockFetch).toHaveBeenCalledWith('/api/agi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'SYSTEM.PROCESSING_SPEED', args: {} })
      })
      
      expect(mockFetch).toHaveBeenCalledWith('/api/agi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'SYSTEM.LEARNING_RATE', args: {} })
      })
      
      expect(mockFetch).toHaveBeenCalledWith('/api/agi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'SYSTEM.RESPONSE_TIME', args: {} })
      })
    })
  })
})
