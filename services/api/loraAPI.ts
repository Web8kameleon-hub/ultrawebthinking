/**
 * Real LoRa Gateway API Service
 * Connects to live LoRaWAN gateways and devices
 */

export interface LoRaDevice {
  id: string
  devEUI: string
  name: string
  applicationId: string
  deviceProfileId: string
  status: 'active' | 'inactive' | 'offline' | 'unknown'
  batteryLevel?: number
  lastSeenAt: string
  location?: {
    latitude: number
    longitude: number
    altitude: number
  }
  tags: Record<string, string>
  variables: Record<string, any>
  timestamp: string
}

export interface LoRaGateway {
  id: string
  gatewayId: string
  name: string
  description: string
  location: {
    latitude: number
    longitude: number
    altitude: number
  }
  frequency: string
  status: 'online' | 'offline' | 'maintenance'
  connectedDevices: number
  uptime: number
  lastSeenAt: string
  metadata: {
    platform: string
    hal: string
    antenna: number
  }
  timestamp: string
}

export interface LoRaMessage {
  id: string
  deviceId: string
  gatewayId: string
  fPort: number
  fCnt: number
  confirmed: boolean
  data: string
  object?: Record<string, any>
  rxInfo: {
    gatewayId: string
    rssi: number
    snr: number
    channel: number
    rfChain: number
    location: {
      latitude: number
      longitude: number
      altitude: number
    }
  }[]
  txInfo: {
    frequency: number
    power: number
    modulation: string
    dataRate: string
  }
  timestamp: string
}

export interface NetworkStats {
  totalGateways: number
  onlineGateways: number
  totalDevices: number
  activeDevices: number
  messagesPerHour: number
  averageRSSI: number
  averageSNR: number
  packetLossRate: number
  timestamp: string
}

class LoRaAPI {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_LORA_API || 'https://lora.ultrawebthinking.com'
  }

  /**
   * Get all LoRa gateways
   */
  async getGateways(): Promise<LoRaGateway[]> {
    try {
      const response = await fetch(`${this.baseUrl}/gateways`, {
        headers: {
          'Authorization': `Bearer ${process.env.LORA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Gateways API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Gateways API error:', error)
      return this.getLiveGatewaysFallback()
    }
  }

  /**
   * Get all LoRa devices
   */
  async getDevices(): Promise<LoRaDevice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/devices`, {
        headers: {
          'Authorization': `Bearer ${process.env.LORA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Devices API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Devices API error:', error)
      return this.getLiveDevicesFallback()
    }
  }

  /**
   * Get recent LoRa messages
   */
  async getMessages(limit: number = 50): Promise<LoRaMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/messages?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${process.env.LORA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Messages API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Messages API error:', error)
      return this.getLiveMessagesFallback(limit)
    }
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const response = await fetch(`${this.baseUrl}/network/stats`, {
        headers: {
          'Authorization': `Bearer ${process.env.LORA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Network stats API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Network stats API error:', error)
      return this.getLiveNetworkStatsFallback()
    }
  }

  /**
   * Send downlink message to device
   */
  async sendDownlink(deviceId: string, fPort: number, data: string, confirmed: boolean = false): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/devices/${deviceId}/downlink`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LORA_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fPort,
          data,
          confirmed,
          timestamp: new Date().toISOString()
        })
      })
      
      return response.ok
    } catch (error) {
      console.error('Send downlink error:', error)
      return false
    }
  }

  /**
   * Subscribe to real-time LoRa events
   */
  subscribeToLoRaEvents(callback: (data: any) => void): WebSocket | null {
    try {
      const ws = new WebSocket(process.env.WEBSOCKET_URL || 'wss://ws.ultrawebthinking.com/lora')
      
      ws.onopen = () => {
        console.log('LoRa WebSocket connected')
        ws.send(JSON.stringify({ 
          action: 'subscribe', 
          channels: ['uplink', 'join', 'status'] 
        }))
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        callback(data)
      }
      
      ws.onerror = (error) => {
        console.error('LoRa WebSocket error:', error)
      }
      
      return ws
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      return null
    }
  }

  /**
   * Live gateways fallback - returns no data when API unavailable
   */
  private getLiveGatewaysFallback(): LoRaGateway[] {
    // Return empty array when real LoRa gateway API is unavailable
    return []
  }

  /**
   * Live devices fallback - returns no data when API unavailable
   */
  private getLiveDevicesFallback(): LoRaDevice[] {
    // Return empty array when real LoRa device API is unavailable
    return []
  }

  /**
   * Live messages fallback - returns no data when API unavailable
   */
  private getLiveMessagesFallback(limit: number): LoRaMessage[] {
    // Return empty array when real LoRa message API is unavailable
    return []
  }

  /**
   * Live network stats fallback - returns zero data when API unavailable
   */
  private getLiveNetworkStatsFallback(): NetworkStats {
    // Return zero stats when real network stats API is unavailable
    return {
      totalGateways: 0,
      onlineGateways: 0,
      totalDevices: 0,
      activeDevices: 0,
      messagesPerHour: 0,
      averageRSSI: 0,
      averageSNR: 0,
      packetLossRate: 0,
      timestamp: new Date().toISOString()
    }
  }

  private generateDeviceVariables(deviceType: string): Record<string, any> {
    // Return empty object when device variables API is unavailable
    return {}
  }

  private generateSensorData(): number[] {
    // Return empty array when sensor data API is unavailable
    return []
  }

  private generateMessageObject(): Record<string, any> {
    // Return empty object when message object API is unavailable
    return {}
  }
}

export const loraAPI = new LoRaAPI()
