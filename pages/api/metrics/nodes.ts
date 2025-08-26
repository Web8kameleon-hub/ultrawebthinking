// pages/api/metrics/nodes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import si from 'systeminformation';

interface NodeMetrics {
    nodeId: string;
    status: 'online' | 'offline' | 'degraded';
    lastSeen: string;
    uptime: number;
    cpu: number;
    memory: number;
    network: {
        rx: number;
        tx: number;
    };
    responseTime: number;
}

interface NodesResponse {
    total: number;
    online: number;
    offline: number;
    degraded: number;
    nodes: NodeMetrics[];
    lastUpdate: string;
}

// Simulated node data - în production kjo do të vinte nga database
const simulateNodeMetrics = async (): Promise<NodeMetrics[]> => {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const network = await si.networkStats();

    const nodes: NodeMetrics[] = [
        {
            nodeId: 'node-med-001',
            status: 'online',
            lastSeen: new Date().toISOString(),
            uptime: 99.8,
            cpu: cpu.currentLoad,
            memory: (mem.used / mem.total) * 100,
            network: {
                rx: network[0]?.rx_bytes || 0,
                tx: network[0]?.tx_bytes || 0
            },
            responseTime: Math.random() * 50 + 10
        },
        {
            nodeId: 'node-api-002',
            status: 'online',
            lastSeen: new Date().toISOString(),
            uptime: 97.5,
            cpu: Math.random() * 80 + 10,
            memory: Math.random() * 70 + 20,
            network: {
                rx: Math.random() * 1000000,
                tx: Math.random() * 800000
            },
            responseTime: Math.random() * 30 + 5
        },
        {
            nodeId: 'node-db-003',
            status: 'degraded',
            lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
            uptime: 85.2,
            cpu: Math.random() * 95 + 5,
            memory: Math.random() * 90 + 10,
            network: {
                rx: Math.random() * 500000,
                tx: Math.random() * 300000
            },
            responseTime: Math.random() * 200 + 100
        },
        {
            nodeId: 'node-cache-004',
            status: 'offline',
            lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            uptime: 0,
            cpu: 0,
            memory: 0,
            network: {
                rx: 0,
                tx: 0
            },
            responseTime: 0
        },
        {
            nodeId: 'node-backup-005',
            status: 'offline',
            lastSeen: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            uptime: 0,
            cpu: 0,
            memory: 0,
            network: {
                rx: 0,
                tx: 0
            },
            responseTime: 0
        }
    ];

    return nodes;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<NodesResponse | { error: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const nodes = await simulateNodeMetrics();

        const metrics = {
            total: nodes.length,
            online: nodes.filter(n => n.status === 'online').length,
            offline: nodes.filter(n => n.status === 'offline').length,
            degraded: nodes.filter(n => n.status === 'degraded').length,
            nodes,
            lastUpdate: new Date().toISOString()
        };

        res.status(200).json(metrics);
    } catch (error) {
        console.error('Error fetching node metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
