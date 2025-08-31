/**
 * AGI Memory API - Real System Memory Monitoring
 * Returns real memory blocks and metrics for industrial monitoring
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import os from 'os'
import process from 'process'

interface MemoryBlock {
  id: string
  label: string
  value: number
  timestamp: string
  type: 'core' | 'neural' | 'quantum' | 'cache' | 'buffer'
  status: 'active' | 'idle' | 'critical' | 'optimizing'
}

interface MemoryMetrics {
  totalMemory: number
  usedMemory: number
  freeMemory: number
  cacheMemory: number
  bufferMemory: number
  uptime: string
  allocations: number
  deallocations: number
}

export async function GET(request: NextRequest) {
  try {
    // Real system memory from Node.js
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    const uptime = Math.floor(os.uptime())
    
    // Process memory (Node.js heap)
    const memUsage = process.memoryUsage()
    
    // Log for debugging extreme values
    const externalMB = memUsage.external / (1024 * 1024)
    if (externalMB > 500) {
      console.warn(`[AGI Memory] High external memory usage: ${externalMB.toFixed(1)}MB`)
    }
    
    // Calculate normalized percentages with safety clamps
    const safePercentage = (value: number, base: number): number => {
      const percentage = (value / base) * 100
      return Math.min(100, Math.max(0, percentage)) // Clamp between 0-100%
    }
    
    // Calculate real memory blocks
    const blocks: MemoryBlock[] = [
      {
        id: 'system-total',
        label: 'System Memory',
        value: safePercentage(usedMemory, totalMemory),
        timestamp: new Date().toISOString(),
        type: 'core',
        status: usedMemory / totalMemory > 0.8 ? 'critical' : 'active'
      },
      {
        id: 'node-heap-used',
        label: 'Node.js Heap Used',
        value: safePercentage(memUsage.heapUsed, memUsage.heapTotal),
        timestamp: new Date().toISOString(),
        type: 'neural',
        status: memUsage.heapUsed / memUsage.heapTotal > 0.9 ? 'critical' : 'active'
      },
      {
        id: 'node-heap-total',
        label: 'Node.js Heap Total',
        value: safePercentage(memUsage.heapTotal, totalMemory),
        timestamp: new Date().toISOString(),
        type: 'cache',
        status: 'active'
      },
      {
        id: 'rss-memory',
        label: 'RSS Memory',
        value: safePercentage(memUsage.rss, totalMemory),
        timestamp: new Date().toISOString(),
        type: 'buffer',
        status: 'active'
      },
      {
        id: 'external-memory',
        label: `External Memory (${(memUsage.external / (1024 * 1024)).toFixed(1)}MB)`,
        value: safePercentage(memUsage.external, totalMemory),
        timestamp: new Date().toISOString(),
        type: 'quantum',
        status: memUsage.external > 100 * 1024 * 1024 ? 'optimizing' : 'active'
      }
    ]

    // Real metrics
    const metrics: MemoryMetrics = {
      totalMemory,
      usedMemory,
      freeMemory,
      cacheMemory: memUsage.heapTotal - memUsage.heapUsed,
      bufferMemory: memUsage.external,
      uptime: formatUptime(uptime),
      allocations: Math.floor(memUsage.heapUsed / 1024), // Approximation
      deallocations: Math.floor((memUsage.heapTotal - memUsage.heapUsed) / 1024)
    }

    console.log(`[AGI Memory] Returning real system memory: ${formatBytes(usedMemory)}/${formatBytes(totalMemory)} (${((usedMemory/totalMemory)*100).toFixed(1)}%)`)

    return NextResponse.json({
      success: true,
      blocks,
      metrics,
      timestamp: new Date().toISOString(),
      source: 'real-system'
    })

  } catch (error) {
    console.error('[AGI Memory] Error fetching system memory:', error)
    
    // Fallback to mock data if system memory fails
    const fallbackBlocks: MemoryBlock[] = [
      {
        id: 'fallback-core',
        label: 'Core Memory (Fallback)',
        value: 65.3,
        timestamp: new Date().toISOString(),
        type: 'core',
        status: 'active'
      }
    ]

    const fallbackMetrics: MemoryMetrics = {
      totalMemory: 8589934592, // 8GB fallback
      usedMemory: 5610725376,   // ~65%
      freeMemory: 2979209216,
      cacheMemory: 524288000,
      bufferMemory: 104857600,
      uptime: '12h 34m',
      allocations: 1247,
      deallocations: 892
    }

    return NextResponse.json({
      success: true,
      blocks: fallbackBlocks,
      metrics: fallbackMetrics,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: 'System memory unavailable'
    })
  }
}

// Helper functions
function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
