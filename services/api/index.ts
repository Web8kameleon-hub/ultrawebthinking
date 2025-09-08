/**
 * Real API Services Index
 * Export all production-ready API services
 */

import { aviationAPI } from './aviationAPI'
import type { FlightData, WeatherData } from './aviationAPI'

import { industrialAPI } from './industrialAPI'
import type { SensorData, MachineData, ProductionMetrics } from './industrialAPI'

import { searchAPI } from './searchAPI'
import type { SearchResult, SearchResponse, SearchQuery } from './searchAPI'

import { uutAPI } from './uutAPI'
import type { TestCase, TestResult, UUTSession, TestEquipment } from './uutAPI'

import { loraAPI } from './loraAPI'
import type { LoRaDevice, LoRaGateway, LoRaMessage, NetworkStats } from './loraAPI'

import { meshAPI } from './meshAPI'
import type { MeshNode, MeshMessage, NetworkTopology, MeshNetworkStats } from './meshAPI'

import { openMindAPI } from './openMindAPI'
import type { OpenMindQuery, AGIResponse, ThoughtProcess, ConsciousnessState, MindSession } from './openMindAPI'

import { agisheetAPI } from './agisheetAPI'
import type { AGISheet, AGICell, AGIAnalysis, AGIModel } from './agisheetAPI'

// Re-export APIs and types
export { aviationAPI }
export type { FlightData, WeatherData }

export { industrialAPI }
export type { SensorData, MachineData, ProductionMetrics }

export { searchAPI }
export type { SearchResult, SearchResponse, SearchQuery }

export { uutAPI }
export type { TestCase, TestResult, UUTSession, TestEquipment }

export { loraAPI }
export type { LoRaDevice, LoRaGateway, LoRaMessage, NetworkStats }

export { meshAPI }
export type { MeshNode, MeshMessage, NetworkTopology, MeshNetworkStats }

export { openMindAPI }
export type { OpenMindQuery, AGIResponse, ThoughtProcess, ConsciousnessState, MindSession }

export { agisheetAPI }
export type { AGISheet, AGICell, AGIAnalysis, AGIModel }

/**
 * Combined API client for all services
 */
export class UltraWebAPI {
  public aviation = aviationAPI
  public industrial = industrialAPI
  public uut = uutAPI
  public lora = loraAPI
  public mesh = meshAPI
  public openMind = openMindAPI
  public agisheet = agisheetAPI

  /**
   * Check if all APIs are available
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const services = ['aviation', 'industrial', 'uut', 'lora', 'mesh', 'agisheet']
    const health: Record<string, boolean> = {}

    await Promise.allSettled(
      services.map(async (service) => {
        try {
          const baseUrl = process.env[`NEXT_PUBLIC_${service.toUpperCase()}_API`]
          if (!baseUrl) {
            health[service] = false
            return
          }

          const response = await fetch(`${baseUrl}/health`, {
            method: 'GET'
          })
          
          health[service] = response.ok
        } catch (error) {
          console.warn(`${service} API health check failed:`, error)
          health[service] = false
        }
      })
    )

    return health
  }

  /**
   * Get system status for all services
   */
  async getSystemStatus() {
    const health = await this.healthCheck()
    const totalServices = Object.keys(health).length
    const activeServices = Object.values(health).filter(Boolean).length
    
    return {
      overall: activeServices === totalServices ? 'healthy' : activeServices > 0 ? 'degraded' : 'critical',
      services: health,
      availability: Math.round((activeServices / totalServices) * 100),
      timestamp: new Date().toISOString()
    }
  }
}

export const ultraWebAPI = new UltraWebAPI()
