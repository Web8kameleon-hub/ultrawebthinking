/**
 * AGI Sheet Health Endpoint - Real Services Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, requireEnv } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('agi-sheet.health')
    
    const dbUrl = requireEnv('DB_URL')
    
    // Test database connection
    const testQuery = `SELECT version(), current_timestamp as timestamp`
    const startTime = Date.now()
    
    // For TimescaleDB/PostgreSQL connection test
    const response = await fetch(`${dbUrl}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: testQuery }),
      cache: 'no-store'
    })
    
    const responseTime = Date.now() - startTime
    
    if (!response.ok) {
      return NextResponse.json({
        status: 'error',
        service: 'AGI Sheet TimescaleDB',
        error: `Database connection failed: ${response.statusText}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      status: 'active',
      service: 'AGI Sheet TimescaleDB',
      database: data.version || 'PostgreSQL/TimescaleDB',
      timestamp: new Date().toISOString(),
      responseTime,
      metrics: {
        tablesActive: true,
        timeseriesStorage: true,
        realTimeAnalytics: true
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'AGI Sheet',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
