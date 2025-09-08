import { NextResponse } from 'next/server'

interface SatelliteData {
  name: string
  norad_id: number
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: 'visible' | 'eclipsed' | 'daylight'
  footprint_radius: number
  orbit_type: string
  timestamp: string
}

export async function GET() {
  try {
    const realSatelliteData: SatelliteData[] = []
    
    try {
      // N2YO.com API for real satellite tracking
      // Free API with registration - tracks ISS, weather satellites, etc.
      const satelliteIds = [
        25544, // International Space Station (ISS)
        33591, // NOAA-18 Weather Satellite
        28654, // NOAA-19 Weather Satellite
        43013, // NOAA-20 Weather Satellite
        37849, // METOP-B Weather Satellite
      ]
      
      const lat = 41.3275 // Tirana coordinates for satellite visibility
      const lng = 19.8187
      const altitude = 0
      const days = 1
      const minElevation = 0
      
      // Note: This requires API key from N2YO.com
      // For production, add API key to environment variables
      const apiKey = process.env.N2YO_API_KEY
      
      if (apiKey) {
        for (const satId of satelliteIds) {
          try {
            const response = await fetch(
              `https://api.n2yo.com/rest/v1/satellite/positions/${satId}/${lat}/${lng}/${altitude}/2/&apiKey=${apiKey}`,
              {
                headers: {
                  'User-Agent': 'UltraWebThinking-Aviation/1.0'
                }
              }
            )
            
            if (response.ok) {
              const data = await response.json()
              
              if (data.positions && data.positions.length > 0) {
                const pos = data.positions[0]
                realSatelliteData.push({
                  name: data.info?.satname || `SAT-${satId}`,
                  norad_id: satId,
                  latitude: parseFloat(pos.satlatitude?.toFixed(6)) || 0,
                  longitude: parseFloat(pos.satlongitude?.toFixed(6)) || 0,
                  altitude: Math.round(pos.sataltitude) || 0,
                  velocity: Math.round(data.info?.velocity) || 0,
                  visibility: pos.eclipsed ? 'eclipsed' : 'visible',
                  footprint_radius: Math.round(Math.sqrt(pos.sataltitude * 12.74)) || 0,
                  orbit_type: data.info?.launchyear > 2010 ? 'Modern LEO' : 'Legacy',
                  timestamp: new Date().toISOString()
                })
              }
            }
          } catch (satError) {
            console.warn(`Satellite ${satId} data unavailable`)
          }
        }
      }
    } catch (apiError) {
      console.warn('Satellite API unavailable')
    }
    
    // If no API key or no real data, return empty (NO FAKE DATA)
    if (realSatelliteData.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Real satellite tracking requires API configuration',
        data: [],
        source: 'live-satellite-apis',
        timestamp: new Date().toISOString(),
        note: 'Configure N2YO_API_KEY environment variable for live satellite data',
        coverage_area: {
          center: { lat: 41.3275, lng: 19.8187 },
          name: 'Albania/Kosovo Region'
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: realSatelliteData,
      count: realSatelliteData.length,
      source: 'n2yo-satellite-api',
      timestamp: new Date().toISOString(),
      coverage_area: {
        center: { lat: 41.3275, lng: 19.8187 },
        name: 'Albania/Kosovo Region'
      }
    })
    
  } catch (error) {
    console.error('Satellite tracking API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unable to fetch real satellite data',
      message: 'Live satellite tracking temporarily unavailable',
      data: [],
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
