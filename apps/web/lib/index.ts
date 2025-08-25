/**
 * EuroWeb Platform - Main Library Export Index
 * Central export hub for all library modules
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 3.0.0 Ultra
 * @license MIT
 * @created August 25, 2025
 */

// AGI Office Suite
export * from './agi-office'

// Station Location Management
export * from './config/station-location-config'
export { stationLocationManager } from './config/station-location-config'

// Mesh Networking
export * from './mesh/mesh-networking'
export { meshNetwork } from './mesh/mesh-networking'

// Re-export key components for convenience
export type { 
  StationLocation, 
  GPSData, 
  StationLocationConfig 
} from './config/station-location-config'

export type { 
  MeshNode, 
  MeshMessage, 
  MeshNetworkConfig 
} from './mesh/mesh-networking'

export type {
  Document,
  DocumentPermissions,
  DocumentMetadata,
  AGIOfficeConfig,
  UserSession,
  UserPermissions
} from './agi-office'

// Library constants
export const EUROWEB_LIB_VERSION = '3.0.0'
export const EUROWEB_LIB_BUILD = 'Ultra'
export const EUROWEB_LIB_RELEASE_DATE = '2025-08-25'

// Default configurations
export const DEFAULT_MESH_CONFIG = {
  maxHops: 5,
  discoveryInterval: 30000,
  heartbeatInterval: 10000,
  maxNodes: 50,
  locationSync: true
}

export const DEFAULT_STATION_CONFIG = {
  autoSelect: false,
  gpsEnabled: false,
  updateInterval: 30,
  minDistanceChange: 100
}
