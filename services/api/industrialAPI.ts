/**
 * Real Industrial IoT API Service
 * Connects to live industrial sensors and machines
 */

export interface SensorData {
  id: string
  name: string
  type: 'temperature' | 'pressure' | 'humidity' | 'vibration' | 'flow' | 'level'
  value: number
  unit: string
  status: 'normal' | 'warning' | 'critical'
  location: string
  timestamp: string
  thresholds: {
    min: number
    max: number
    warning: number
    critical: number
  }
}

export interface MachineData {
  id: string
  name: string
  type: string
  status: 'running' | 'stopped' | 'maintenance' | 'error'
  efficiency: number
  powerConsumption: number
  operatingHours: number
  temperature: number
  vibration: number
  lastMaintenance: string
  nextMaintenance: string
  timestamp: string
}

export interface ProductionMetrics {
  totalProduction: number
  efficiency: number
  downtime: number
  quality: number
  energyConsumption: number
  timestamp: string
}

class IndustrialAPI {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_INDUSTRIAL_API || 'https://industrial.ultrawebthinking.com'
  }

  /**
   * Get real-time sensor data from industrial IoT network
   */
  async getSensorData(): Promise<SensorData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sensors`, {
        headers: {
          'Authorization': `Bearer ${process.env.INDUSTRIAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Sensors API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Sensors API error:', error)
      return this.getLiveSensorsFallback()
    }
  }

  /**
   * Get real-time machine status and metrics
   */
  async getMachineData(): Promise<MachineData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/machines`, {
        headers: {
          'Authorization': `Bearer ${process.env.INDUSTRIAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Machines API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Machines API error:', error)
      return this.getLiveMachinesFallback()
    }
  }

  /**
   * Get production metrics and KPIs
   */
  async getProductionMetrics(): Promise<ProductionMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/production/metrics`, {
        headers: {
          'Authorization': `Bearer ${process.env.INDUSTRIAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Production API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Production API error:', error)
      return this.getLiveProductionFallback()
    }
  }

  /**
   * Send machine control command
   */
  async controlMachine(machineId: string, command: 'start' | 'stop' | 'reset' | 'maintenance'): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/machines/${machineId}/control`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.INDUSTRIAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command, timestamp: new Date().toISOString() })
      })
      
      return response.ok
    } catch (error) {
      console.error('Machine control error:', error)
      return false
    }
  }

  /**
   * Subscribe to real-time industrial data
   */
  subscribeToLiveUpdates(callback: (data: any) => void): WebSocket | null {
    try {
      const ws = new WebSocket(process.env.WEBSOCKET_URL || 'wss://ws.ultrawebthinking.com/industrial')
      
      ws.onopen = () => {
        console.log('Industrial WebSocket connected')
        ws.send(JSON.stringify({ 
          action: 'subscribe', 
          channels: ['sensors', 'machines', 'production'] 
        }))
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        callback(data)
      }
      
      ws.onerror = (error) => {
        console.error('Industrial WebSocket error:', error)
      }
      
      return ws
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      return null
    }
  }

  /**
   * Live sensors fallback - returns no data when API unavailable
   */
  private getLiveSensorsFallback(): SensorData[] {
    // Return empty array when real sensor API is unavailable
    return []
  }

  /**
   * Live machines fallback - returns no data when API unavailable
   */
  private getLiveMachinesFallback(): MachineData[] {
    // Return empty array when real machine API is unavailable
    return []
  }

  /**
   * Live production metrics fallback - returns null when API unavailable
   */
  private getLiveProductionFallback(): ProductionMetrics {
    // Return null data when real production API is unavailable
    return {
      totalProduction: 0,
      efficiency: 0,
      downtime: 0,
      quality: 0,
      energyConsumption: 0,
      timestamp: new Date().toISOString()
    }
}
}

export const industrialAPI = new IndustrialAPI()
