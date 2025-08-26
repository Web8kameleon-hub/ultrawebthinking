/**
 * DTN (Delay-Tolerant Networking) Implementation
 * 
 * Provides store-and-forward capabilities for mesh networking
 * Handles multi-hop routing and message persistence
 */

import { EventEmitter } from 'events';

export interface DTNMessage {
    id: string;
    source: string;
    destination: string;
    payload: any;
    ttl: number;
    timestamp: number;
    hops: string[];
    priority: 'high' | 'medium' | 'low';
    requiresAck: boolean;
}

export interface DTNNode {
    nodeId: string;
    lastSeen: number;
    reliability: number; // 0-1
    latency: number; // ms
    capacity: number; // bytes/sec
}

export interface DTNRoute {
    destination: string;
    nextHop: string;
    cost: number;
    hops: number;
    lastUpdated: number;
}

export class DTNEngine extends EventEmitter {
    private messageStore: Map<string, DTNMessage> = new Map();
    private routingTable: Map<string, DTNRoute> = new Map();
    private nodeTable: Map<string, DTNNode> = new Map();
    private forwardingQueue: DTNMessage[] = [];
    private nodeId: string;
    private maxStorageSize: number = 100 * 1024 * 1024; // 100MB
    private maxTTL: number = 24 * 60 * 60 * 1000; // 24 hours
    private forwardingInterval: NodeJS.Timeout | null = null;

    constructor(nodeId: string) {
        super();
        this.nodeId = nodeId;
        this.startForwardingLoop();
        this.startRoutingUpdates();
    }

    /**
     * Send a message through the DTN network
     */
    async sendMessage(
        destination: string,
        payload: any,
        options: {
            priority?: 'high' | 'medium' | 'low';
            requiresAck?: boolean;
            ttl?: number;
        } = {}
    ): Promise<string> {
        const message: DTNMessage = {
            id: this.generateMessageId(),
            source: this.nodeId,
            destination,
            payload,
            ttl: options.ttl || this.maxTTL,
            timestamp: Date.now(),
            hops: [this.nodeId],
            priority: options.priority || 'medium',
            requiresAck: options.requiresAck || false
        };

        // Store message locally
        this.messageStore.set(message.id, message);

        // Try immediate delivery
        const route = this.findRoute(destination);
        if (route) {
            await this.forwardMessage(message, route.nextHop);
        } else {
            // Queue for later delivery
            this.forwardingQueue.push(message);
            this.emit('messageQueued', message);
        }

        this.emit('messageSent', message);
        return message.id;
    }

    /**
     * Receive a message from another node
     */
    async receiveMessage(message: DTNMessage, fromNode: string): Promise<void> {
        // Check if we've seen this message before
        if (this.messageStore.has(message.id)) {
            return; // Duplicate, ignore
        }

        // Check TTL
        if (Date.now() - message.timestamp > message.ttl) {
            this.emit('messageExpired', message);
            return;
        }

        // Store message
        this.messageStore.set(message.id, message);

        // Update node information
        this.updateNodeInfo(fromNode);

        // Check if message is for us
        if (message.destination === this.nodeId) {
            this.emit('messageReceived', message);

            // Send ACK if required
            if (message.requiresAck) {
                await this.sendAck(message);
            }
            return;
        }

        // Forward message if not for us
        message.hops.push(this.nodeId);

        const route = this.findRoute(message.destination);
        if (route && route.nextHop !== fromNode) {
            await this.forwardMessage(message, route.nextHop);
        } else {
            // Queue for later forwarding
            this.forwardingQueue.push(message);
        }
    }

    /**
     * Update routing table with new route information
     */
    updateRoute(destination: string, nextHop: string, cost: number, hops: number): void {
        const existingRoute = this.routingTable.get(destination);

        if (!existingRoute || cost < existingRoute.cost) {
            this.routingTable.set(destination, {
                destination,
                nextHop,
                cost,
                hops,
                lastUpdated: Date.now()
            });

            this.emit('routeUpdated', { destination, nextHop, cost, hops });
        }
    }

    /**
     * Update node information
     */
    updateNodeInfo(nodeId: string, reliability?: number, latency?: number): void {
        const existing = this.nodeTable.get(nodeId);

        this.nodeTable.set(nodeId, {
            nodeId,
            lastSeen: Date.now(),
            reliability: reliability || existing?.reliability || 0.8,
            latency: latency || existing?.latency || 100,
            capacity: existing?.capacity || 1024 * 1024 // 1MB/s default
        });
    }

    /**
     * Get network statistics
     */
    getStats() {
        const routes = Array.from(this.routingTable.values());
        const nodes = Array.from(this.nodeTable.values());
        const messages = Array.from(this.messageStore.values());

        return {
            nodeId: this.nodeId,
            totalRoutes: routes.length,
            totalNodes: nodes.length,
            storedMessages: messages.length,
            queuedMessages: this.forwardingQueue.length,
            storageUsed: this.calculateStorageUsed(),
            uptime: Date.now() - (this.startTime || Date.now()),
            routes: routes.slice(0, 10), // First 10 routes
            recentMessages: messages
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5)
        };
    }

    /**
     * Find route to destination
     */
    private findRoute(destination: string): DTNRoute | null {
        return this.routingTable.get(destination) || null;
    }

    /**
     * Forward message to next hop
     */
    private async forwardMessage(message: DTNMessage, nextHop: string): Promise<void> {
        try {
            // Simulate network transmission
            this.emit('messageForwarded', { message, nextHop });

            // In real implementation, this would send to actual node
            // For now, we'll emit an event for the UI to handle
            this.emit('transmit', {
                type: 'dtn_message',
                destination: nextHop,
                data: message
            });

        } catch (error) {
            this.emit('forwardingError', { message, nextHop, error });

            // Re-queue for later retry
            this.forwardingQueue.push(message);
        }
    }

    /**
     * Send acknowledgment
     */
    private async sendAck(originalMessage: DTNMessage): Promise<void> {
        const ackMessage: DTNMessage = {
            id: this.generateMessageId(),
            source: this.nodeId,
            destination: originalMessage.source,
            payload: {
                type: 'ack',
                originalMessageId: originalMessage.id
            },
            ttl: 60 * 1000, // 1 minute TTL for ACKs
            timestamp: Date.now(),
            hops: [this.nodeId],
            priority: 'high',
            requiresAck: false
        };

        const route = this.findRoute(originalMessage.source);
        if (route) {
            await this.forwardMessage(ackMessage, route.nextHop);
        }
    }

    /**
     * Start forwarding loop for queued messages
     */
    private startForwardingLoop(): void {
        this.forwardingInterval = setInterval(() => {
            const messagesToRetry = [...this.forwardingQueue];
            this.forwardingQueue = [];

            for (const message of messagesToRetry) {
                // Check if message has expired
                if (Date.now() - message.timestamp > message.ttl) {
                    this.emit('messageExpired', message);
                    continue;
                }

                // Try to find route again
                const route = this.findRoute(message.destination);
                if (route) {
                    this.forwardMessage(message, route.nextHop);
                } else {
                    // Still no route, re-queue
                    this.forwardingQueue.push(message);
                }
            }
        }, 5000); // Check every 5 seconds
    }

    /**
     * Start routing table updates
     */
    private startRoutingUpdates(): void {
        setInterval(() => {
            // Clean up old routes
            const now = Date.now();
            for (const [dest, route] of this.routingTable.entries()) {
                if (now - route.lastUpdated > 5 * 60 * 1000) { // 5 minutes
                    this.routingTable.delete(dest);
                    this.emit('routeExpired', route);
                }
            }

            // Clean up old messages
            for (const [id, message] of this.messageStore.entries()) {
                if (now - message.timestamp > message.ttl) {
                    this.messageStore.delete(id);
                    this.emit('messageExpired', message);
                }
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Generate unique message ID
     */
    private generateMessageId(): string {
        return `${this.nodeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Calculate storage used
     */
    private calculateStorageUsed(): number {
        let totalSize = 0;
        for (const message of this.messageStore.values()) {
            totalSize += JSON.stringify(message).length;
        }
        return totalSize;
    }

    private startTime = Date.now();

    /**
     * Cleanup resources
     */
    destroy(): void {
        if (this.forwardingInterval) {
            clearInterval(this.forwardingInterval);
        }
        this.messageStore.clear();
        this.routingTable.clear();
        this.nodeTable.clear();
        this.forwardingQueue = [];
        this.removeAllListeners();
    }
}

// Export singleton instance
export const dtnEngine = new DTNEngine(`node-${Date.now()}`);
