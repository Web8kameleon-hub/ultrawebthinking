/**
 * System Memory Health Endpoint - Real Memory Metrics Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('system.memory')
    
    const startTime = Date.now()
    
    // Get real memory usage (when available in runtime)
    let memoryData = null
    if (typeof process !== 'undefined' && process.memoryUsage) {
      memoryData = process.memoryUsage()
    }
    
    const responseTime = Date.now() - startTime
    
    // Calculate memory status
    let status = 'active'
    let memoryUsagePercent = 0
    
    if (memoryData) {
      const totalHeap = memoryData.heapTotal
      const usedHeap = memoryData.heapUsed
      memoryUsagePercent = Math.round((usedHeap / totalHeap) * 100)
      
      if (memoryUsagePercent > 90) {
        status = 'error'
      } else if (memoryUsagePercent > 75) {
        status = 'degraded'
      }
    }
    
    return NextResponse.json({
      status,
      service: 'System Memory Monitor',
      metrics: {
        responseTime,
        memoryUsage: memoryUsagePercent,
        memoryData: memoryData ? {
          heapUsed: Math.round(memoryData.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memoryData.heapTotal / 1024 / 1024), // MB
          external: Math.round(memoryData.external / 1024 / 1024), // MB
          rss: Math.round(memoryData.rss / 1024 / 1024) // MB
        } : null,
        performanceMemory: (performance as any).memory ? {
          usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024), // MB
          totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024), // MB
          jsHeapSizeLimit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024) // MB
        } : null
      },
      timestamp: new Date().toISOString(),
      realMetrics: true
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'System Memory',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
