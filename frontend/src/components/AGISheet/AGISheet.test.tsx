/**
 * AGISheet REAL-ONLY Test
 * Verifies that the component only works with real data and provenance
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AGISheet from './AGISheet'

// Real data source
const mockFetch = jest.fn()
global.fetch = mockFetch as any

describe('AGISheet REAL-ONLY', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render fake data without provenance', () => {
    render(<AGISheet initialData={[]} />)
    
    // Should not show any hardcoded values
    expect(screen.queryByText('42')).toBeNull()
    expect(screen.queryByText('sample')).toBeNull()
    expect(screen.queryByText('demo')).toBeNull()
  })

  it('should render real data with provenance', () => {
    const realData = [{
      value: {
        data: 'Real Value',
        provenance: {
          source: 'test-source',
          fetchedAt: new Date().toISOString(),
          ttlSeconds: 300
        }
      },
      type: 'text'
    }]

    render(<AGISheet initialData={realData} />)
    expect(screen.getByDisplayValue('Real Value')).toBeDefined()
  })

  it('should block stale data', () => {
    const staleData = [{
      value: {
        data: 'Stale Value',
        provenance: {
          source: 'test-source',
          fetchedAt: new Date(Date.now() - 10000).toISOString(), // 10 seconds ago
          ttlSeconds: 5 // TTL expired
        }
      },
      type: 'text'
    }]

    render(<AGISheet initialData={staleData} />)
    expect(screen.getByText('Data stale (TTL expired)')).toBeDefined()
  })

  it('should call real AGI service for agi: commands', async () => {
    const mockResponse = {
      ok: true,
      data: {
        value: 'AGI Response',
        provenance: {
          source: 'agi-service',
          fetchedAt: new Date().toISOString(),
          ttlSeconds: 60
        }
      }
    }

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse)
    } as any)

    render(<AGISheet enableAGI={true} />)
    
    const cellInput = screen.getBydefaultValueText('A1')
    fireEvent.change(cellInput, { target: { value: 'agi:test command' } })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/agi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          kind: 'CELL.PROCESS', 
          args: { command: 'test command', cellId: 'A1' } 
        })
      })
    })
  })

  it('should show error for failed AGI calls', async () => {
    const mockError = {
      ok: false,
      kind: 'NO_DATA',
      message: 'AGI service unavailable'
    }

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockError)
    } as any)

    render(<AGISheet enableAGI={true} />)
    
    const cellInput = screen.getBydefaultValueText('A1')
    fireEvent.change(cellInput, { target: { value: 'agi:test' } })

    await waitFor(() => {
      const errorElement = screen.getByTitle('AGI Error: AGI service unavailable')
      expect(errorElement).toBeDefined()
    })
  })
})
