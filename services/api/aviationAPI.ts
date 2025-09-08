/**
 * Real Aviation API Service
 * Connects to live aviation data sources
 */

export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  visibility: number
  cloudCoverage: number
  timestamp: string
  location: {
    latitude: number
    longitude: number
    name: string
  }
}

export interface RadioPropagationData {
  frequency: number
  power: number
  propagation: 'excellent' | 'good' | 'fair' | 'poor'
  interference: number
  signalStrength: number
  timestamp: string
  band: string
  conditions: string[]
}

export interface FlightData {
  callsign: string
  altitude: number
  speed: number
  heading: number
  latitude: number
  longitude: number
  status: 'active' | 'landed' | 'emergency' | 'taxiing' | 'takeoff'
  aircraft: string
  origin: string
  destination: string
  timestamp: string
}

class AviationAPI {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_AVIATION_API || 'https://aviation.ultrawebthinking.com'
  }

  /**
   * Get real-time weather data from METAR/TAF sources
   */
  async getWeatherData(icaoCode: string = 'LATI'): Promise<WeatherData> {
    try {
      const response = await fetch(`${this.baseUrl}/weather/${icaoCode}`, {
        headers: {
          'Authorization': `Bearer ${process.env.AVIATION_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Weather API error:', error)
      // Return live fallback data
      return this.getLiveWeatherFallback()
    }
  }

  /**
   * Get real-time radio propagation conditions
   */
  async getRadioPropagation(frequency: number = 121.5): Promise<RadioPropagationData> {
    try {
      const response = await fetch(`${this.baseUrl}/radio-propagation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AVIATION_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ frequency, location: 'LATI' })
      })
      
      if (!response.ok) {
        throw new Error(`Radio API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Radio API error:', error)
      return this.getLiveRadioFallback(frequency)
    }
  }

  /**
   * Get live flight tracking data
   */
  async getFlightData(radius: number = 100): Promise<FlightData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/flights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AVIATION_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          center: { lat: 41.3275, lon: 19.8187 }, // Tirana
          radius 
        })
      })
      
      if (!response.ok) {
        throw new Error(`Flights API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Flights API error:', error)
      return this.getLiveFlightsFallback()
    }
  }

  /**
   * Subscribe to real-time updates via WebSocket
   */
  subscribeToLiveUpdates(callback: (data: any) => void): WebSocket | null {
    try {
      const ws = new WebSocket(process.env.WEBSOCKET_URL || 'wss://ws.ultrawebthinking.com/aviation')
      
      ws.onopen = () => {
        console.log('Aviation WebSocket connected')
        ws.send(JSON.stringify({ 
          action: 'subscribe', 
          channels: ['weather', 'radio', 'flights'] 
        }))
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        callback(data)
      }
      
      ws.onerror = (error) => {
        console.error('Aviation WebSocket error:', error)
      }
      
      return ws
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      return null
    }
  }

  /**
   * Return no data message when real weather is unavailable
   */
  private getLiveWeatherFallback(): WeatherData {
    return {
      temperature: null as any,
      humidity: null as any,
      pressure: null as any,
      windSpeed: null as any,
      windDirection: null as any,
      visibility: null as any,
      cloudCoverage: null as any,
      timestamp: new Date().toISOString(),
      location: {
        latitude: 41.3275,
        longitude: 19.8187,
        name: 'No weather data available - LATI'
      }
    }
  }

  /**
   * Return no data message when real radio propagation is unavailable
   */
  private getLiveRadioFallback(frequency: number): RadioPropagationData {
    return {
      frequency,
      power: null as any,
      propagation: 'poor',
      interference: null as any,
      signalStrength: null as any,
      timestamp: new Date().toISOString(),
      band: 'Unknown',
      conditions: ['No radio data available']
    }
  }

  /**
   * Return no data message when real flight data is unavailable
   */
  private getLiveFlightsFallback(): FlightData[] {
    return [{
      callsign: 'NO_DATA',
      aircraft: 'No flight data available',
      origin: 'N/A',
      destination: 'N/A',
      altitude: null as any,
      speed: null as any,
      heading: null as any,
      latitude: null as any,
      longitude: null as any,
      status: 'active' as const,
      timestamp: new Date().toISOString()
    }]
  }
}

export const aviationAPI = new AviationAPI()
