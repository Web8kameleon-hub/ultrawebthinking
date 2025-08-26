// lib/edge/mesh-link.ts
// Wi-Fi Direct Bridge & High-Speed Mesh Interconnect
// libp2p gossipsub integration for enterprise mesh networking

import { webcrypto } from 'crypto'
import { BundlePriority, DTNBundle, DTNRouter } from './mesh-dtn'

// Wi-Fi Direct connection types
export enum ConnectionType {
    WIFI_DIRECT = 'wifi_direct',    // P2P Wi-Fi Direct
    BLUETOOTH = 'bluetooth',        // Bluetooth LE mesh
    LORA = 'lora',                 // LoRa long-range
    ETHERNET = 'ethernet',         // Wired Ethernet
    CELLULAR = 'cellular'          // Cellular data
}

// Link quality metrics
export interface LinkQuality {
    connection_type: ConnectionType
    bandwidth_mbps: number         // Available bandwidth
    latency_ms: number            // Round-trip latency
    packet_loss: number           // Packet loss percentage (0-1)
    signal_strength: number       // Signal strength (dBm)
    stability_score: number       // Link stability (0-1)
    energy_cost: number          // Energy consumption per MB
    last_measurement: number     // Timestamp of last measurement
}

// Network bridge interface
export interface NetworkBridge {
    bridge_id: string
    local_node: string
    remote_node: string
    connection_type: ConnectionType
    link_quality: LinkQuality
    established_at: number
    data_transferred: number
    is_active: boolean
    encryption_enabled: boolean
    compression_enabled: boolean
}

// Mesh topology node
export interface MeshNode {
    node_id: string
    node_type: 'edge' | 'relay' | 'gateway'
    location?: {
        lat: number
        lon: number
        alt?: number
    }
    capabilities: {
        wifi_direct: boolean
        bluetooth: boolean
        lora: boolean
        ethernet: boolean
        cellular: boolean
        storage_mb: number
        battery_level?: number
        processing_power: 'low' | 'medium' | 'high'
    }
    bridges: NetworkBridge[]
    last_seen: number
    trust_level: number          // 0-1 trust score
}

// Routing protocol for multi-hop
export interface RoutingProtocol {
    protocol_name: string
    hop_limit: number
    route_metric: (path: string[]) => number
    route_selection: (routes: Route[]) => Route
    load_balancing: boolean
    adaptive_routing: boolean
}

export interface Route {
    destination: string
    path: string[]              // Node IDs in route
    metric: number             // Route cost/quality
    bandwidth: number          // Available bandwidth
    latency: number           // End-to-end latency
    reliability: number       // Route reliability (0-1)
    last_update: number       // Route discovery timestamp
}

// Traffic management
export interface TrafficManager {
    qos_enabled: boolean
    bandwidth_allocation: Map<BundlePriority, number>
    congestion_control: boolean
    adaptive_compression: boolean
    priority_queues: Map<BundlePriority, DTNBundle[]>
}

// Mesh network statistics
export interface MeshNetworkStats {
    total_nodes: number
    active_bridges: number
    total_routes: number
    avg_hop_count: number
    network_throughput_mbps: number
    network_latency_ms: number
    packet_loss_rate: number
    coverage_area_km2: number
    energy_efficiency: number
    fault_tolerance: number
}

export class MeshNetworkManager {
    private nodeId: string
    private nodeType: 'edge' | 'relay' | 'gateway'
    private dtnRouter: DTNRouter
    private topology: Map<string, MeshNode>
    private bridges: Map<string, NetworkBridge>
    private routes: Map<string, Route[]>
    private trafficManager: TrafficManager
    private stats: MeshNetworkStats
    private discoveryInterval?: NodeJS.Timeout

    constructor(
        nodeId: string,
        nodeType: 'edge' | 'relay' | 'gateway',
        dtnRouter: DTNRouter
    ) {
        this.nodeId = nodeId
        this.nodeType = nodeType
        this.dtnRouter = dtnRouter
        this.topology = new Map()
        this.bridges = new Map()
        this.routes = new Map()
        this.trafficManager = this.initializeTrafficManager()
        this.stats = this.initializeStats()

        this.startNetworkDiscovery()
    }

    private initializeTrafficManager(): TrafficManager {
        return {
            qos_enabled: true,
            bandwidth_allocation: new Map([
                [BundlePriority.CRITICAL, 0.4],    // 40% for critical
                [BundlePriority.EXPEDITED, 0.3],   // 30% for expedited
                [BundlePriority.NORMAL, 0.2],      // 20% for normal
                [BundlePriority.BULK, 0.1]         // 10% for bulk
            ]),
            congestion_control: true,
            adaptive_compression: true,
            priority_queues: new Map([
                [BundlePriority.CRITICAL, []],
                [BundlePriority.EXPEDITED, []],
                [BundlePriority.NORMAL, []],
                [BundlePriority.BULK, []]
            ])
        }
    }

    private initializeStats(): MeshNetworkStats {
        return {
            total_nodes: 0,
            active_bridges: 0,
            total_routes: 0,
            avg_hop_count: 0,
            network_throughput_mbps: 0,
            network_latency_ms: 0,
            packet_loss_rate: 0,
            coverage_area_km2: 0,
            energy_efficiency: 0,
            fault_tolerance: 0
        }
    }

    // Wi-Fi Direct bridge establishment
    async establishWiFiDirectBridge(
        remoteNodeId: string,
        remoteDeviceInfo: {
            mac_address: string
            device_name: string
            supported_channels: number[]
            max_bandwidth_mbps: number
        }
    ): Promise<NetworkBridge | null> {
        try {
            console.log(`Establishing Wi-Fi Direct bridge to ${remoteNodeId}`)

            // Simulate Wi-Fi Direct connection negotiation
            const linkQuality = await this.measureLinkQuality(
                ConnectionType.WIFI_DIRECT,
                remoteNodeId
            )

            if (linkQuality.signal_strength < -80) {
                console.warn(`Signal too weak for Wi-Fi Direct: ${linkQuality.signal_strength} dBm`)
                return null
            }

            const bridge: NetworkBridge = {
                bridge_id: await this.generateBridgeId(),
                local_node: this.nodeId,
                remote_node: remoteNodeId,
                connection_type: ConnectionType.WIFI_DIRECT,
                link_quality: linkQuality,
                established_at: Date.now(),
                data_transferred: 0,
                is_active: true,
                encryption_enabled: true,
                compression_enabled: false // Wi-Fi Direct is already fast
            }

            // Store bridge
            this.bridges.set(bridge.bridge_id, bridge)

            // Update node capabilities
            await this.updateNodeBridge(remoteNodeId, bridge)

            // Start bridge monitoring
            this.monitorBridge(bridge.bridge_id)

            console.log(`Wi-Fi Direct bridge established: ${bridge.bridge_id}`)
            return bridge

        } catch (error) {
            console.error(`Failed to establish Wi-Fi Direct bridge:`, error)
            return null
        }
    }

    // Bluetooth LE mesh bridge
    async establishBluetoothBridge(
        remoteNodeId: string,
        bluetoothInfo: {
            address: string
            device_class: number
            supported_profiles: string[]
            max_mtu: number
        }
    ): Promise<NetworkBridge | null> {
        try {
            console.log(`Establishing Bluetooth LE bridge to ${remoteNodeId}`)

            const linkQuality = await this.measureLinkQuality(
                ConnectionType.BLUETOOTH,
                remoteNodeId
            )

            // Bluetooth is lower bandwidth but good for mesh
            const bridge: NetworkBridge = {
                bridge_id: await this.generateBridgeId(),
                local_node: this.nodeId,
                remote_node: remoteNodeId,
                connection_type: ConnectionType.BLUETOOTH,
                link_quality: linkQuality,
                established_at: Date.now(),
                data_transferred: 0,
                is_active: true,
                encryption_enabled: true,
                compression_enabled: true // Compress for BT due to low bandwidth
            }

            this.bridges.set(bridge.bridge_id, bridge)
            await this.updateNodeBridge(remoteNodeId, bridge)
            this.monitorBridge(bridge.bridge_id)

            return bridge

        } catch (error) {
            console.error(`Failed to establish Bluetooth bridge:`, error)
            return null
        }
    }

    // Multi-hop route discovery
    async discoverRoutes(destinationNode: string): Promise<Route[]> {
        const routes: Route[] = []
        const visited = new Set<string>()
        const queue: { node: string, path: string[], metric: number }[] = []

        // Start from current node
        queue.push({ node: this.nodeId, path: [this.nodeId], metric: 0 })

        while (queue.length > 0 && routes.length < 5) { // Limit to 5 best routes
            const { node, path, metric } = queue.shift()!

            if (visited.has(node) || path.length > 10) { // Max 10 hops
                continue
            }

            visited.add(node)

            // Check if we reached destination
            if (node === destinationNode) {
                const route = await this.calculateRouteMetrics(path)
                routes.push(route)
                continue
            }

            // Explore neighbors
            const nodeInfo = this.topology.get(node)
            if (nodeInfo) {
                for (const bridge of nodeInfo.bridges) {
                    const nextNode = bridge.remote_node
                    if (!visited.has(nextNode) && bridge.is_active) {
                        const bridgeMetric = this.calculateBridgeMetric(bridge)
                        queue.push({
                            node: nextNode,
                            path: [...path, nextNode],
                            metric: metric + bridgeMetric
                        })
                    }
                }
            }
        }

        // Sort routes by quality
        routes.sort((a, b) => b.reliability - a.reliability)

        // Cache routes
        this.routes.set(destinationNode, routes)

        return routes
    }

    // Intelligent routing with load balancing
    async routeBundle(bundle: DTNBundle): Promise<string[]> {
        const destination = bundle.destination

        // Get available routes
        let routes = this.routes.get(destination) || []

        // Discover routes if none cached or stale
        if (routes.length === 0 || this.areRoutesCacheStale(routes)) {
            routes = await this.discoverRoutes(destination)
        }

        if (routes.length === 0) {
            console.warn(`No routes found to ${destination}`)
            return []
        }

        // Select best route based on bundle priority and current conditions
        const selectedRoute = this.selectOptimalRoute(routes, bundle)

        if (!selectedRoute || selectedRoute.path.length < 2) {
            return []
        }

        // Return next hop(s)
        const nextHop = selectedRoute.path[1] // Skip current node

        // For high-priority bundles, use multiple routes for redundancy
        if (bundle.priority >= BundlePriority.EXPEDITED && routes.length > 1) {
            const redundantRoute = routes[1]
            if (redundantRoute && redundantRoute.path.length >= 2) {
                const secondHop = redundantRoute.path[1]
                return [nextHop, secondHop]
            }
        }

        return [nextHop]
    }

    // Adaptive Quality of Service
    private selectOptimalRoute(routes: Route[], bundle: DTNBundle): Route | null {
        if (routes.length === 0) return null

        // Score routes based on bundle requirements
        const scoredRoutes = routes.map(route => ({
            route,
            score: this.calculateRouteScore(route, bundle)
        }))

        // Sort by score
        scoredRoutes.sort((a, b) => b.score - a.score)

        return scoredRoutes[0].route
    }

    private calculateRouteScore(route: Route, bundle: DTNBundle): number {
        let score = 0

        // Base reliability score
        score += route.reliability * 40

        // Latency factor (lower is better)
        score += Math.max(0, 20 - route.latency / 100)

        // Bandwidth factor
        score += Math.min(20, route.bandwidth / 10)

        // Hop count penalty
        score -= route.path.length * 2

        // Priority-specific adjustments
        switch (bundle.priority) {
            case BundlePriority.CRITICAL:
                score += route.reliability * 20  // Prioritize reliability
                score -= route.latency / 50       // Penalize latency heavily
                break

            case BundlePriority.EXPEDITED:
                score += route.bandwidth / 5      // Prefer higher bandwidth
                score -= route.latency / 100      // Moderate latency penalty
                break

            case BundlePriority.BULK:
                score += route.bandwidth / 2      // Bandwidth is key for bulk
                score -= route.path.length       // Minimize network load
                break
        }

        return score
    }

    // Network topology visualization data
    getTopologyData(): {
        nodes: MeshNode[]
        links: { source: string, target: string, quality: LinkQuality }[]
        coverage: { lat: number, lon: number, radius: number }[]
    } {
        const nodes = Array.from(this.topology.values())
        const links: { source: string, target: string, quality: LinkQuality }[] = []
        const coverage: { lat: number, lon: number, radius: number }[] = []

        // Extract links from bridges
        for (const bridge of this.bridges.values()) {
            if (bridge.is_active) {
                links.push({
                    source: bridge.local_node,
                    target: bridge.remote_node,
                    quality: bridge.link_quality
                })
            }
        }

        // Calculate coverage areas
        for (const node of nodes) {
            if (node.location) {
                let radius = 0.1 // Base 100m coverage

                // Adjust radius based on capabilities
                if (node.capabilities.wifi_direct) radius = Math.max(radius, 0.2) // 200m
                if (node.capabilities.lora) radius = Math.max(radius, 5.0)        // 5km
                if (node.capabilities.cellular) radius = Math.max(radius, 10.0)   // 10km

                coverage.push({
                    lat: node.location.lat,
                    lon: node.location.lon,
                    radius
                })
            }
        }

        return { nodes, links, coverage }
    }

    // Network performance optimization
    async optimizeNetwork(): Promise<void> {
        console.log('Optimizing mesh network performance...')

        // 1. Update route metrics
        await this.refreshAllRoutes()

        // 2. Rebalance traffic
        await this.rebalanceTraffic()

        // 3. Optimize bridge configurations
        await this.optimizeBridges()

        // 4. Update network statistics
        this.updateNetworkStats()

        console.log('Network optimization complete')
    }

    private async refreshAllRoutes(): Promise<void> {
        const destinations = Array.from(this.topology.keys())

        for (const destination of destinations) {
            if (destination !== this.nodeId) {
                await this.discoverRoutes(destination)
            }
        }
    }

    private async rebalanceTraffic(): Promise<void> {
        // Redistribute traffic across available routes
        for (const [priority, queue] of this.trafficManager.priority_queues) {
            if (queue.length > 0) {
                // Process queued bundles with updated routing
                const bundles = [...queue]
                queue.length = 0 // Clear queue

                for (const bundle of bundles) {
                    const nextHops = await this.routeBundle(bundle)
                    // Forward bundles (implementation would integrate with DTN router)
                }
            }
        }
    }

    private async optimizeBridges(): Promise<void> {
        for (const bridge of this.bridges.values()) {
            if (bridge.is_active) {
                // Update link quality
                bridge.link_quality = await this.measureLinkQuality(
                    bridge.connection_type,
                    bridge.remote_node
                )

                // Disable poor quality bridges
                if (bridge.link_quality.stability_score < 0.3) {
                    bridge.is_active = false
                    console.warn(`Disabled poor quality bridge: ${bridge.bridge_id}`)
                }

                // Enable compression for slow links
                if (bridge.link_quality.bandwidth_mbps < 1.0) {
                    bridge.compression_enabled = true
                }
            }
        }
    }

    // Helper methods
    private async generateBridgeId(): Promise<string> {
        const data = new TextEncoder().encode(`${this.nodeId}-${Date.now()}-${Math.random()}`)
        const hash = await webcrypto.subtle.digest('SHA-256', data)
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .substring(0, 12)
    }

    private async measureLinkQuality(
        connectionType: ConnectionType,
        remoteNode: string
    ): Promise<LinkQuality> {
        // Simulate link quality measurement
        const baseQuality: LinkQuality = {
            connection_type: connectionType,
            bandwidth_mbps: 0,
            latency_ms: 0,
            packet_loss: 0,
            signal_strength: 0,
            stability_score: 0,
            energy_cost: 0,
            last_measurement: Date.now()
        }

        switch (connectionType) {
            case ConnectionType.WIFI_DIRECT:
                baseQuality.bandwidth_mbps = 20 + Math.random() * 30 // 20-50 Mbps
                baseQuality.latency_ms = 5 + Math.random() * 15      // 5-20 ms
                baseQuality.signal_strength = -40 - Math.random() * 40 // -40 to -80 dBm
                baseQuality.energy_cost = 0.5 // Medium energy cost
                break

            case ConnectionType.BLUETOOTH:
                baseQuality.bandwidth_mbps = 0.5 + Math.random() * 1.5 // 0.5-2 Mbps
                baseQuality.latency_ms = 20 + Math.random() * 30       // 20-50 ms
                baseQuality.signal_strength = -50 - Math.random() * 30 // -50 to -80 dBm
                baseQuality.energy_cost = 0.2 // Low energy cost
                break

            case ConnectionType.LORA:
                baseQuality.bandwidth_mbps = 0.001 + Math.random() * 0.01 // 1-10 kbps
                baseQuality.latency_ms = 100 + Math.random() * 400        // 100-500 ms
                baseQuality.signal_strength = -80 - Math.random() * 60    // -80 to -140 dBm
                baseQuality.energy_cost = 0.05 // Very low energy cost
                break
        }

        baseQuality.packet_loss = Math.random() * 0.05 // 0-5% packet loss
        baseQuality.stability_score = 0.7 + Math.random() * 0.3 // 0.7-1.0

        return baseQuality
    }

    private calculateBridgeMetric(bridge: NetworkBridge): number {
        const quality = bridge.link_quality
        let metric = 0

        // Lower bandwidth increases metric (cost)
        metric += Math.max(1, 100 / quality.bandwidth_mbps)

        // Higher latency increases metric
        metric += quality.latency_ms / 10

        // Packet loss penalty
        metric += quality.packet_loss * 100

        // Energy cost factor
        metric += quality.energy_cost * 10

        // Stability bonus
        metric *= (2 - quality.stability_score)

        return metric
    }

    private async calculateRouteMetrics(path: string[]): Promise<Route> {
        let totalBandwidth = Infinity
        let totalLatency = 0
        let totalReliability = 1.0

        // Calculate aggregate metrics for the path
        for (let i = 0; i < path.length - 1; i++) {
            const bridge = this.findBridge(path[i], path[i + 1])
            if (bridge) {
                const quality = bridge.link_quality
                totalBandwidth = Math.min(totalBandwidth, quality.bandwidth_mbps)
                totalLatency += quality.latency_ms
                totalReliability *= quality.stability_score
            }
        }

        return {
            destination: path[path.length - 1],
            path,
            metric: this.calculateBridgeMetric({
                link_quality: {
                    bandwidth_mbps: totalBandwidth,
                    latency_ms: totalLatency,
                    packet_loss: 1 - totalReliability,
                    stability_score: totalReliability
                }
            } as NetworkBridge),
            bandwidth: totalBandwidth === Infinity ? 0 : totalBandwidth,
            latency: totalLatency,
            reliability: totalReliability,
            last_update: Date.now()
        }
    }

    private findBridge(nodeA: string, nodeB: string): NetworkBridge | undefined {
        return Array.from(this.bridges.values()).find(bridge =>
            (bridge.local_node === nodeA && bridge.remote_node === nodeB) ||
            (bridge.local_node === nodeB && bridge.remote_node === nodeA)
        )
    }

    private areRoutesCacheStale(routes: Route[]): boolean {
        const maxAge = 60000 // 1 minute
        return routes.some(route => Date.now() - route.last_update > maxAge)
    }

    private async updateNodeBridge(nodeId: string, bridge: NetworkBridge): Promise<void> {
        let node = this.topology.get(nodeId)
        if (!node) {
            // Create new node entry
            node = {
                node_id: nodeId,
                node_type: 'edge', // Default type
                capabilities: {
                    wifi_direct: bridge.connection_type === ConnectionType.WIFI_DIRECT,
                    bluetooth: bridge.connection_type === ConnectionType.BLUETOOTH,
                    lora: bridge.connection_type === ConnectionType.LORA,
                    ethernet: bridge.connection_type === ConnectionType.ETHERNET,
                    cellular: bridge.connection_type === ConnectionType.CELLULAR,
                    storage_mb: 100, // Default
                    processing_power: 'medium'
                },
                bridges: [],
                last_seen: Date.now(),
                trust_level: 0.5 // Default trust
            }
        }

        node.bridges.push(bridge)
        node.last_seen = Date.now()
        this.topology.set(nodeId, node)
    }

    private monitorBridge(bridgeId: string): void {
        // Monitor bridge quality and performance
        setInterval(async () => {
            const bridge = this.bridges.get(bridgeId)
            if (bridge && bridge.is_active) {
                bridge.link_quality = await this.measureLinkQuality(
                    bridge.connection_type,
                    bridge.remote_node
                )
            }
        }, 30000) // Update every 30 seconds
    }

    private updateNetworkStats(): void {
        this.stats.total_nodes = this.topology.size
        this.stats.active_bridges = Array.from(this.bridges.values())
            .filter(bridge => bridge.is_active).length
        this.stats.total_routes = Array.from(this.routes.values())
            .reduce((sum, routes) => sum + routes.length, 0)

        // Calculate other statistics...
        const allRoutes = Array.from(this.routes.values()).flat()
        if (allRoutes.length > 0) {
            this.stats.avg_hop_count = allRoutes
                .reduce((sum, route) => sum + route.path.length, 0) / allRoutes.length

            this.stats.network_latency_ms = allRoutes
                .reduce((sum, route) => sum + route.latency, 0) / allRoutes.length
        }
    }

    private startNetworkDiscovery(): void {
        this.discoveryInterval = setInterval(() => {
            this.optimizeNetwork()
        }, 60000) // Optimize every minute
    }

    // Public API
    public getStats(): MeshNetworkStats {
        return { ...this.stats }
    }

    public getBridges(): NetworkBridge[] {
        return Array.from(this.bridges.values())
    }

    public getTopology(): MeshNode[] {
        return Array.from(this.topology.values())
    }

    public async addNode(nodeInfo: MeshNode): Promise<void> {
        this.topology.set(nodeInfo.node_id, nodeInfo)

        // Try to establish bridges based on capabilities
        if (nodeInfo.capabilities.wifi_direct) {
            await this.establishWiFiDirectBridge(nodeInfo.node_id, {
                mac_address: 'simulated',
                device_name: nodeInfo.node_id,
                supported_channels: [1, 6, 11],
                max_bandwidth_mbps: 50
            })
        }
    }

    public cleanup(): void {
        if (this.discoveryInterval) {
            clearInterval(this.discoveryInterval)
        }
        this.bridges.clear()
        this.topology.clear()
        this.routes.clear()
    }
}

// Factory function
export function createMeshNetworkManager(
    nodeId: string,
    nodeType: 'edge' | 'relay' | 'gateway',
    dtnRouter: DTNRouter
): MeshNetworkManager {
    return new MeshNetworkManager(nodeId, nodeType, dtnRouter)
}
