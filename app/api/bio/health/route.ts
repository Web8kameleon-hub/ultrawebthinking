/**
 * AGI Bio Nature Health Endpoint - Real Environmental Services Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, requireEnv } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('agi-bio.health')
    
    const airQualityApi = requireEnv('AIR_QUALITY_API')
    
    const startTime = Date.now()
    
    // Test Air Quality API (IQAir or similar)
    const aqResponse = await fetch(`${airQualityApi}/nearest_city?key=${process.env.AIR_QUALITY_KEY}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!aqResponse.ok) {
      return NextResponse.json({
        status: 'error',
        service: 'AGI Bio Air Quality API',
        error: `Air Quality API failed: ${aqResponse.statusText}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    // Test Weather API if configured
    let weatherStatus = 'not-configured'
    if (process.env.WEATHER_API_KEY) {
      try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.WEATHER_API_KEY}`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        weatherStatus = weatherResponse.ok ? 'active' : 'degraded'
      } catch {
        weatherStatus = 'error'
      }
    }
    
    // Test Biodiversity API if configured
    let biodiversityStatus = 'not-configured'
    if (process.env.GBIF_API_URL) {
      try {
        const gbifResponse = await fetch(`${process.env.GBIF_API_URL}/species/search?q=Panthera`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        biodiversityStatus = gbifResponse.ok ? 'active' : 'degraded'
      } catch {
        biodiversityStatus = 'error'
      }
    }
    
    // Test Environmental Sensors if configured
    let sensorStatus = 'not-configured'
    if (process.env.ENV_SENSORS_URL) {
      try {
        const sensorResponse = await fetch(`${process.env.ENV_SENSORS_URL}/status`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        sensorStatus = sensorResponse.ok ? 'active' : 'degraded'
      } catch {
        sensorStatus = 'error'
      }
    }
    
    return NextResponse.json({
      status: 'active',
      service: 'AGI Bio Nature Systems',
      providers: {
        airQuality: 'active',
        weather: weatherStatus,
        biodiversity: biodiversityStatus,
        envSensors: sensorStatus
      },
      timestamp: new Date().toISOString(),
      responseTime,
      metrics: {
        airQualityIndex: true,
        climateData: true,
        ecosystemHealth: true,
        speciesTracking: true
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'AGI Bio Nature',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
