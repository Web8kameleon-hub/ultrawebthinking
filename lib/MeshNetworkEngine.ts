/**
 * Mesh Network Topology Engine - Pure TypeScript
 * 
 * Advanced mesh network visualization and analytics
 * No dependencies, optimized for enterprise deployment
 */

export interface MeshNode {
    id: string;
    name: string;
    type: 'gateway' | 'relay' | 'endpoint' | 'bridge';
    position: { x: number; y: number; z: number };
    status: 'online' | 'offline' | 'warning' | 'error';
    connections: string[];
    metrics: {
        latency: number;
        throughput: number;
        reliability: number;
        battery?: number;
    };
    lastSeen: number;
}

export interface MeshLink {
    id: string;
    source: string;
    target: string;
    type: 'lora' | 'wifi' | 'dtn' | 'satellite';
    strength: number; // 0-1
    latency: number;
    bandwidth: number;
    status: 'active' | 'inactive' | 'congested';
    packets: number;
    errors: number;
}

export interface NetworkMetrics {
    totalNodes: number;
    activeNodes: number;
    totalLinks: number;
    activeLinks: number;
    averageLatency: number;
    totalThroughput: number;
    networkReliability: number;
    coverage: number;
}

export interface TopologyEvent {
    type: 'node_added' | 'node_removed' | 'node_updated' | 'link_added' | 'link_removed' | 'link_updated' | 'topology_changed';
    timestamp: number;
    data: any;
}

export class MeshNetworkEngine {
    private nodes: Map<string, MeshNode> = new Map();
    private links: Map<string, MeshLink> = new Map();
    private eventHandlers: Map<string, Function[]> = new Map();
    private updateInterval: NodeJS.Timeout | null = null;
    private startTime: number = Date.now();

    constructor() {
        this.startPeriodicUpdates();
        this.generateSampleTopology();
    }

    /**
     * Add a node to the mesh network
     */
    addNode(node: MeshNode): void {
        this.nodes.set(node.id, node);
        this.emitEvent({
            type: 'node_added',
            timestamp: Date.now(),
            data: node
        });
    }

    /**
     * Remove a node from the network
     */
    removeNode(nodeId: string): void {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        // Remove all links to this node
        for (const [linkId, link] of this.links.entries()) {
            if (link.source === nodeId || link.target === nodeId) {
                this.links.delete(linkId);
            }
        }

        this.nodes.delete(nodeId);
        this.emitEvent({
            type: 'node_removed',
            timestamp: Date.now(),
            data: { nodeId }
        });
    }

    /**
     * Add a link between nodes
     */
    addLink(link: MeshLink): void {
        this.links.set(link.id, link);

        // Update node connections
        const sourceNode = this.nodes.get(link.source);
        const targetNode = this.nodes.get(link.target);

        if (sourceNode && !sourceNode.connections.includes(link.target)) {
            sourceNode.connections.push(link.target);
        }
        if (targetNode && !targetNode.connections.includes(link.source)) {
            targetNode.connections.push(link.source);
        }

        this.emitEvent({
            type: 'link_added',
            timestamp: Date.now(),
            data: link
        });
    }

    /**
     * Remove a link
     */
    removeLink(linkId: string): void {
        const link = this.links.get(linkId);
        if (!link) return;

        // Update node connections
        const sourceNode = this.nodes.get(link.source);
        const targetNode = this.nodes.get(link.target);

        if (sourceNode) {
            sourceNode.connections = sourceNode.connections.filter(c => c !== link.target);
        }
        if (targetNode) {
            targetNode.connections = targetNode.connections.filter(c => c !== link.source);
        }

        this.links.delete(linkId);
        this.emitEvent({
            type: 'link_removed',
            timestamp: Date.now(),
            data: { linkId }
        });
    }

    /**
     * Update node metrics
     */
    updateNodeMetrics(nodeId: string, metrics: Partial<MeshNode['metrics']>): void {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.metrics = { ...node.metrics, ...metrics };
            node.lastSeen = Date.now();

            this.emitEvent({
                type: 'node_updated',
                timestamp: Date.now(),
                data: { nodeId, metrics }
            });
        }
    }

    /**
     * Update link metrics
     */
    updateLinkMetrics(linkId: string, metrics: Partial<MeshLink>): void {
        const link = this.links.get(linkId);
        if (link) {
            Object.assign(link, metrics);

            this.emitEvent({
                type: 'link_updated',
                timestamp: Date.now(),
                data: { linkId, metrics }
            });
        }
    }

    /**
     * Get all nodes
     */
    getNodes(): MeshNode[] {
        return Array.from(this.nodes.values());
    }

    /**
     * Get all links
     */
    getLinks(): MeshLink[] {
        return Array.from(this.links.values());
    }

    /**
     * Get network metrics
     */
    getNetworkMetrics(): NetworkMetrics {
        const nodes = Array.from(this.nodes.values());
        const links = Array.from(this.links.values());

        const activeNodes = nodes.filter(n => n.status === 'online').length;
        const activeLinks = links.filter(l => l.status === 'active').length;

        const averageLatency = activeLinks > 0
            ? links.reduce((sum, l) => sum + l.latency, 0) / activeLinks
            : 0;

        const totalThroughput = links.reduce((sum, l) => sum + l.bandwidth, 0);

        const networkReliability = nodes.length > 0
            ? nodes.reduce((sum, n) => sum + n.metrics.reliability, 0) / nodes.length
            : 0;

        return {
            totalNodes: nodes.length,
            activeNodes,
            totalLinks: links.length,
            activeLinks,
            averageLatency,
            totalThroughput,
            networkReliability,
            coverage: activeNodes / Math.max(nodes.length, 1) * 100
        };
    }

    /**
     * Find shortest path between nodes using Dijkstra's algorithm
     */
    findShortestPath(sourceId: string, targetId: string): string[] {
        if (sourceId === targetId) return [sourceId];

        const distances: Map<string, number> = new Map();
        const previous: Map<string, string> = new Map();
        const visited: Set<string> = new Set();
        const queue: string[] = [];

        // Initialize distances
        for (const nodeId of this.nodes.keys()) {
            distances.set(nodeId, nodeId === sourceId ? 0 : Infinity);
            queue.push(nodeId);
        }

        while (queue.length > 0) {
            // Find node with minimum distance
            let currentNode = queue[0];
            let minDistance = distances.get(currentNode) || Infinity;

            for (const nodeId of queue) {
                const distance = distances.get(nodeId) || Infinity;
                if (distance < minDistance) {
                    minDistance = distance;
                    currentNode = nodeId;
                }
            }

            // Remove from queue
            const index = queue.indexOf(currentNode);
            queue.splice(index, 1);
            visited.add(currentNode);

            if (currentNode === targetId) break;

            // Check neighbors
            const node = this.nodes.get(currentNode);
            if (!node) continue;

            for (const neighborId of node.connections) {
                if (visited.has(neighborId)) continue;

                const link = this.findLinkBetween(currentNode, neighborId);
                if (!link || link.status !== 'active') continue;

                const newDistance = (distances.get(currentNode) || 0) + link.latency;

                if (newDistance < (distances.get(neighborId) || Infinity)) {
                    distances.set(neighborId, newDistance);
                    previous.set(neighborId, currentNode);
                }
            }
        }

        // Reconstruct path
        const path: string[] = [];
        let current = targetId;

        while (current !== undefined) {
            path.unshift(current);
            current = previous.get(current) || '';
            if (current === '') break;
        }

        return path.length > 1 && path[0] === sourceId ? path : [];
    }

    /**
     * Find link between two nodes
     */
    findLinkBetween(node1: string, node2: string): MeshLink | null {
        for (const link of this.links.values()) {
            if ((link.source === node1 && link.target === node2) ||
                (link.source === node2 && link.target === node1)) {
                return link;
            }
        }
        return null;
    }

    /**
     * Get nodes within range of a position
     */
    getNodesInRange(position: { x: number; y: number; z: number }, range: number): MeshNode[] {
        return Array.from(this.nodes.values()).filter(node => {
            const distance = Math.sqrt(
                Math.pow(node.position.x - position.x, 2) +
                Math.pow(node.position.y - position.y, 2) +
                Math.pow(node.position.z - position.z, 2)
            );
            return distance <= range;
        });
    }

    /**
     * Analyze network connectivity
     */
    analyzeConnectivity(): {
        components: string[][];
        bridges: string[];
        articulationPoints: string[];
        diameter: number;
    } {
        const components = this.findConnectedComponents();
        const bridges = this.findBridges();
        const articulationPoints = this.findArticulationPoints();
        const diameter = this.calculateNetworkDiameter();

        return {
            components,
            bridges,
            articulationPoints,
            diameter
        };
    }

    /**
     * Subscribe to topology events
     */
    on(eventType: string, handler: Function): void {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType)!.push(handler);
    }

    /**
     * Unsubscribe from events
     */
    off(eventType: string, handler: Function): void {
        const handlers = this.eventHandlers.get(eventType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * Emit an event
     */
    private emitEvent(event: TopologyEvent): void {
        const handlers = this.eventHandlers.get(event.type);
        if (handlers) {
            handlers.forEach(handler => handler(event));
        }
    }

    /**
     * Generate sample network topology
     */
    private generateSampleTopology(): void {
        // Create gateway nodes
        for (let i = 0; i < 3; i++) {
            this.addNode({
                id: `gateway-${i}`,
                name: `Gateway ${i}`,
                type: 'gateway',
                position: {
                    x: Math.cos(i * 2 * Math.PI / 3) * 200,
                    y: Math.sin(i * 2 * Math.PI / 3) * 200,
                    z: 0
                },
                status: 'online',
                connections: [],
                metrics: {
                    latency: 5 + Math.random() * 10,
                    throughput: 500 + Math.random() * 500,
                    reliability: 0.95 + Math.random() * 0.05
                },
                lastSeen: Date.now()
            });
        }

        // Create relay nodes
        for (let i = 0; i < 8; i++) {
            this.addNode({
                id: `relay-${i}`,
                name: `Relay ${i}`,
                type: 'relay',
                position: {
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    z: (Math.random() - 0.5) * 100
                },
                status: Math.random() > 0.1 ? 'online' : 'warning',
                connections: [],
                metrics: {
                    latency: 10 + Math.random() * 20,
                    throughput: 100 + Math.random() * 200,
                    reliability: 0.8 + Math.random() * 0.15,
                    battery: 20 + Math.random() * 80
                },
                lastSeen: Date.now() - Math.random() * 60000
            });
        }

        // Create endpoint nodes
        for (let i = 0; i < 15; i++) {
            this.addNode({
                id: `endpoint-${i}`,
                name: `Endpoint ${i}`,
                type: 'endpoint',
                position: {
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 600,
                    z: (Math.random() - 0.5) * 50
                },
                status: Math.random() > 0.2 ? 'online' : Math.random() > 0.5 ? 'warning' : 'offline',
                connections: [],
                metrics: {
                    latency: 15 + Math.random() * 30,
                    throughput: 10 + Math.random() * 50,
                    reliability: 0.7 + Math.random() * 0.2,
                    battery: Math.random() * 100
                },
                lastSeen: Date.now() - Math.random() * 300000
            });
        }

        // Create links between nearby nodes
        this.generateLinks();
    }

    /**
     * Generate links between nodes based on proximity
     */
    private generateLinks(): void {
        const nodes = Array.from(this.nodes.values());
        const linkTypes: MeshLink['type'][] = ['lora', 'wifi', 'dtn', 'satellite'];

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const node1 = nodes[i];
                const node2 = nodes[j];

                const distance = Math.sqrt(
                    Math.pow(node1.position.x - node2.position.x, 2) +
                    Math.pow(node1.position.y - node2.position.y, 2) +
                    Math.pow(node1.position.z - node2.position.z, 2)
                );

                // Connect nodes based on type and distance
                let shouldConnect = false;
                let maxDistance = 0;

                if (node1.type === 'gateway' || node2.type === 'gateway') {
                    maxDistance = 300;
                    shouldConnect = distance < maxDistance && Math.random() > 0.3;
                } else if (node1.type === 'relay' || node2.type === 'relay') {
                    maxDistance = 200;
                    shouldConnect = distance < maxDistance && Math.random() > 0.4;
                } else {
                    maxDistance = 150;
                    shouldConnect = distance < maxDistance && Math.random() > 0.6;
                }

                if (shouldConnect) {
                    const linkType = linkTypes[Math.floor(Math.random() * linkTypes.length)];

                    this.addLink({
                        id: `link-${node1.id}-${node2.id}`,
                        source: node1.id,
                        target: node2.id,
                        type: linkType,
                        strength: Math.max(0.1, 1 - distance / maxDistance),
                        latency: distance / 10 + Math.random() * 20,
                        bandwidth: Math.random() * 100 + 50,
                        status: Math.random() > 0.1 ? 'active' : 'inactive',
                        packets: Math.floor(Math.random() * 10000),
                        errors: Math.floor(Math.random() * 100)
                    });
                }
            }
        }
    }

    /**
     * Start periodic updates
     */
    private startPeriodicUpdates(): void {
        this.updateInterval = setInterval(() => {
            this.updateNetworkStatus();
        }, 5000);
    }

    /**
     * Update network status periodically
     */
    private updateNetworkStatus(): void {
        for (const node of this.nodes.values()) {
            // Simulate metric changes
            if (Math.random() > 0.8) {
                node.metrics.latency += (Math.random() - 0.5) * 10;
                node.metrics.throughput += (Math.random() - 0.5) * 50;
                node.metrics.reliability += (Math.random() - 0.5) * 0.1;

                if (node.metrics.battery !== undefined) {
                    node.metrics.battery = Math.max(0, node.metrics.battery - Math.random() * 0.5);
                }

                // Clamp values
                node.metrics.latency = Math.max(1, node.metrics.latency);
                node.metrics.throughput = Math.max(1, node.metrics.throughput);
                node.metrics.reliability = Math.max(0, Math.min(1, node.metrics.reliability));
            }
        }

        for (const link of this.links.values()) {
            // Simulate traffic
            if (Math.random() > 0.7) {
                link.packets += Math.floor(Math.random() * 100);
                link.bandwidth += (Math.random() - 0.5) * 20;
                link.bandwidth = Math.max(1, link.bandwidth);

                if (Math.random() > 0.95) {
                    link.errors += Math.floor(Math.random() * 5);
                }
            }
        }

        this.emitEvent({
            type: 'topology_changed',
            timestamp: Date.now(),
            data: this.getNetworkMetrics()
        });
    }

    /**
     * Find connected components
     */
    private findConnectedComponents(): string[][] {
        const visited: Set<string> = new Set();
        const components: string[][] = [];

        for (const nodeId of this.nodes.keys()) {
            if (!visited.has(nodeId)) {
                const component: string[] = [];
                this.dfsComponent(nodeId, visited, component);
                components.push(component);
            }
        }

        return components;
    }

    /**
     * DFS for component finding
     */
    private dfsComponent(nodeId: string, visited: Set<string>, component: string[]): void {
        visited.add(nodeId);
        component.push(nodeId);

        const node = this.nodes.get(nodeId);
        if (node) {
            for (const connectedId of node.connections) {
                if (!visited.has(connectedId)) {
                    this.dfsComponent(connectedId, visited, component);
                }
            }
        }
    }

    /**
     * Find bridge links (critical connections)
     */
    private findBridges(): string[] {
        // Simplified bridge finding algorithm
        const bridges: string[] = [];

        for (const link of this.links.values()) {
            // Temporarily remove link and check connectivity
            this.removeLink(link.id);

            const path = this.findShortestPath(link.source, link.target);
            if (path.length === 0) {
                bridges.push(link.id);
            }

            // Restore link
            this.addLink(link);
        }

        return bridges;
    }

    /**
     * Find articulation points (critical nodes)
     */
    private findArticulationPoints(): string[] {
        const articulationPoints: string[] = [];
        const originalComponents = this.findConnectedComponents().length;

        for (const nodeId of this.nodes.keys()) {
            // Temporarily remove node
            const node = this.nodes.get(nodeId)!;
            const nodeLinks: MeshLink[] = [];

            // Store and remove all links to this node
            for (const link of this.links.values()) {
                if (link.source === nodeId || link.target === nodeId) {
                    nodeLinks.push(link);
                    this.removeLink(link.id);
                }
            }
            this.removeNode(nodeId);

            // Check if removing this node increases components
            const newComponents = this.findConnectedComponents().length;
            if (newComponents > originalComponents) {
                articulationPoints.push(nodeId);
            }

            // Restore node and links
            this.addNode(node);
            nodeLinks.forEach(link => this.addLink(link));
        }

        return articulationPoints;
    }

    /**
     * Calculate network diameter
     */
    private calculateNetworkDiameter(): number {
        let maxDistance = 0;
        const nodeIds = Array.from(this.nodes.keys());

        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                const path = this.findShortestPath(nodeIds[i], nodeIds[j]);
                if (path.length > maxDistance) {
                    maxDistance = path.length;
                }
            }
        }

        return maxDistance;
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.nodes.clear();
        this.links.clear();
        this.eventHandlers.clear();
    }
}

// Export singleton instance
export const meshNetworkEngine = new MeshNetworkEngine();
