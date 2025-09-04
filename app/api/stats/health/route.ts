/**
 * AGI Statistics Health Endpoint - Real Analytics Services Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, requireEnv } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('agi-stats.health')
    
    const dbUrl = requireEnv('DB_URL')
    const searchEngine = process.env.SEARCH_ENGINE_URL
    
    const startTime = Date.now()
    
    // Test Analytics Database Connection
    const analyticsQuery = `SELECT COUNT(*) as record_count, MAX(timestamp) as latest_record FROM analytics_data LIMIT 1`
    
    const dbResponse = await fetch(`${dbUrl}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: analyticsQuery }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!dbResponse.ok) {
      return NextResponse.json({
        status: 'error',
        service: 'AGI Statistics Database',
        error: `Analytics DB failed: ${dbResponse.statusText}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    // Test Search Engine (Meilisearch/OpenSearch) if configured
    let searchStatus = 'not-configured'
    if (searchEngine) {
      try {
        const searchResponse = await fetch(`${searchEngine}/health`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        searchStatus = searchResponse.ok ? 'active' : 'degraded'
      } catch {
        searchStatus = 'error'
      }
    }
    
    // Test Time Series Analytics if configured
    let timeseriesStatus = 'not-configured'
    if (process.env.TIMESERIES_DB) {
      try {
        const tsResponse = await fetch(`${process.env.TIMESERIES_DB}/api/v1/query?query=up`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        timeseriesStatus = tsResponse.ok ? 'active' : 'degraded'
      } catch {
        timeseriesStatus = 'error'
      }
    }
    
    // Test Real-time Analytics Stream if configured
    let streamStatus = 'not-configured'
    if (process.env.KAFKA_BROKERS || process.env.NATS_URL) {
      try {
        const streamEndpoint = process.env.ANALYTICS_STREAM_URL || `${process.env.NATS_URL}/status`
        const streamResponse = await fetch(streamEndpoint, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        streamStatus = streamResponse.ok ? 'active' : 'degraded'
      } catch {
        streamStatus = 'error'
      }
    }
    
    return NextResponse.json({
      status: 'active',
      service: 'AGI Statistics Analytics',
      providers: {
        analyticsDb: 'active',
        searchEngine: searchStatus,
        timeseries: timeseriesStatus,
        realTimeStream: streamStatus
      },
      timestamp: new Date().toISOString(),
      responseTime,
      metrics: {
        dataIngestion: true,
        realTimeAnalytics: true,
        historicalTrends: true,
        predictiveModels: true
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'AGI Statistics',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
