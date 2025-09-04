/**
 * Aviation Weather Health Endpoint - Real Aviation Services Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, requireEnv } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('aviation.health')
    
    const metarUrl = requireEnv('AVIATION_METAR_URL')
    const tafUrl = process.env.AVIATION_TAF_URL
    
    const startTime = Date.now()
    
    // Test METAR data (current weather at airports)
    const metarResponse = await fetch(`${metarUrl}/stations/EGLL/`, { // London Heathrow
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!metarResponse.ok) {
      return NextResponse.json({
        status: 'error',
        service: 'Aviation METAR API',
        error: `METAR API failed: ${metarResponse.statusText}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    // Test TAF data (terminal aerodrome forecast) if configured
    let tafStatus = 'not-configured'
    if (tafUrl) {
      try {
        const tafResponse = await fetch(`${tafUrl}/stations/EGLL/`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        tafStatus = tafResponse.ok ? 'active' : 'degraded'
      } catch {
        tafStatus = 'error'
      }
    }
    
    // Test NOTAM (Notice to Airmen) service if configured
    let notamStatus = 'not-configured'
    if (process.env.AVIATION_NOTAM_URL) {
      try {
        const notamResponse = await fetch(`${process.env.AVIATION_NOTAM_URL}/health`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        notamStatus = notamResponse.ok ? 'active' : 'degraded'
      } catch {
        notamStatus = 'error'
      }
    }
    
    return NextResponse.json({
      status: 'active',
      service: 'Aviation Weather Systems',
      providers: {
        metarData: 'active',
        tafForecast: tafStatus,
        notamService: notamStatus
      },
      timestamp: new Date().toISOString(),
      responseTime,
      metrics: {
        airportWeather: true,
        flightConditions: true,
        windData: true,
        visibility: true
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'Aviation Weather',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
