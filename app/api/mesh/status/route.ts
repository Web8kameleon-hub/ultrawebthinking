// app/api/mesh/status/route.ts
// LoRa Mesh Network Status API
// Real-time mesh network monitoring and statistics

import { NextRequest, NextResponse } from 'next/server'

// Mock mesh network topology
const MOCK_MESH_TOPOLOGY = {
    nodes: [
        {
            id: 'GW001',
            type: 'gateway',
            location: { lat: 45.1234, lon: 11.6789, alt: 145 },
            status: 'online',
            battery: 95,
            signal_strength: -75,
            last_seen: Date.now() - 30000,
            firmware: '2.1.3',
            uptime: 86400 * 5, // 5 days
            duty_cycle: 0.008,
            tx_count: 1247,
            rx_count: 892
        },
        {
            id: 'REL001',
            type: 'relay',
            location: { lat: 45.1245, lon: 11.6801, alt: 152 },
            status: 'online',
            battery: 78,
            signal_strength: -82,
            last_seen: Date.now() - 45000,
            firmware: '2.1.3',
            uptime: 86400 * 3,
            duty_cycle: 0.005,
            tx_count: 567,
            rx_count: 1123
        },
        {
            id: 'GND001',
            type: 'ground',
            location: { lat: 45.1256, lon: 11.6812, alt: 148 },
            status: 'offline',
            battery: 23,
            signal_strength: -95,
            last_seen: Date.now() - 900000, // 15 minutes ago
            firmware: '2.1.2',
            uptime: 86400 * 2,
            duty_cycle: 0.001,
            tx_count: 234,
            rx_count: 456
        },
        {
            id: 'FLT001',
            type: 'flight',
            location: { lat: 45.1389, lon: 11.7234, alt: 8500 },
            status: 'online',
            battery: 89,
            signal_strength: -78,
            last_seen: Date.now() - 15000,
            firmware: '2.1.3',
            uptime: 3600 * 4, // 4 hours
            duty_cycle: 0.012,
            tx_count: 89,
            rx_count: 156
        }
    ],
    links: [
        {
            from: 'GW001',
            to: 'REL001',
            quality: 0.94,
            latency: 150,
            packet_loss: 0.02,
            rssi: -75,
            snr: 8.5
        },
        {
            from: 'REL001',
            to: 'GND001',
            quality: 0.65,
            latency: 450,
            packet_loss: 0.15,
            rssi: -88,
            snr: 3.2
        },
        {
            from: 'GW001',
            to: 'FLT001',
            quality: 0.87,
            latency: 200,
            packet_loss: 0.05,
            rssi: -78,
            snr: 6.8
        }
    ],
    alerts: [
        {
            id: 'ALT001',
            type: 'NODE_OFFLINE',
            severity: 'HIGH',
            node_id: 'GND001',
            message: 'Ground station GND001 offline for 15 minutes',
            timestamp: Date.now() - 900000,
            acknowledged: false
        },
        {
            id: 'ALT002',
            type: 'BATTERY_LOW',
            severity: 'MEDIUM',
            node_id: 'GND001',
            message: 'Battery level critical: 23%',
            timestamp: Date.now() - 1800000,
            acknowledged: false
        },
        {
            id: 'ALT003',
            type: 'DUTY_CYCLE_HIGH',
            severity: 'LOW',
            node_id: 'FLT001',
            message: 'Duty cycle approaching limit: 1.2%',
            timestamp: Date.now() - 300000,
            acknowledged: true
        }
    ]
}

// Generate dynamic statistics
function generateNetworkStats() {
    const onlineNodes = MOCK_MESH_TOPOLOGY.nodes.filter(n => n.status === 'online').length
    const totalNodes = MOCK_MESH_TOPOLOGY.nodes.length

    const avgSignalStrength = MOCK_MESH_TOPOLOGY.nodes
        .filter(n => n.status === 'online')
        .reduce((sum, n) => sum + n.signal_strength, 0) / onlineNodes

    const avgLinkQuality = MOCK_MESH_TOPOLOGY.links
        .reduce((sum, l) => sum + l.quality, 0) / MOCK_MESH_TOPOLOGY.links.length

    const totalTxCount = MOCK_MESH_TOPOLOGY.nodes
        .reduce((sum, n) => sum + n.tx_count, 0)

    const totalRxCount = MOCK_MESH_TOPOLOGY.nodes
        .reduce((sum, n) => sum + n.rx_count, 0)

    const unacknowledgedAlerts = MOCK_MESH_TOPOLOGY.alerts
        .filter(a => !a.acknowledged).length

    return {
        network_health: Math.min(0.95, avgLinkQuality),
        nodes_online: onlineNodes,
        nodes_total: totalNodes,
        coverage_percentage: (onlineNodes / totalNodes) * 100,
        avg_signal_strength: avgSignalStrength,
        avg_link_quality: avgLinkQuality,
        total_packets_tx: totalTxCount,
        total_packets_rx: totalRxCount,
        packet_success_rate: totalRxCount / (totalTxCount + totalRxCount),
        active_alerts: unacknowledgedAlerts,
        duty_cycle_compliance: MOCK_MESH_TOPOLOGY.nodes
            .every(n => n.duty_cycle < 0.01),
        uptime_hours: Math.min(...MOCK_MESH_TOPOLOGY.nodes.map(n => n.uptime / 3600))
    }
}

// Simulate real-time updates
function addRandomVariation() {
    // Slightly vary signal strengths
    MOCK_MESH_TOPOLOGY.nodes.forEach(node => {
        if (node.status === 'online') {
            node.signal_strength += (Math.random() - 0.5) * 3
            node.signal_strength = Math.max(-100, Math.min(-50, node.signal_strength))

            // Update last seen
            node.last_seen = Date.now() - Math.random() * 60000 // 0-1 minute ago

            // Increment packet counts
            node.tx_count += Math.floor(Math.random() * 3)
            node.rx_count += Math.floor(Math.random() * 5)
        }
    })

    // Vary link qualities
    MOCK_MESH_TOPOLOGY.links.forEach(link => {
        link.quality += (Math.random() - 0.5) * 0.05
        link.quality = Math.max(0.5, Math.min(0.99, link.quality))

        link.latency += (Math.random() - 0.5) * 50
        link.latency = Math.max(100, Math.min(1000, link.latency))
    })
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const includeTopology = searchParams.get('topology') === 'true'
        const includeAlerts = searchParams.get('alerts') === 'true'

        // Add some random variation for live demo
        addRandomVariation()

        // Generate current statistics  
        const stats = generateNetworkStats()

        const response: any = {
            success: true,
            timestamp: new Date().toISOString(),
            mesh_status: 'operational',
            statistics: stats
        }

        // Include topology if requested
        if (includeTopology) {
            response.topology = {
                nodes: MOCK_MESH_TOPOLOGY.nodes,
                links: MOCK_MESH_TOPOLOGY.links
            }
        }

        // Include alerts if requested
        if (includeAlerts) {
            response.alerts = MOCK_MESH_TOPOLOGY.alerts
        }

        return NextResponse.json(response)

    } catch (error) {
        console.error('Mesh status API error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch mesh status',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { action, node_id, alert_id } = await request.json()

        switch (action) {
            case 'acknowledge_alert':
                if (alert_id) {
                    const alert = MOCK_MESH_TOPOLOGY.alerts.find(a => a.id === alert_id)
                    if (alert) {
                        alert.acknowledged = true
                    }
                }
                break

            case 'restart_node':
                if (node_id) {
                    const node = MOCK_MESH_TOPOLOGY.nodes.find(n => n.id === node_id)
                    if (node) {
                        node.uptime = 0
                        node.status = 'online'
                        node.last_seen = Date.now()
                    }
                }
                break

            case 'update_config':
                // Handle configuration updates
                console.log('Config update requested for node:', node_id)
                break

            default:
                return NextResponse.json({
                    success: false,
                    error: 'Unknown action'
                }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'Action completed',
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Mesh control API error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to execute mesh action',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
