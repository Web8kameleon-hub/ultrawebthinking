/**
 * EuroWeb Ultra - Advanced Mesh Network 3D Topology Engine
 * 
 * Enterprise-grade TypeScript implementation for real-time mesh visualization
 * Built with performance and scalability in mind
 * 
 * @author GitHub Copilot & EuroWeb Ultra Team
 * @version 3.0.0 - Week 2 Implementation
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Wifi,
    Radio,
    Globe,
    Smartphone,
    MapPin,
    Activity,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Navigation,
    RotateCcw,
    Layers,
    Bluetooth,
    Shield,
    Zap,
    Network
} from 'lucide-react';

// Core TypeScript Interfaces - Enterprise Grade
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
    capabilities: {
        wifi_direct: boolean;
        bluetooth: boolean;
        lora: boolean;
        cellular: boolean;
        storage_mb: number;
        battery_level?: number;
    };
    traffic: {
        tx_mbps: number;
        rx_mbps: number;
        packets_sent: number;
        packets_received: number;
    };
}

export interface MeshLink {
    id: string;
    source: string;
    target: string;
    type: 'lora' | 'wifi' | 'dtn' | 'satellite' | 'wifi_direct' | 'bluetooth' | 'cellular';
    strength: number; // 0-1
    latency: number;
    bandwidth: number;
    status: 'active' | 'inactive' | 'congested';
    packets: number;
    errors: number;
    quality: {
        signal_strength: number;
        bandwidth_mbps: number;
        latency_ms: number;
        packet_loss: number;
    };
    traffic_flow: number;
    is_active: boolean;
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

export interface NetworkAlert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    node_id?: string;
    link_id?: string;
    timestamp: number;
}

export interface MeshTopologyStats {
    total_nodes: number;
    active_links: number;
    network_throughput: number;
    coverage_area: number;
    fault_tolerance: number;
    avg_latency: number;
}

interface NetworkLink {
    id: string
    source: string
    target: string
    type: 'wifi_direct' | 'bluetooth' | 'lora' | 'cellular'
    quality: {
        signal_strength: number
        bandwidth_mbps: number
        latency_ms: number
        packet_loss: number
    }
    traffic_flow: number // 0-1 indicating current usage
    is_active: boolean
}

interface NetworkAlert {
    id: string
    type: 'warning' | 'error' | 'info'
    message: string
    node_id?: string
    link_id?: string
    timestamp: number
}

interface MeshTopologyStats {
    total_nodes: number
    active_links: number
    network_throughput: number
    coverage_area: number
    fault_tolerance: number
    avg_latency: number
}

const MeshTopology3D: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<MapInstance | null>(null)

    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d')
    const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
    const [selectedLink, setSelectedLink] = useState<NetworkLink | null>(null)
    const [showTrafficFlow, setShowTrafficFlow] = useState(true)
    const [showCoverage, setShowCoverage] = useState(true)
    const [autoRefresh, setAutoRefresh] = useState(true)

    // Mock network data
    const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([
        {
            id: 'gateway-001',
            type: 'gateway',
            position: { lat: 41.3275, lon: 19.8187 }, // Tirana
            capabilities: {
                wifi_direct: true,
                bluetooth: true,
                lora: true,
                cellular: true,
                storage_mb: 1000,
                battery_level: 95
            },
            status: 'online',
            connections: ['relay-001', 'relay-002', 'edge-001'],
            traffic: { tx_mbps: 12.5, rx_mbps: 8.3, packets_sent: 15420, packets_received: 12890 },
            last_seen: Date.now()
        },
        {
            id: 'relay-001',
            type: 'relay',
            position: { lat: 41.3350, lon: 19.8300 },
            capabilities: {
                wifi_direct: true,
                bluetooth: true,
                lora: true,
                cellular: false,
                storage_mb: 500,
                battery_level: 78
            },
            status: 'online',
            connections: ['gateway-001', 'edge-002', 'edge-003'],
            traffic: { tx_mbps: 5.2, rx_mbps: 7.1, packets_sent: 8920, packets_received: 11200 },
            last_seen: Date.now() - 2000
        },
        {
            id: 'relay-002',
            type: 'relay',
            position: { lat: 41.3200, lon: 19.8100 },
            capabilities: {
                wifi_direct: true,
                bluetooth: true,
                lora: true,
                cellular: true,
                storage_mb: 500,
                battery_level: 85
            },
            status: 'degraded',
            connections: ['gateway-001', 'edge-004'],
            traffic: { tx_mbps: 1.8, rx_mbps: 2.3, packets_sent: 3450, packets_received: 4120 },
            last_seen: Date.now() - 5000
        },
        {
            id: 'edge-001',
            type: 'edge',
            position: { lat: 41.3400, lon: 19.8250 },
            capabilities: {
                wifi_direct: true,
                bluetooth: true,
                lora: false,
                cellular: false,
                storage_mb: 100,
                battery_level: 45
            },
            status: 'online',
            connections: ['gateway-001'],
            traffic: { tx_mbps: 0.8, rx_mbps: 1.2, packets_sent: 1200, packets_received: 1890 },
            last_seen: Date.now() - 1000
        },
        {
            id: 'edge-002',
            type: 'edge',
            position: { lat: 41.3380, lon: 19.8320 },
            capabilities: {
                wifi_direct: false,
                bluetooth: true,
                lora: true,
                cellular: false,
                storage_mb: 50,
                battery_level: 23
            },
            status: 'degraded',
            connections: ['relay-001'],
            traffic: { tx_mbps: 0.3, rx_mbps: 0.5, packets_sent: 890, packets_received: 1230 },
            last_seen: Date.now() - 8000
        }
    ])

    const [networkLinks, setNetworkLinks] = useState<NetworkLink[]>([
        {
            id: 'link-001',
            source: 'gateway-001',
            target: 'relay-001',
            type: 'wifi_direct',
            quality: { signal_strength: -45, bandwidth_mbps: 25.0, latency_ms: 8, packet_loss: 0.01 },
            traffic_flow: 0.4,
            is_active: true
        },
        {
            id: 'link-002',
            source: 'gateway-001',
            target: 'relay-002',
            type: 'wifi_direct',
            quality: { signal_strength: -65, bandwidth_mbps: 15.0, latency_ms: 12, packet_loss: 0.03 },
            traffic_flow: 0.2,
            is_active: true
        },
        {
            id: 'link-003',
            source: 'relay-001',
            target: 'edge-002',
            type: 'bluetooth',
            quality: { signal_strength: -70, bandwidth_mbps: 1.5, latency_ms: 25, packet_loss: 0.05 },
            traffic_flow: 0.6,
            is_active: true
        },
        {
            id: 'link-004',
            source: 'gateway-001',
            target: 'edge-001',
            type: 'wifi_direct',
            quality: { signal_strength: -50, bandwidth_mbps: 20.0, latency_ms: 6, packet_loss: 0.008 },
            traffic_flow: 0.3,
            is_active: true
        }
    ])

    const [networkAlerts, setNetworkAlerts] = useState<NetworkAlert[]>([
        {
            id: 'alert-001',
            type: 'warning',
            message: 'Low battery level on edge-002',
            node_id: 'edge-002',
            timestamp: Date.now() - 30000
        },
        {
            id: 'alert-002',
            type: 'error',
            message: 'High packet loss on link-003',
            link_id: 'link-003',
            timestamp: Date.now() - 60000
        }
    ])

    const [meshStats, setMeshStats] = useState<MeshTopologyStats>({
        total_nodes: 5,
        active_links: 4,
        network_throughput: 18.7,
        coverage_area: 2.3,
        fault_tolerance: 0.85,
        avg_latency: 12.8
    })

    // Initialize 3D map
    useEffect(() => {
        if (!mapContainer.current || map.current) return

        // Mock MapLibre initialization
        map.current = {
            getCenter: () => ({ lng: 19.8187, lat: 41.3275 }),
            setCenter: (coords) => console.log('Set center:', coords),
            getZoom: () => 12,
            setZoom: (zoom) => console.log('Set zoom:', zoom),
            addSource: (id, source) => console.log('Add source:', id),
            addLayer: (layer) => console.log('Add layer:', layer),
            removeLayer: (id) => console.log('Remove layer:', id),
            removeSource: (id) => console.log('Remove source:', id),
            on: (event, callback) => console.log('Add event listener:', event)
        }

        setIsMapLoaded(true)
        initializeMapLayers()
    }, [])

    // Auto-refresh network data
    useEffect(() => {
        if (!autoRefresh) return

        const interval = setInterval(() => {
            updateNetworkData()
        }, 5000)

        return () => clearInterval(interval)
    }, [autoRefresh])

    const initializeMapLayers = () => {
        if (!map.current) return

        // Add node layer
        map.current.addSource('mesh-nodes', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: networkNodes.map(node => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [node.position.lon, node.position.lat]
                    },
                    properties: {
                        id: node.id,
                        type: node.type,
                        status: node.status,
                        battery: node.capabilities.battery_level || 100
                    }
                }))
            }
        })

        // Add links layer
        map.current.addSource('mesh-links', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: networkLinks.map(link => {
                    const sourceNode = networkNodes.find(n => n.id === link.source)
                    const targetNode = networkNodes.find(n => n.id === link.target)

                    if (!sourceNode || !targetNode) return null

                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [sourceNode.position.lon, sourceNode.position.lat],
                                [targetNode.position.lon, targetNode.position.lat]
                            ]
                        },
                        properties: {
                            id: link.id,
                            type: link.type,
                            quality: link.quality.signal_strength,
                            traffic: link.traffic_flow,
                            active: link.is_active
                        }
                    }
                }).filter(Boolean)
            }
        })

        // Add coverage areas
        if (showCoverage) {
            map.current.addSource('coverage-areas', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: networkNodes.map(node => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [node.position.lon, node.position.lat]
                        },
                        properties: {
                            radius: getCoverageRadius(node)
                        }
                    }))
                }
            })
        }
    }

    const updateNetworkData = () => {
        // Simulate real-time updates
        setNetworkNodes(prev => prev.map(node => ({
            ...node,
            traffic: {
                ...node.traffic,
                tx_mbps: Math.max(0, node.traffic.tx_mbps + (Math.random() - 0.5) * 2),
                rx_mbps: Math.max(0, node.traffic.rx_mbps + (Math.random() - 0.5) * 2),
                packets_sent: node.traffic.packets_sent + Math.floor(Math.random() * 100),
                packets_received: node.traffic.packets_received + Math.floor(Math.random() * 100)
            },
            capabilities: {
                ...node.capabilities,
                battery_level: node.capabilities.battery_level ?
                    Math.max(10, node.capabilities.battery_level - Math.random() * 0.5) : undefined
            }
        })))

        setNetworkLinks(prev => prev.map(link => ({
            ...link,
            traffic_flow: Math.max(0, Math.min(1, link.traffic_flow + (Math.random() - 0.5) * 0.2)),
            quality: {
                ...link.quality,
                latency_ms: Math.max(1, link.quality.latency_ms + (Math.random() - 0.5) * 5),
                packet_loss: Math.max(0, Math.min(0.1, link.quality.packet_loss + (Math.random() - 0.5) * 0.01))
            }
        })))

        // Update stats
        const totalThroughput = networkNodes.reduce((sum, node) => sum + node.traffic.tx_mbps, 0)
        const avgLatency = networkLinks.reduce((sum, link) => sum + link.quality.latency_ms, 0) / networkLinks.length

        setMeshStats(prev => ({
            ...prev,
            network_throughput: totalThroughput,
            avg_latency: avgLatency
        }))
    }

    const getCoverageRadius = (node: NetworkNode): number => {
        let radius = 100 // Base 100m

        if (node.capabilities.wifi_direct) radius = Math.max(radius, 200)
        if (node.capabilities.lora) radius = Math.max(radius, 5000)
        if (node.capabilities.cellular) radius = Math.max(radius, 10000)

        return radius
    }

    const getNodeIcon = (node: NetworkNode) => {
        switch (node.type) {
            case 'gateway': return <Globe className="h-4 w-4" />
            case 'relay': return <Radio className="h-4 w-4" />
            case 'edge': return <Smartphone className="h-4 w-4" />
            default: return <MapPin className="h-4 w-4" />
        }
    }

    const getConnectionIcon = (type: string) => {
        switch (type) {
            case 'wifi_direct': return <Wifi className="h-3 w-3" />
            case 'bluetooth': return <Bluetooth className="h-3 w-3" />
            case 'lora': return <Radio className="h-3 w-3" />
            case 'cellular': return <Smartphone className="h-3 w-3" />
            default: return <Activity className="h-3 w-3" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'text-green-500'
            case 'degraded': return 'text-yellow-500'
            case 'offline': return 'text-red-500'
            default: return 'text-gray-500'
        }
    }

    const getQualityColor = (quality: number) => {
        if (quality > -50) return 'text-green-500'
        if (quality > -70) return 'text-yellow-500'
        return 'text-red-500'
    }

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold">Mesh Network Topology</h2>
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Live
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === '2d' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('2d')}
                    >
                        2D
                    </Button>
                    <Button
                        variant={viewMode === '3d' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('3d')}
                    >
                        3D
                    </Button>

                    <Button
                        variant={showTrafficFlow ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowTrafficFlow(!showTrafficFlow)}
                    >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Traffic
                    </Button>

                    <Button
                        variant={showCoverage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowCoverage(!showCoverage)}
                    >
                        <Navigation className="h-4 w-4 mr-1" />
                        Coverage
                    </Button>

                    <Button
                        variant={autoRefresh ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Auto Refresh
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Map View */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent className="p-0">
                            <div className="relative">
                                {/* Mock 3D Map Container */}
                                <div
                                    ref={mapContainer}
                                    className="w-full h-[600px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-lg overflow-hidden"
                                >
                                    {/* Mock 3D visualization */}
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="rgba(255,255,255,0.1)" fill-rule="evenodd"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v20h20z"/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

                                    {/* Network Nodes */}
                                    <div className="absolute inset-0 p-8">
                                        {networkNodes.map((node, index) => (
                                            <div
                                                key={node.id}
                                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${selectedNode?.id === node.id ? 'z-20 scale-125' : 'z-10'
                                                    }`}
                                                style={{
                                                    left: `${20 + index * 15 + Math.cos(index) * 30}%`,
                                                    top: `${30 + index * 12 + Math.sin(index) * 25}%`
                                                }}
                                                onClick={() => setSelectedNode(node)}
                                            >
                                                <div className={`
                                                        relative p-3 rounded-full border-2 backdrop-blur-sm transition-all duration-300
                                                        ${node.status === 'online' ? 'bg-green-500/20 border-green-400' :
                                                        node.status === 'degraded' ? 'bg-yellow-500/20 border-yellow-400' :
                                                            'bg-red-500/20 border-red-400'}
                                                        ${selectedNode?.id === node.id ? 'shadow-lg shadow-blue-500/50' : ''}
                                                    `}>
                                                    <div className="text-white">
                                                        {getNodeIcon(node)}
                                                    </div>

                                                    {/* Node pulse animation */}
                                                    <div className={`
                                                            absolute inset-0 rounded-full animate-ping
                                                            ${node.status === 'online' ? 'bg-green-400' :
                                                            node.status === 'degraded' ? 'bg-yellow-400' :
                                                                'bg-red-400'}
                                                        `} style={{ animationDuration: '2s' }}></div>

                                                    {/* Coverage area */}
                                                    {showCoverage && (
                                                        <div className={`
                                                                absolute inset-0 rounded-full border opacity-30
                                                                ${node.type === 'gateway' ? 'scale-[4] border-blue-400' :
                                                                node.type === 'relay' ? 'scale-[3] border-purple-400' :
                                                                    'scale-[2] border-green-400'}
                                                            `}></div>
                                                    )}
                                                </div>

                                                {/* Node label */}
                                                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white text-xs text-center whitespace-nowrap">
                                                    <div className="bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                                                        {node.id}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Network Links */}
                                        {showTrafficFlow && networkLinks.map((link, index) => {
                                            const sourceIndex = networkNodes.findIndex(n => n.id === link.source)
                                            const targetIndex = networkNodes.findIndex(n => n.id === link.target)

                                            if (sourceIndex === -1 || targetIndex === -1) return null

                                            const sourcePos = {
                                                x: 20 + sourceIndex * 15 + Math.cos(sourceIndex) * 30,
                                                y: 30 + sourceIndex * 12 + Math.sin(sourceIndex) * 25
                                            }
                                            const targetPos = {
                                                x: 20 + targetIndex * 15 + Math.cos(targetIndex) * 30,
                                                y: 30 + targetIndex * 12 + Math.sin(targetIndex) * 25
                                            }

                                            const length = Math.sqrt(
                                                Math.pow(targetPos.x - sourcePos.x, 2) +
                                                Math.pow(targetPos.y - sourcePos.y, 2)
                                            )
                                            const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x) * 180 / Math.PI

                                            return (
                                                <div
                                                    key={link.id}
                                                    className="absolute cursor-pointer"
                                                    style={{
                                                        left: `${sourcePos.x}%`,
                                                        top: `${sourcePos.y}%`,
                                                        width: `${length}%`,
                                                        transform: `rotate(${angle}deg)`,
                                                        transformOrigin: '0 50%'
                                                    }}
                                                    onClick={() => setSelectedLink(link)}
                                                >
                                                    <div className={`
                                                            h-1 rounded-full transition-all duration-300
                                                            ${link.quality.signal_strength > -50 ? 'bg-green-400' :
                                                            link.quality.signal_strength > -70 ? 'bg-yellow-400' :
                                                                'bg-red-400'}
                                                            ${selectedLink?.id === link.id ? 'h-2 shadow-lg' : ''}
                                                        `} style={{
                                                            opacity: 0.3 + link.traffic_flow * 0.7
                                                        }}>
                                                        {/* Traffic flow animation */}
                                                        <div className="h-full bg-white/50 rounded-full animate-pulse"
                                                            style={{
                                                                width: `${link.traffic_flow * 100}%`,
                                                                animationDuration: `${2 - link.traffic_flow}s`
                                                            }}>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Map overlay info */}
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                                <div className="text-sm font-medium mb-2">Network Overview</div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span>{networkNodes.filter(n => n.status === 'online').length} Online</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        <span>{networkNodes.filter(n => n.status === 'degraded').length} Degraded</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                        <span>{networkNodes.filter(n => n.status === 'offline').length} Offline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
                {/* Network Statistics */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Network Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Nodes</span>
                            <span className="font-medium">{meshStats.total_nodes}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Active Links</span>
                            <span className="font-medium">{meshStats.active_links}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Throughput</span>
                            <span className="font-medium">{meshStats.network_throughput.toFixed(1)} Mbps</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg Latency</span>
                            <span className="font-medium">{meshStats.avg_latency.toFixed(1)} ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Coverage</span>
                            <span className="font-medium">{meshStats.coverage_area.toFixed(1)} km²</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Fault Tolerance</span>
                            <span className="font-medium">{(meshStats.fault_tolerance * 100).toFixed(0)}%</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Alerts */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            Active Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {networkAlerts.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
                                No active alerts
                            </div>
                        ) : (
                            networkAlerts.map(alert => (
                                <div key={alert.id} className={`
                                        p-2 rounded border-l-2 text-xs
                                        ${alert.type === 'error' ? 'bg-red-50 border-red-400' :
                                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                                            'bg-blue-50 border-blue-400'}
                                    `}>
                                    <div className="font-medium">{alert.message}</div>
                                    <div className="text-muted-foreground mt-1">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Selected Node Details */}
                {selectedNode && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                {getNodeIcon(selectedNode)}
                                {selectedNode.id}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <Badge variant={selectedNode.status === 'online' ? 'default' : 'destructive'}>
                                    {selectedNode.status}
                                </Badge>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="ml-2 capitalize">{selectedNode.type}</span>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Position:</span>
                                <div className="ml-2 text-xs font-mono">
                                    {selectedNode.position.lat.toFixed(4)}, {selectedNode.position.lon.toFixed(4)}
                                </div>
                            </div>

                            {selectedNode.capabilities.battery_level && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Battery:</span>
                                    <span className="ml-2">{selectedNode.capabilities.battery_level.toFixed(0)}%</span>
                                </div>
                            )}

                            <div className="text-sm">
                                <span className="text-muted-foreground">Traffic:</span>
                                <div className="ml-2 text-xs">
                                    TX: {selectedNode.traffic.tx_mbps.toFixed(1)} Mbps<br />
                                    RX: {selectedNode.traffic.rx_mbps.toFixed(1)} Mbps
                                </div>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Capabilities:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedNode.capabilities.wifi_direct && (
                                        <Badge variant="outline" className="text-xs">
                                            <Wifi className="h-3 w-3 mr-1" />
                                            Wi-Fi Direct
                                        </Badge>
                                    )}
                                    {selectedNode.capabilities.bluetooth && (
                                        <Badge variant="outline" className="text-xs">
                                            <Bluetooth className="h-3 w-3 mr-1" />
                                            Bluetooth
                                        </Badge>
                                    )}
                                    {selectedNode.capabilities.lora && (
                                        <Badge variant="outline" className="text-xs">
                                            <Radio className="h-3 w-3 mr-1" />
                                            LoRa
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => setSelectedNode(null)}
                            >
                                Close Details
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Selected Link Details */}
                {selectedLink && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                {getConnectionIcon(selectedLink.type)}
                                Link Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm">
                                <span className="text-muted-foreground">Connection:</span>
                                <div className="ml-2 text-xs">
                                    {selectedLink.source} ⟷ {selectedLink.target}
                                </div>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="ml-2 capitalize">{selectedLink.type.replace('_', ' ')}</span>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Signal:</span>
                                <span className={`ml-2 ${getQualityColor(selectedLink.quality.signal_strength)}`}>
                                    {selectedLink.quality.signal_strength} dBm
                                </span>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Bandwidth:</span>
                                <span className="ml-2">{selectedLink.quality.bandwidth_mbps.toFixed(1)} Mbps</span>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Latency:</span>
                                <span className="ml-2">{selectedLink.quality.latency_ms.toFixed(1)} ms</span>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Packet Loss:</span>
                                <span className="ml-2">{(selectedLink.quality.packet_loss * 100).toFixed(2)}%</span>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Traffic Flow:</span>
                                <div className="ml-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${selectedLink.traffic_flow * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {(selectedLink.traffic_flow * 100).toFixed(0)}% utilization
                                    </span>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => setSelectedLink(null)}
                            >
                                Close Details
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
        </div >
    )
}

export default MeshTopology3D
