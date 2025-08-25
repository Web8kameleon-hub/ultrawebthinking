/**
 * EuroWeb Ultra - Mesh Networking with Station Location Integration
 * Advanced mesh network with dynamic location support
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version Ultra 2.0.0
 * @license MIT
 * @created August 25, 2025
 */

import { StationLocation, GPSData, stationLocationManager } from '../config/station-location-config'

export interface MeshNode {
  id: string
  name: string
  location?: StationLocation
  gpsData?: GPSData
  status: 'online' | 'offline' | 'connecting'
  lastSeen: Date
  signalStrength: number
  capabilities: string[]
  meshConnections: string[]
  distance?: number
}

export interface MeshMessage {
  id: string
  type: 'location-update' | 'node-discovery' | 'data-relay' | 'emergency'
  from: string
  to?: string
  broadcast: boolean
  payload: any
  timestamp: Date
  hops: number
  maxHops: number
}

export interface MeshNetworkConfig {
  nodeId: string
  nodeName: string
  maxHops: number
  discoveryInterval: number
  heartbeatInterval: number
  maxNodes: number
  locationSync: boolean
}

export class MeshNetworking {
  private config: MeshNetworkConfig
  private nodes: Map<string, MeshNode> = new Map()
  private messageQueue: MeshMessage[] = []
  private discoveryTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private eventListeners: Map<string, Function[]> = new Map()

  constructor(config?: Partial<MeshNetworkConfig>) {
    this.config = {
      nodeId: this.generateNodeId(),
      nodeName: `EuroWeb-Node-${Date.now()}`,
      maxHops: 5,
      discoveryInterval: 30000, // 30 seconds
      heartbeatInterval: 10000, // 10 seconds
      maxNodes: 50,
      locationSync: true,
      ...config
    }

    this.initializeLocalNode()
    this.startDiscovery()
    this.startHeartbeat()

    // Listen to location manager events
    if (this.config.locationSync) {
      stationLocationManager.addEventListener('locationChanged', this.handleLocationChange.bind(this))
      stationLocationManager.addEventListener('gpsUpdate', this.handleGPSUpdate.bind(this))
    }
  }

  private generateNodeId(): string {
    return `node-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`
  }

  private initializeLocalNode() {
    const localNode: MeshNode = {
      id: this.config.nodeId,
      name: this.config.nodeName,
      location: stationLocationManager.getCurrentStation() ?? undefined,
      status: 'online',
      lastSeen: new Date(),
      signalStrength: 100,
      capabilities: ['LoRa', 'WiFi', 'location-sync', 'mesh-relay'],
      meshConnections: [],
      distance: 0
    }

    this.nodes.set(this.config.nodeId, localNode)
  }

  // Event management
  addEventListener(event: string, listener: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(listener)
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => listener(data))
    }
  }

  // Station location integration
  async setStationLocation(stationId: string): Promise<boolean> {
    const success = await stationLocationManager.setStationLocation(stationId)
    
    if (success) {
      const currentStation = stationLocationManager.getCurrentStation()
      if (currentStation) {
        this.updateLocalNodeLocation(currentStation)
        this.broadcastLocationUpdate({
          nodeId: this.config.nodeId,
          location: currentStation,
          timestamp: new Date()
        })
      }
    }
    
    return success
  }

  getCurrentStation(): StationLocation | null {
    return stationLocationManager.getCurrentStation()
  }

  enableGPSTracking(enabled: boolean) {
    stationLocationManager.setGPSEnabled(enabled)
  }

  private updateLocalNodeLocation(location: StationLocation) {
    const localNode = this.nodes.get(this.config.nodeId)
    if (localNode) {
      localNode.location = location
      localNode.lastSeen = new Date()
      this.calculateDistances()
    }
  }

  private handleLocationChange(data: any) {
    this.broadcastLocationUpdate({
      nodeId: this.config.nodeId,
      location: data.station,
      previousLocation: data.from,
      timestamp: data.timestamp
    })
  }

  private handleGPSUpdate(gpsData: GPSData) {
    const localNode = this.nodes.get(this.config.nodeId)
    if (localNode) {
      localNode.gpsData = gpsData
      localNode.lastSeen = new Date()
    }

    this.broadcastMessage({
      type: 'location-update',
      payload: {
        nodeId: this.config.nodeId,
        gpsData,
        timestamp: new Date()
      }
    })
  }

  // Mesh network operations
  broadcastLocationUpdate(locationData: any) {
    this.broadcastMessage({
      type: 'location-update',
      payload: locationData
    })
  }

  private broadcastMessage(message: Partial<MeshMessage>) {
    const fullMessage: MeshMessage = {
      id: this.generateMessageId(),
      from: this.config.nodeId,
      broadcast: true,
      timestamp: new Date(),
      hops: 0,
      maxHops: this.config.maxHops,
      ...message
    } as MeshMessage

    this.messageQueue.push(fullMessage)
    this.relayMessage(fullMessage)
    
    this.emit('messageTransmitted', fullMessage)
  }

  private generateMessageId(): string {
    return `msg-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`
  }

  private relayMessage(message: MeshMessage) {
    // In a real implementation, this would use actual radio/network protocols
    // For now, we simulate mesh behavior
    
    if (message.hops >= message.maxHops) {
      return // Message expired
    }

    // Simulate transmission to connected nodes
    const localNode = this.nodes.get(this.config.nodeId)
    if (localNode) {
      localNode.meshConnections.forEach(nodeId => {
        const targetNode = this.nodes.get(nodeId)
        if (targetNode && targetNode.status === 'online') {
          // Simulate message arrival at target node
          setTimeout(() => {
            this.handleIncomingMessage({
              ...message,
              hops: message.hops + 1
            }, targetNode)
          }, Math.random() * 1000) // Random delay 0-1 second
        }
      })
    }
  }

  private handleIncomingMessage(message: MeshMessage, targetNode: MeshNode) {
    this.emit('messageReceived', { message, node: targetNode })

    switch (message.type) {
      case 'location-update':
        this.handleLocationUpdateMessage(message)
        break
      case 'node-discovery':
        this.handleNodeDiscoveryMessage(message)
        break
      default:
        console.log('Unknown message type:', message.type)
    }
  }

  private handleLocationUpdateMessage(message: MeshMessage) {
    const { nodeId, location, gpsData } = message.payload
    
    let node = this.nodes.get(nodeId)
    if (!node) {
      // Create new node
      node = {
        id: nodeId,
        name: `Remote-Node-${nodeId.substr(-4)}`,
        status: 'online',
        lastSeen: new Date(),
        signalStrength: 50,
        capabilities: ['mesh-relay'],
        meshConnections: []
      }
      this.nodes.set(nodeId, node)
    }

    if (location) {
      node.location = location
    }
    if (gpsData) {
      node.gpsData = gpsData
    }
    
    node.lastSeen = new Date()
    this.calculateDistances()
    
    this.emit('nodeLocationUpdated', { nodeId, node })
  }

  private handleNodeDiscoveryMessage(message: MeshMessage) {
    const { nodeInfo } = message.payload
    
    if (nodeInfo.id !== this.config.nodeId) {
      let node = this.nodes.get(nodeInfo.id)
      if (!node) {
        node = {
          ...nodeInfo,
          status: 'online',
          lastSeen: new Date(),
          meshConnections: []
        } as MeshNode
        this.nodes.set(nodeInfo.id, node)
      } else {
        Object.assign(node, nodeInfo)
        node.lastSeen = new Date()
      }

      this.calculateDistances()
      this.emit('nodeDiscovered', node)
    }
  }

  // Node discovery
  private startDiscovery() {
    this.discoveryTimer = setInterval(() => {
      this.performNodeDiscovery()
    }, this.config.discoveryInterval)
  }

  private performNodeDiscovery() {
    const localNode = this.nodes.get(this.config.nodeId)
    if (localNode) {
      this.broadcastMessage({
        type: 'node-discovery',
        payload: {
          nodeInfo: {
            id: localNode.id,
            name: localNode.name,
            location: localNode.location,
            gpsData: localNode.gpsData,
            capabilities: localNode.capabilities,
            signalStrength: localNode.signalStrength
          }
        }
      })
    }
  }

  // Heartbeat and health monitoring
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.performHealthCheck()
    }, this.config.heartbeatInterval)
  }

  private performHealthCheck() {
    const now = new Date()
    const timeout = this.config.heartbeatInterval * 3

    this.nodes.forEach((node, nodeId) => {
      if (nodeId !== this.config.nodeId) {
        const timeSinceLastSeen = now.getTime() - node.lastSeen.getTime()
        
        if (timeSinceLastSeen > timeout) {
          node.status = 'offline'
          this.emit('nodeOffline', node)
        }
      }
    })
  }

  // Distance calculations
  private calculateDistances() {
    const localNode = this.nodes.get(this.config.nodeId)
    if (!localNode?.location) {return}

    const localCoords = localNode.location.coordinates

    this.nodes.forEach((node, nodeId) => {
      if (nodeId !== this.config.nodeId && node.location) {
        const remoteCoords = node.location.coordinates
        node.distance = this.calculateDistance(localCoords, remoteCoords)
      }
    })
  }

  private calculateDistance(coord1: any, coord2: any): number {
    const R = 6371000 // Earth's radius in meters
    const dLat = this.toRadians(coord2.latitude - coord1.latitude)
    const dLon = this.toRadians(coord2.longitude - coord1.longitude)
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(coord1.latitude)) * Math.cos(this.toRadians(coord2.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distance in meters
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // Public interface
  getNodes(): MeshNode[] {
    return Array.from(this.nodes.values())
  }

  getOnlineNodes(): MeshNode[] {
    return Array.from(this.nodes.values()).filter(node => node.status === 'online')
  }

  getNodeById(nodeId: string): MeshNode | undefined {
    return this.nodes.get(nodeId)
  }

  getLocalNode(): MeshNode | undefined {
    return this.nodes.get(this.config.nodeId)
  }

  getNetworkStatus() {
    const nodes = this.getNodes()
    const onlineNodes = this.getOnlineNodes()
    
    return {
      totalNodes: nodes.length,
      onlineNodes: onlineNodes.length,
      localNodeId: this.config.nodeId,
      currentStation: this.getCurrentStation(),
      messageQueueSize: this.messageQueue.length,
      averageDistance: this.calculateAverageDistance(),
      networkHealth: onlineNodes.length / Math.max(nodes.length, 1)
    }
  }

  private calculateAverageDistance(): number {
    const distances = this.getNodes()
      .filter(node => node.distance !== undefined)
      .map(node => node.distance!)
    
    return distances.length > 0 
      ? distances.reduce((sum, dist) => sum + dist, 0) / distances.length 
      : 0
  }

  // Cleanup
  shutdown() {
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer)
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
    }
    
    this.nodes.clear()
    this.messageQueue = []
    this.eventListeners.clear()
  }
}

// Global instance
export const meshNetwork = new MeshNetworking()

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).meshNetwork = meshNetwork
}
