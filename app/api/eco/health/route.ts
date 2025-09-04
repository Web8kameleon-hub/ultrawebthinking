/**
 * AGI Eco Health Endpoint - Real Energy Services Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, requireEnv } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('agi-eco.health')
    
    const energyGateway = requireEnv('ENERGY_GATEWAY_URL')
    const entsoeKey = requireEnv('ENTSO_E_API_KEY')
    
    const startTime = Date.now()
    
    // Test ENTSO-E European Energy Data API
    const entsoeUrl = `https://web-api.tp.entsoe.eu/api?securityToken=${entsoeKey}&documentType=A44&in_Domain=10YCZ-CEPS-----N&periodStart=202412100000&periodEnd=202412110000`
    
    const entsoeResponse = await fetch(entsoeUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!entsoeResponse.ok) {
      return NextResponse.json({
        status: 'error',
        service: 'AGI Eco ENTSO-E',
        error: `ENTSO-E API failed: ${entsoeResponse.statusText}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    // Test Energy Gateway MQTT/WebSocket
    let gatewayStatus = 'unknown'
    try {
      const gatewayResponse = await fetch(`${energyGateway}/status`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000)
      })
      gatewayStatus = gatewayResponse.ok ? 'active' : 'degraded'
    } catch {
      gatewayStatus = 'error'
    }
    
    return NextResponse.json({
      status: 'active',
      service: 'AGI Eco Energy Systems',
      providers: {
        entsoe: 'active',
        energyGateway: gatewayStatus
      },
      timestamp: new Date().toISOString(),
      responseTime,
      metrics: {
        gridData: true,
        renewableTracking: true,
        carbonFootprint: true,
        realTimeMonitoring: true
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'AGI Eco',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
