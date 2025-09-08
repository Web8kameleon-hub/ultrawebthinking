import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const memoryUsage = process.memoryUsage()
    
    const memoryData = {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024),
      rss: Math.round(memoryUsage.rss / 1024 / 1024)
    }

    return NextResponse.json({
      status: memoryData.heapUsed > 400 ? 'error' : 'ok',
      service: 'System Memory Monitor',
      metrics: {
        responseTime: 0,
        memoryUsage: Math.round((memoryData.heapUsed / memoryData.heapTotal) * 100),
        memoryData,
        performanceMemory: null
      },
      timestamp: new Date().toISOString(),
      realMetrics: true
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'System Memory Monitor',
      error: 'Memory metrics unavailable',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
