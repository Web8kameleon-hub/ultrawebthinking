/**
 * EuroWeb Ultra - Station Location Configuration System
 * Core system for configurable station locations
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 2.0.0
 * @license MIT
 * @created August 25, 2025
 */

export interface StationLocation {
  id: string
  name: string
  nameAl: string
  coordinates: {
    latitude: number
    longitude: number
    altitude?: number
  }
  type: 'primary' | 'backup' | 'mobile' | 'custom'
  coverage: {
    radius: number // in kilometers
    capabilities: ('LoRa' | 'WiFi' | 'Ethernet' | 'Satellite')[]
  }
  power: {
    type: 'grid' | 'solar' | 'battery' | 'hybrid'
    backup: boolean
  }
  priority: number // 1-10, higher is better
  status: 'active' | 'inactive' | 'maintenance'
  lastUpdated: Date
}

export interface GPSData {
  latitude: number
  longitude: number
  altitude?: number
  accuracy: number
  timestamp: Date
  speed?: number
  heading?: number
}

export interface StationLocationConfig {
  currentStation: string
  autoSelect: boolean
  gpsEnabled: boolean
  customLocation?: StationLocation
  fallbackSequence: string[]
  updateInterval: number // seconds
  minDistanceChange: number // meters
}

// Predefined station locations across Albania
export const PREDEFINED_STATIONS: StationLocation[] = [
  {
    id: 'tirana-central',
    name: 'Tirana Central Hub',
    nameAl: 'Qendra Kryesore Tirana',
    coordinates: {
      latitude: 41.3275,
      longitude: 19.8187,
      altitude: 110
    },
    type: 'primary',
    coverage: {
      radius: 50,
      capabilities: ['LoRa', 'WiFi', 'Ethernet', 'Satellite']
    },
    power: {
      type: 'hybrid',
      backup: true
    },
    priority: 10,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'durres-port',
    name: 'Durrës Port Station',
    nameAl: 'Stacioni i Portit Durrës',
    coordinates: {
      latitude: 41.3181,
      longitude: 19.4564,
      altitude: 5
    },
    type: 'primary',
    coverage: {
      radius: 30,
      capabilities: ['LoRa', 'WiFi', 'Ethernet', 'Satellite']
    },
    power: {
      type: 'grid',
      backup: true
    },
    priority: 9,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'shkoder-north',
    name: 'Shkodër Northern Gateway',
    nameAl: 'Porta Veriore Shkodër',
    coordinates: {
      latitude: 42.0687,
      longitude: 19.5126,
      altitude: 80
    },
    type: 'primary',
    coverage: {
      radius: 40,
      capabilities: ['LoRa', 'WiFi', 'Satellite']
    },
    power: {
      type: 'solar',
      backup: true
    },
    priority: 8,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'vlore-south',
    name: 'Vlorë Southern Hub',
    nameAl: 'Qendra Jugore Vlorë',
    coordinates: {
      latitude: 40.4686,
      longitude: 19.4815,
      altitude: 20
    },
    type: 'backup',
    coverage: {
      radius: 25,
      capabilities: ['LoRa', 'WiFi']
    },
    power: {
      type: 'battery',
      backup: false
    },
    priority: 6,
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: 'mobile-alpha',
    name: 'Mobile Unit Alpha',
    nameAl: 'Njësia Mobile Alfa',
    coordinates: {
      latitude: 41.0000, // Dynamic GPS
      longitude: 20.0000,
      altitude: 0
    },
    type: 'mobile',
    coverage: {
      radius: 15,
      capabilities: ['LoRa', 'WiFi']
    },
    power: {
      type: 'battery',
      backup: false
    },
    priority: 5,
    status: 'active',
    lastUpdated: new Date()
  }
]

export class StationLocationManager {
  private config: StationLocationConfig
  private stations: Map<string, StationLocation>
  private gpsWatcher: number | null = null
  private currentGPS: GPSData | null = null
  private eventListeners: Map<string, Function[]> = new Map()

  constructor() {
    this.config = {
      currentStation: 'tirana-central',
      autoSelect: false,
      gpsEnabled: false,
      fallbackSequence: ['tirana-central', 'durres-port', 'shkoder-north', 'vlore-south'],
      updateInterval: 30,
      minDistanceChange: 100
    }

    this.stations = new Map()
    PREDEFINED_STATIONS.forEach(station => {
      this.stations.set(station.id, station)
    })

    this.addEventListener('locationChanged', this.handleLocationChange.bind(this))
  }

  // Event management
  addEventListener(event: string, listener: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(listener)
  }

  removeEventListener(event: string, listener: Function) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => listener(data))
    }
  }

  // Station management
  async setStationLocation(stationId: string): Promise<boolean> {
    const station = this.stations.get(stationId)
    if (!station || station.status !== 'active') {
      console.warn(`Station ${stationId} not found or inactive`)
      return false
    }

    const previousStation = this.config.currentStation
    this.config.currentStation = stationId
    
    this.emit('locationChanged', {
      from: previousStation,
      to: stationId,
      station,
      timestamp: new Date()
    })

    console.log(`Station location changed to: ${station.name} (${station.nameAl})`)
    return true
  }

  getCurrentStation(): StationLocation | null {
    return this.stations.get(this.config.currentStation) ?? null
  }

  getAllStations(): StationLocation[] {
    return Array.from(this.stations.values())
  }

  getActiveStations(): StationLocation[] {
    return Array.from(this.stations.values()).filter(station => station.status === 'active')
  }

  // GPS management
  setGPSEnabled(enabled: boolean) {
    this.config.gpsEnabled = enabled
    
    if (enabled) {
      this.startGPSTracking()
    } else {
      this.stopGPSTracking()
    }
  }

  private startGPSTracking() {
    if (!navigator.geolocation) {
      console.warn('GPS not available in this browser')
      return
    }

    if (this.gpsWatcher) {
      navigator.geolocation.clearWatch(this.gpsWatcher)
    }

    this.gpsWatcher = navigator.geolocation.watchPosition(
      (position) => {
        const newGPS: GPSData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude ?? undefined,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
          speed: position.coords.speed ?? undefined,
          heading: position.coords.heading ?? undefined
        }

        // Check if we moved significantly
        if (this.currentGPS && this.calculateDistance(this.currentGPS, newGPS) < this.config.minDistanceChange) {
          return // No significant movement
        }

        this.currentGPS = newGPS
        this.updateMobileStationLocation(newGPS)
        
        this.emit('gpsUpdate', newGPS)
      },
      (error) => {
        console.error('GPS error:', error)
        this.emit('gpsError', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: this.config.updateInterval * 1000
      }
    )
  }

  private stopGPSTracking() {
    if (this.gpsWatcher) {
      navigator.geolocation.clearWatch(this.gpsWatcher)
      this.gpsWatcher = null
    }
  }

  private updateMobileStationLocation(gps: GPSData) {
    const mobileStation = this.stations.get('mobile-alpha')
    if (mobileStation) {
      mobileStation.coordinates = {
        latitude: gps.latitude,
        longitude: gps.longitude,
        altitude: gps.altitude
      }
      mobileStation.lastUpdated = new Date()
      
      this.emit('mobileStationUpdated', mobileStation)
    }
  }

  // Custom location
  async setCustomLocation(latitude: number, longitude: number, radius = 10, altitude?: number): Promise<boolean> {
    const customStation: StationLocation = {
      id: 'custom-location',
      name: 'Custom Location',
      nameAl: 'Vendndodhje e Personalizuar',
      coordinates: {
        latitude,
        longitude,
        altitude
      },
      type: 'custom',
      coverage: {
        radius,
        capabilities: ['LoRa', 'WiFi']
      },
      power: {
        type: 'battery',
        backup: false
      },
      priority: 7,
      status: 'active',
      lastUpdated: new Date()
    }

    this.stations.set('custom-location', customStation)
    this.config.customLocation = customStation
    
    return await this.setStationLocation('custom-location')
  }

  // Auto selection
  setAutoSelect(enabled: boolean) {
    this.config.autoSelect = enabled
    
    if (enabled) {
      this.performAutoSelection()
    }
  }

  private performAutoSelection() {
    const activeStations = this.getActiveStations()
    
    // Sort by priority (highest first)
    activeStations.sort((a, b) => b.priority - a.priority)
    
    if (activeStations.length > 0) {
      const bestStation = activeStations[0]
      if (bestStation.id !== this.config.currentStation) {
        this.setStationLocation(bestStation.id)
      }
    }
  }

  // Utility functions
  private calculateDistance(gps1: GPSData, gps2: GPSData): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = this.toRadians(gps2.latitude - gps1.latitude)
    const dLon = this.toRadians(gps2.longitude - gps1.longitude)
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(gps1.latitude)) * Math.cos(this.toRadians(gps2.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distance in meters
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  getDistanceToStation(stationId: string): number | null {
    if (!this.currentGPS) {return null}
    
    const station = this.stations.get(stationId)
    if (!station) {return null}
    
    return this.calculateDistance(this.currentGPS, {
      latitude: station.coordinates.latitude,
      longitude: station.coordinates.longitude,
      accuracy: 0,
      timestamp: new Date()
    })
  }

  private handleLocationChange(data: any) {
    console.log('Location changed:', data)
    // Broadcast to mesh network
    this.broadcastLocationChange(data)
  }

  private broadcastLocationChange(data: any) {
    // This will integrate with mesh networking
    if (typeof window !== 'undefined' && (window as any).meshNetwork) {
      (window as any).meshNetwork.broadcastLocationUpdate(data)
    }
  }

  // Configuration
  getConfig(): StationLocationConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<StationLocationConfig>) {
    this.config = { ...this.config, ...updates }
  }

  // Status and diagnostics
  getStatus() {
    return {
      currentStation: this.getCurrentStation(),
      gpsEnabled: this.config.gpsEnabled,
      gpsData: this.currentGPS,
      autoSelect: this.config.autoSelect,
      activeStations: this.getActiveStations().length,
      totalStations: this.stations.size
    }
  }
}

// Global instance
export const stationLocationManager = new StationLocationManager()

// Make it available globally for mesh integration
if (typeof window !== 'undefined') {
  (window as any).stationLocationManager = stationLocationManager
}
