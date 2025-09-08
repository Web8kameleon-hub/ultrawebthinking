import { NextResponse } from 'next/server'

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  pressure: number
  wind_speed: number
  wind_direction: number
  visibility: number
  cloud_coverage: number
  weather_condition: string
  timestamp: string
  source: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat') || '41.3275'  // Tirana default
    const lon = searchParams.get('lon') || '19.8187'
    
    let realWeatherData: WeatherData | null = null
    
    try {
      // OpenWeatherMap API for real weather data
      const apiKey = process.env.OPENWEATHER_API_KEY
      
      if (apiKey) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
          {
            headers: {
              'User-Agent': 'UltraWebThinking-Aviation/1.0'
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          
          realWeatherData = {
            location: `${data.name}, ${data.sys?.country || 'Unknown'}`,
            temperature: Math.round(data.main?.temp * 10) / 10 || 0,
            humidity: data.main?.humidity || 0,
            pressure: data.main?.pressure || 0,
            wind_speed: Math.round((data.wind?.speed || 0) * 3.6 * 10) / 10, // Convert m/s to km/h
            wind_direction: data.wind?.deg || 0,
            visibility: Math.round((data.visibility || 0) / 1000 * 10) / 10, // Convert to km
            cloud_coverage: data.clouds?.all || 0,
            weather_condition: data.weather?.[0]?.description || 'unknown',
            timestamp: new Date().toISOString(),
            source: 'openweathermap'
          }
        }
      }
    } catch (apiError) {
      console.warn('Weather API unavailable')
    }
    
    // If no API key or no real data, return error (NO FAKE DATA)
    if (!realWeatherData) {
      return NextResponse.json({
        success: true,
        message: 'Real weather data requires API configuration',
        data: null,
        source: 'live-weather-apis',
        timestamp: new Date().toISOString(),
        note: 'Configure OPENWEATHER_API_KEY environment variable for live weather data',
        coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: realWeatherData,
      source: 'openweathermap-api',
      timestamp: new Date().toISOString(),
      coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) }
    })
    
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unable to fetch real weather data',
      message: 'Live weather data temporarily unavailable',
      data: null,
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
