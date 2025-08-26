// lib/edge/mesh-dtn.ts
// Delay-Tolerant Networking (DTN) Implementation
// Store-and-Forward Mesh Routing with Bundle Protocol

import { webcrypto } from 'crypto'

// DTN Bundle structure based on RFC 5050
export interface DTNBundle {
    id: string                    // Unique bundle identifier
    source: string               // Source node ID
    destination: string          // Destination node ID (or 'broadcast')
    creation_timestamp: number   // Bundle creation time
    lifetime: number            // Time-to-live in seconds
    priority: BundlePriority    // Bundle priority level
    payload: Uint8Array         // Actual message payload
    routing_info: RoutingInfo   // Routing metadata
    custody_transfer: boolean   // Custody transfer requested
    receipt_requested: boolean  // Delivery receipt requested
    forwarding_log: ForwardingHop[] // Nodes that forwarded this bundle
    signature?: Uint8Array      // Optional bundle signature
}

export enum BundlePriority {
    BULK = 0,           // Background traffic
    NORMAL = 1,         // Normal priority
    EXPEDITED = 2,      // High priority (alerts)
    CRITICAL = 3        // Critical/emergency traffic
}

export interface RoutingInfo {
    hop_count: number           // Number of hops taken
    max_hops: number           // Maximum allowed hops
    preferred_route?: string[] // Preferred routing path
    avoid_nodes?: string[]     // Nodes to avoid
    geographic_hint?: {        // Geographic routing hint
        lat: number
        lon: number
        radius: number
    }
}

export interface ForwardingHop {
    node_id: string            // Node that forwarded
    timestamp: number          // Forwarding timestamp
    signal_strength?: number   // Signal strength at forwarding
    next_hop?: string         // Next hop in route
}

// DTN Routing algorithms
export enum RoutingStrategy {
    EPIDEMIC = 'epidemic',     // Flood to all neighbors
    SPRAY_AND_WAIT = 'spray_and_wait', // Limited flooding
    PROPHET = 'prophet',       // Probabilistic routing
    GEOGRAPHIC = 'geographic', // Location-based routing
    PRIORITY_FIRST = 'priority_first' // Priority-based forwarding
}

// Bundle storage for store-and-forward
export interface BundleStorage {
    bundles: Map<string, DTNBundle>
    size_limit: number         // Maximum storage size
    current_size: number       // Current storage usage
    cleanup_interval: number   // Cleanup interval (ms)
}

// Node routing table
export interface RoutingEntry {
    destination: string        // Destination node pattern
    next_hop: string          // Next hop node
    metric: number            // Route metric (lower = better)
    last_update: number       // Last route update
    confidence: number        // Route confidence (0-1)
    geographic_distance?: number // Geographic distance
}

// DTN Statistics
export interface DTNStats {
    bundles_created: number
    bundles_forwarded: number
    bundles_delivered: number
    bundles_expired: number
    bundles_dropped: number
    storage_utilization: number
    avg_delivery_time: number
    hop_count_distribution: { [hops: number]: number }
}

export class DTNRouter {
    private nodeId: string
    private storage: BundleStorage
    private routingTable: Map<string, RoutingEntry>
    private neighbors: Map<string, NeighborInfo>
    private stats: DTNStats
    private cleanupTimer?: NodeJS.Timeout

    constructor(nodeId: string, storageLimitMB: number = 100) {
        this.nodeId = nodeId
        this.storage = {
            bundles: new Map(),
            size_limit: storageLimitMB * 1024 * 1024, // Convert to bytes
            current_size: 0,
            cleanup_interval: 60000 // 1 minute
        }
        this.routingTable = new Map()
        this.neighbors = new Map()
        this.stats = this.initializeStats()

        this.startCleanupTimer()
    }

    private initializeStats(): DTNStats {
        return {
            bundles_created: 0,
            bundles_forwarded: 0,
            bundles_delivered: 0,
            bundles_expired: 0,
            bundles_dropped: 0,
            storage_utilization: 0,
            avg_delivery_time: 0,
            hop_count_distribution: {}
        }
    }

    // Create a new DTN bundle
    async createBundle(
        destination: string,
        payload: Uint8Array,
        priority: BundlePriority = BundlePriority.NORMAL,
        lifetime: number = 3600, // 1 hour default
        options: {
            custody_transfer?: boolean
            receipt_requested?: boolean
            max_hops?: number
            preferred_route?: string[]
            geographic_hint?: { lat: number, lon: number, radius: number }
        } = {}
    ): Promise<DTNBundle> {
        const bundleId = await this.generateBundleId()

        const bundle: DTNBundle = {
            id: bundleId,
            source: this.nodeId,
            destination,
            creation_timestamp: Date.now(),
            lifetime: lifetime * 1000, // Convert to milliseconds
            priority,
            payload,
            routing_info: {
                hop_count: 0,
                max_hops: options.max_hops || 10,
                preferred_route: options.preferred_route,
                geographic_hint: options.geographic_hint
            },
            custody_transfer: options.custody_transfer || false,
            receipt_requested: options.receipt_requested || false,
            forwarding_log: []
        }

        // Sign the bundle
        bundle.signature = await this.signBundle(bundle)

        // Store the bundle
        await this.storeBundle(bundle)
        this.stats.bundles_created++

        return bundle
    }

    // Store bundle in local storage
    private async storeBundle(bundle: DTNBundle): Promise<boolean> {
        const bundleSize = this.calculateBundleSize(bundle)

        // Check storage capacity
        if (this.storage.current_size + bundleSize > this.storage.size_limit) {
            // Try to free space by removing expired/low-priority bundles
            await this.garbageCollect()

            if (this.storage.current_size + bundleSize > this.storage.size_limit) {
                console.warn(`Storage full, dropping bundle ${bundle.id}`)
                this.stats.bundles_dropped++
                return false
            }
        }

        this.storage.bundles.set(bundle.id, bundle)
        this.storage.current_size += bundleSize
        this.updateStorageUtilization()

        return true
    }

    // Forward bundle to next hop(s)
    async forwardBundle(
        bundle: DTNBundle,
        strategy: RoutingStrategy = RoutingStrategy.EPIDEMIC
    ): Promise<string[]> {
        // Check if bundle is expired
        if (this.isBundleExpired(bundle)) {
            this.expireBundle(bundle.id)
            return []
        }

        // Check hop limit
        if (bundle.routing_info.hop_count >= bundle.routing_info.max_hops) {
            console.warn(`Bundle ${bundle.id} exceeded hop limit`)
            this.stats.bundles_dropped++
            return []
        }

        // Increment hop count
        bundle.routing_info.hop_count++

        // Add forwarding entry
        bundle.forwarding_log.push({
            node_id: this.nodeId,
            timestamp: Date.now()
        })

        let nextHops: string[] = []

        switch (strategy) {
            case RoutingStrategy.EPIDEMIC:
                nextHops = this.epidemicRouting(bundle)
                break

            case RoutingStrategy.SPRAY_AND_WAIT:
                nextHops = this.sprayAndWaitRouting(bundle)
                break

            case RoutingStrategy.GEOGRAPHIC:
                nextHops = this.geographicRouting(bundle)
                break

            case RoutingStrategy.PRIORITY_FIRST:
                nextHops = this.priorityFirstRouting(bundle)
                break

            default:
                nextHops = this.epidemicRouting(bundle)
        }

        // Update statistics
        if (nextHops.length > 0) {
            this.stats.bundles_forwarded++
        }

        return nextHops
    }

    // Epidemic routing - flood to all neighbors
    private epidemicRouting(bundle: DTNBundle): string[] {
        const neighbors = Array.from(this.neighbors.keys())

        // Don't send back to source or nodes in forwarding log
        const forwardedNodes = new Set([
            bundle.source,
            ...bundle.forwarding_log.map(hop => hop.node_id)
        ])

        return neighbors.filter(neighbor => !forwardedNodes.has(neighbor))
    }

    // Spray and Wait routing - limited flooding
    private sprayAndWaitRouting(bundle: DTNBundle): string[] {
        const sprayLimit = Math.max(1, Math.floor(Math.sqrt(this.neighbors.size)))
        const candidates = this.epidemicRouting(bundle)

        // Select best neighbors based on signal strength and route quality
        const rankedNeighbors = candidates
            .map(neighbor => ({
                id: neighbor,
                score: this.calculateNeighborScore(neighbor, bundle)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, sprayLimit)
            .map(n => n.id)

        return rankedNeighbors
    }

    // Geographic routing - route towards destination location
    private geographicRouting(bundle: DTNBundle): string[] {
        if (!bundle.routing_info.geographic_hint) {
            return this.epidemicRouting(bundle) // Fallback
        }

        const target = bundle.routing_info.geographic_hint
        const candidates = this.epidemicRouting(bundle)

        // Find neighbor closest to destination
        let bestNeighbor: string | null = null
        let bestDistance = Infinity

        for (const neighbor of candidates) {
            const neighborInfo = this.neighbors.get(neighbor)
            if (neighborInfo?.location) {
                const distance = this.calculateDistance(
                    neighborInfo.location.lat,
                    neighborInfo.location.lon,
                    target.lat,
                    target.lon
                )

                if (distance < bestDistance) {
                    bestDistance = distance
                    bestNeighbor = neighbor
                }
            }
        }

        return bestNeighbor ? [bestNeighbor] : candidates.slice(0, 1)
    }

    // Priority-first routing - prioritize high-priority bundles
    private priorityFirstRouting(bundle: DTNBundle): string[] {
        const candidates = this.epidemicRouting(bundle)

        if (bundle.priority >= BundlePriority.EXPEDITED) {
            // High priority - use all available neighbors
            return candidates
        } else {
            // Lower priority - use subset to preserve bandwidth
            return candidates.slice(0, Math.max(1, Math.floor(candidates.length / 2)))
        }
    }

    // Calculate neighbor score for routing decisions
    private calculateNeighborScore(neighborId: string, bundle: DTNBundle): number {
        const neighbor = this.neighbors.get(neighborId)
        if (!neighbor) return 0

        let score = 0

        // Signal strength factor (0-1)
        if (neighbor.signal_strength) {
            score += Math.max(0, (neighbor.signal_strength + 100) / 50) // -100 to -50 dBm range
        }

        // Route quality factor
        const routeEntry = this.routingTable.get(bundle.destination)
        if (routeEntry && routeEntry.next_hop === neighborId) {
            score += routeEntry.confidence * 2
        }

        // Avoid congested neighbors
        if (neighbor.queue_size && neighbor.queue_size > 10) {
            score *= 0.5
        }

        // Battery level factor
        if (neighbor.battery_level) {
            score += neighbor.battery_level / 100
        }

        return score
    }

    // Receive bundle from another node
    async receiveBundle(bundle: DTNBundle, fromNode: string): Promise<boolean> {
        // Verify bundle signature
        if (bundle.signature && !(await this.verifyBundleSignature(bundle))) {
            console.warn(`Invalid signature for bundle ${bundle.id}`)
            return false
        }

        // Check if we already have this bundle
        if (this.storage.bundles.has(bundle.id)) {
            return false // Duplicate
        }

        // Check if bundle is expired
        if (this.isBundleExpired(bundle)) {
            this.stats.bundles_expired++
            return false
        }

        // Check if this bundle is for us
        if (bundle.destination === this.nodeId || bundle.destination === 'broadcast') {
            await this.deliverBundle(bundle)
            return true
        }

        // Store and forward
        const stored = await this.storeBundle(bundle)
        if (stored) {
            // Schedule forwarding
            setTimeout(() => {
                this.forwardBundle(bundle, RoutingStrategy.SPRAY_AND_WAIT)
            }, Math.random() * 5000) // Random delay 0-5 seconds
        }

        return stored
    }

    // Deliver bundle to local application
    private async deliverBundle(bundle: DTNBundle): Promise<void> {
        console.log(`Delivering bundle ${bundle.id} from ${bundle.source}`)

        // Calculate delivery metrics
        const deliveryTime = Date.now() - bundle.creation_timestamp
        this.updateDeliveryStats(deliveryTime, bundle.routing_info.hop_count)

        this.stats.bundles_delivered++

        // Remove from storage
        this.storage.bundles.delete(bundle.id)
        this.storage.current_size -= this.calculateBundleSize(bundle)

        // Send delivery receipt if requested
        if (bundle.receipt_requested) {
            await this.sendDeliveryReceipt(bundle)
        }

        // Emit delivery event (for application layer)
        this.emitBundleDelivered(bundle)
    }

    // Garbage collection - remove expired/old bundles
    private async garbageCollect(): Promise<void> {
        const now = Date.now()
        const expiredBundles: string[] = []

        for (const [bundleId, bundle] of this.storage.bundles) {
            if (this.isBundleExpired(bundle)) {
                expiredBundles.push(bundleId)
            }
        }

        // Remove expired bundles
        for (const bundleId of expiredBundles) {
            this.expireBundle(bundleId)
        }

        // If still over capacity, remove oldest low-priority bundles
        if (this.storage.current_size > this.storage.size_limit * 0.9) {
            const sortedBundles = Array.from(this.storage.bundles.values())
                .sort((a, b) => {
                    if (a.priority !== b.priority) {
                        return a.priority - b.priority // Lower priority first
                    }
                    return a.creation_timestamp - b.creation_timestamp // Older first
                })

            for (const bundle of sortedBundles) {
                if (this.storage.current_size <= this.storage.size_limit * 0.8) {
                    break
                }

                if (bundle.priority <= BundlePriority.NORMAL) {
                    this.storage.bundles.delete(bundle.id)
                    this.storage.current_size -= this.calculateBundleSize(bundle)
                    this.stats.bundles_dropped++
                }
            }
        }

        this.updateStorageUtilization()
    }

    // Helper methods
    private async generateBundleId(): Promise<string> {
        const data = new TextEncoder().encode(`${this.nodeId}-${Date.now()}-${Math.random()}`)
        const hash = await webcrypto.subtle.digest('SHA-256', data)
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .substring(0, 16)
    }

    private async signBundle(bundle: DTNBundle): Promise<Uint8Array> {
        // Simplified signing - in production use proper key management
        const data = new TextEncoder().encode(JSON.stringify({
            id: bundle.id,
            source: bundle.source,
            destination: bundle.destination,
            timestamp: bundle.creation_timestamp
        }))
        const hash = await webcrypto.subtle.digest('SHA-256', data)
        return new Uint8Array(hash.slice(0, 32))
    }

    private async verifyBundleSignature(bundle: DTNBundle): Promise<boolean> {
        if (!bundle.signature) return false
        const expectedSignature = await this.signBundle(bundle)
        return this.arraysEqual(bundle.signature, expectedSignature)
    }

    private arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
        return a.length === b.length && a.every((v, i) => v === b[i])
    }

    private calculateBundleSize(bundle: DTNBundle): number {
        return bundle.payload.length + 1024 // Payload + estimated metadata
    }

    private isBundleExpired(bundle: DTNBundle): boolean {
        return Date.now() > bundle.creation_timestamp + bundle.lifetime
    }

    private expireBundle(bundleId: string): void {
        const bundle = this.storage.bundles.get(bundleId)
        if (bundle) {
            this.storage.bundles.delete(bundleId)
            this.storage.current_size -= this.calculateBundleSize(bundle)
            this.stats.bundles_expired++
        }
    }

    private updateStorageUtilization(): void {
        this.stats.storage_utilization = this.storage.current_size / this.storage.size_limit
    }

    private updateDeliveryStats(deliveryTime: number, hopCount: number): void {
        // Update average delivery time
        const totalDelivered = this.stats.bundles_delivered
        this.stats.avg_delivery_time =
            (this.stats.avg_delivery_time * totalDelivered + deliveryTime) / (totalDelivered + 1)

        // Update hop count distribution
        this.stats.hop_count_distribution[hopCount] =
            (this.stats.hop_count_distribution[hopCount] || 0) + 1
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371 // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    private async sendDeliveryReceipt(bundle: DTNBundle): Promise<void> {
        const receipt = await this.createBundle(
            bundle.source,
            new TextEncoder().encode(JSON.stringify({
                type: 'delivery_receipt',
                original_bundle_id: bundle.id,
                delivery_timestamp: Date.now(),
                hop_count: bundle.routing_info.hop_count
            })),
            BundlePriority.NORMAL,
            3600 // 1 hour lifetime
        )

        this.forwardBundle(receipt, RoutingStrategy.GEOGRAPHIC)
    }

    private emitBundleDelivered(bundle: DTNBundle): void {
        // Event emission for application layer integration
        console.log(`Bundle delivered: ${bundle.id}`)
    }

    private startCleanupTimer(): void {
        this.cleanupTimer = setInterval(() => {
            this.garbageCollect()
        }, this.storage.cleanup_interval)
    }

    // Public API methods
    public updateNeighbor(nodeId: string, info: NeighborInfo): void {
        this.neighbors.set(nodeId, info)
    }

    public removeNeighbor(nodeId: string): void {
        this.neighbors.delete(nodeId)
        // Remove routing entries for this neighbor
        for (const [dest, route] of this.routingTable) {
            if (route.next_hop === nodeId) {
                this.routingTable.delete(dest)
            }
        }
    }

    public updateRoute(destination: string, nextHop: string, metric: number, confidence: number = 1.0): void {
        this.routingTable.set(destination, {
            destination,
            next_hop: nextHop,
            metric,
            last_update: Date.now(),
            confidence
        })
    }

    public getStats(): DTNStats {
        return { ...this.stats }
    }

    public getStorageInfo(): { used: number, total: number, utilization: number } {
        return {
            used: this.storage.current_size,
            total: this.storage.size_limit,
            utilization: this.stats.storage_utilization
        }
    }

    public getBundleCount(): number {
        return this.storage.bundles.size
    }

    public cleanup(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer)
        }
        this.storage.bundles.clear()
    }
}

// Neighbor information interface
export interface NeighborInfo {
    node_id: string
    last_seen: number
    signal_strength?: number
    battery_level?: number
    queue_size?: number
    location?: {
        lat: number
        lon: number
        alt?: number
    }
    capabilities?: string[]
}

// Factory function
export function createDTNRouter(nodeId: string, storageLimitMB?: number): DTNRouter {
    return new DTNRouter(nodeId, storageLimitMB)
}
