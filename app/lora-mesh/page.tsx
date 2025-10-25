'use client';

import { useState, useEffect } from 'react';
import styles from './mesh.module.css';

interface MeshNode {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'transmitting' | 'error';
  signalStrength: number;
  batteryLevel: number;
  lastSeen: string;
  coordinates: { x: number; y: number };
  parentId: string | null;
  children: string[];
  dataRate: number;
  frequency: number;
  spreadingFactor: number;
  continent?: string;
  threatLevel?: number;
}

interface NetworkTopology {
  nodes: Array<{ id: string; x: number; y: number; status: string }>;
  connections: Array<{ from: string; to: string; strength: number }>;
}

interface MeshMetrics {
  totalNodes: number;
  onlineNodes: number;
  packetsTransmitted: number;
  averageSignalStrength: number;
  networkUptime: number;
  dataThroughput: number;
}

export default function LoRaMeshDashboard() {
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(null);
  const [topology, setTopology] = useState<NetworkTopology>({ nodes: [], connections: [] });
  const [metrics, setMetrics] = useState<MeshMetrics>({
    totalNodes: 0,
    onlineNodes: 0,
    packetsTransmitted: 0,
    averageSignalStrength: 0,
    networkUptime: 0,
    dataThroughput: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [continentalMeshConnected, setContinentalMeshConnected] = useState(false);

  useEffect(() => {
    fetchMeshData();
    const interval = setInterval(fetchMeshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMeshData = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from Continental Mesh API first, fallback to mock data
      let continentalData = null;
      try {
        const response = await fetch('/api/continental-mesh?action=status');
        if (response.ok) {
          const result = await response.json();
          continentalData = result.data;
          setContinentalMeshConnected(true);
        }
      } catch (error) {
        console.log('Continental Mesh API not available, using mock data');
        setContinentalMeshConnected(false);
      }

      // Convert Continental Mesh data to LoRa format or use mock data
      const mockNodes: MeshNode[] = continentalData ? 
        continentalData.nodes.map((node: any) => ({
          id: node.id,
          name: `${node.role} ${node.id}`,
          status: node.status === 'active' ? 'online' : node.status === 'processing' ? 'transmitting' : 'offline',
          signalStrength: Math.floor(Math.random() * 30) + 70,
          batteryLevel: Math.floor(Math.random() * 40) + 60,
          lastSeen: node.lastActivity,
          coordinates: { 
            x: Math.max(50, Math.min(850, (node.coordinates?.lng || 0) * 5 + 400)), 
            y: Math.max(50, Math.min(650, (90 - (node.coordinates?.lat || 0)) * 5 + 100))
          },
          parentId: node.parent || null,
          children: node.children || [],
          dataRate: Math.floor(Math.random() * 50) + 10,
          frequency: 868.1 + Math.random() * 0.8,
          spreadingFactor: Math.floor(Math.random() * 6) + 7,
          continent: node.continent,
          threatLevel: node.threatLevel
        })) : [
        {
          id: 'gateway-001',
          name: 'Main Gateway',
          status: 'online',
          signalStrength: 95,
          batteryLevel: 100,
          lastSeen: new Date().toISOString(),
          coordinates: { x: 400, y: 300 },
          parentId: null,
          children: ['node-002', 'node-003', 'node-004'],
          dataRate: 45,
          frequency: 868.1,
          spreadingFactor: 7
        },
        {
          id: 'node-002',
          name: 'Sensor Node A',
          status: 'online',
          signalStrength: 87,
          batteryLevel: 78,
          lastSeen: new Date(Date.now() - 30000).toISOString(),
          coordinates: { x: 200, y: 150 },
          parentId: 'gateway-001',
          children: ['node-005', 'node-006'],
          dataRate: 32,
          frequency: 868.3,
          spreadingFactor: 8
        },
        {
          id: 'node-003',
          name: 'Sensor Node B',
          status: 'transmitting',
          signalStrength: 92,
          batteryLevel: 65,
          lastSeen: new Date(Date.now() - 15000).toISOString(),
          coordinates: { x: 600, y: 200 },
          parentId: 'gateway-001',
          children: ['node-007'],
          dataRate: 28,
          frequency: 868.5,
          spreadingFactor: 9
        },
        {
          id: 'node-004',
          name: 'Relay Node C',
          status: 'online',
          signalStrength: 79,
          batteryLevel: 88,
          lastSeen: new Date(Date.now() - 45000).toISOString(),
          coordinates: { x: 350, y: 500 },
          parentId: 'gateway-001',
          children: ['node-008', 'node-009'],
          dataRate: 38,
          frequency: 868.7,
          spreadingFactor: 7
        },
        {
          id: 'node-005',
          name: 'End Node D',
          status: 'online',
          signalStrength: 68,
          batteryLevel: 45,
          lastSeen: new Date(Date.now() - 120000).toISOString(),
          coordinates: { x: 100, y: 100 },
          parentId: 'node-002',
          children: [],
          dataRate: 15,
          frequency: 868.2,
          spreadingFactor: 10
        },
        {
          id: 'node-006',
          name: 'End Node E',
          status: 'offline',
          signalStrength: 0,
          batteryLevel: 12,
          lastSeen: new Date(Date.now() - 300000).toISOString(),
          coordinates: { x: 150, y: 50 },
          parentId: 'node-002',
          children: [],
          dataRate: 0,
          frequency: 868.4,
          spreadingFactor: 12
        },
        {
          id: 'node-007',
          name: 'Repeater F',
          status: 'online',
          signalStrength: 85,
          batteryLevel: 72,
          lastSeen: new Date(Date.now() - 60000).toISOString(),
          coordinates: { x: 700, y: 120 },
          parentId: 'node-003',
          children: ['node-010'],
          dataRate: 41,
          frequency: 868.6,
          spreadingFactor: 8
        },
        {
          id: 'node-008',
          name: 'Sensor Node G',
          status: 'error',
          signalStrength: 23,
          batteryLevel: 35,
          lastSeen: new Date(Date.now() - 180000).toISOString(),
          coordinates: { x: 250, y: 550 },
          parentId: 'node-004',
          children: [],
          dataRate: 8,
          frequency: 868.8,
          spreadingFactor: 11
        },
        {
          id: 'node-009',
          name: 'Mobile Node H',
          status: 'transmitting',
          signalStrength: 76,
          batteryLevel: 58,
          lastSeen: new Date().toISOString(),
          coordinates: { x: 450, y: 600 },
          parentId: 'node-004',
          children: [],
          dataRate: 33,
          frequency: 869.0,
          spreadingFactor: 9
        },
        {
          id: 'node-010',
          name: 'End Node I',
          status: 'online',
          signalStrength: 71,
          batteryLevel: 81,
          lastSeen: new Date(Date.now() - 90000).toISOString(),
          coordinates: { x: 800, y: 80 },
          parentId: 'node-007',
          children: [],
          dataRate: 22,
          frequency: 868.9,
          spreadingFactor: 10
        }
      ];

      // Generate network topology
      const topologyNodes = mockNodes.map(node => ({
        id: node.id,
        x: node.coordinates.x,
        y: node.coordinates.y,
        status: node.status
      }));

      const connections = mockNodes
        .filter(node => node.parentId)
        .map(node => ({
          from: node.parentId!,
          to: node.id,
          strength: node.signalStrength
        }));

      // Calculate metrics
      const onlineNodes = mockNodes.filter(n => n.status === 'online' || n.status === 'transmitting').length;
      const avgSignal = mockNodes.reduce((sum, n) => sum + n.signalStrength, 0) / mockNodes.length;
      const totalThroughput = mockNodes.reduce((sum, n) => sum + n.dataRate, 0);

      setNodes(mockNodes);
      setTopology({ nodes: topologyNodes, connections });
      setMetrics({
        totalNodes: mockNodes.length,
        onlineNodes,
        packetsTransmitted: Math.floor(Math.random() * 10000) + 50000,
        averageSignalStrength: Math.round(avgSignal),
        networkUptime: 99.7,
        dataThroughput: totalThroughput
      });
    } catch (error) {
      console.error('Error fetching mesh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#00ff88';
      case 'transmitting': return '#00d4ff';
      case 'offline': return '#6c757d';
      case 'error': return '#ff6b6b';
      default: return '#ffa502';
    }
  };

  const getSignalStrengthClass = (strength: number) => {
    if (strength >= 80) return 'excellent';
    if (strength >= 60) return 'good';
    if (strength >= 40) return 'fair';
    return 'poor';
  };

  const getBatteryClass = (level: number) => {
    if (level >= 70) return 'high';
    if (level >= 30) return 'medium';
    return 'low';
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNodes = statusFilter === 'all' 
    ? nodes 
    : nodes.filter(node => node.status === statusFilter);

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h1 className={styles['title']}>📡 LoRa Mesh Network</h1>
        <p className={styles['subtitle']}>
          Long Range Mesh Network Topology & Management
          {continentalMeshConnected && (
            <span className={styles['continental-badge']}>🌍 Continental Mesh Connected</span>
          )}
        </p>
        <div className={styles['last-updated']}>
          Last updated: {new Date().toLocaleTimeString()}
          {isLoading && <span className={styles['loading']}>⟳</span>}
        </div>
      </div>

      {/* Metrics Overview */}
      <div className={styles['metrics-grid']}>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>📡</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.totalNodes}</div>
            <div className={styles['metric-label']}>Total Nodes</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>🟢</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.onlineNodes}</div>
            <div className={styles['metric-label']}>Online Nodes</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>📊</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.averageSignalStrength}%</div>
            <div className={styles['metric-label']}>Avg Signal</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>📈</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.dataThroughput}</div>
            <div className={styles['metric-label']}>Total Throughput</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>⏱️</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.networkUptime}%</div>
            <div className={styles['metric-label']}>Network Uptime</div>
          </div>
        </div>
        <div className={styles['metric-card']}>
          <div className={styles['metric-icon']}>📦</div>
          <div className={styles['metric-data']}>
            <div className={styles['metric-value']}>{metrics.packetsTransmitted.toLocaleString()}</div>
            <div className={styles['metric-label']}>Packets Sent</div>
          </div>
        </div>
      </div>

      {/* Network Topology Visualization */}
      <div className={styles['topology-section']}>
        <h2 className={styles['section-title']}>🗺️ Network Topology</h2>
        <div className={styles['topology-container']}>
          <svg className={styles['topology-svg']} viewBox="0 0 900 700">
            {/* Connection lines */}
            <g className={styles['connections']}>
              {topology.connections.map((conn, index) => {
                const fromNode = topology.nodes.find((n: any) => n.id === conn.from);
                const toNode = topology.nodes.find((n: any) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                return (
                  <line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    className={styles['connection-line']}
                    strokeWidth={Math.max(1, conn.strength / 30)}
                    opacity={conn.strength / 100}
                  />
                );
              })}
            </g>
            
            {/* Nodes */}
            <g className={styles['nodes']}>
              {topology.nodes.map((node: any) => (
                <g key={node.id} className={styles['node-group']}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="15"
                    className={`${styles['node-circle']} ${styles[node.status]}`}
                    onClick={() => {
                      const fullNode = nodes.find(n => n.id === node.id);
                      if (fullNode) setSelectedNode(fullNode);
                    }}
                  />
                  <text
                    x={node.x}
                    y={node.y - 25}
                    className={styles['node-label']}
                    textAnchor="middle"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Node Status Filter */}
      <div className={styles['filter-section']}>
        <h2 className={styles['section-title']}>🔍 Node Status Filter</h2>
        <div className={styles['status-filters']}>
          <button 
            className={`${styles['filter-button']} ${statusFilter === 'all' ? styles['active'] : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            🌐 All Nodes ({nodes.length})
          </button>
          <button 
            className={`${styles['filter-button']} ${statusFilter === 'online' ? styles['active'] : ''}`}
            onClick={() => setStatusFilter('online')}
          >
            🟢 Online ({nodes.filter(n => n.status === 'online').length})
          </button>
          <button 
            className={`${styles['filter-button']} ${statusFilter === 'transmitting' ? styles['active'] : ''}`}
            onClick={() => setStatusFilter('transmitting')}
          >
            📡 Transmitting ({nodes.filter(n => n.status === 'transmitting').length})
          </button>
          <button 
            className={`${styles['filter-button']} ${statusFilter === 'offline' ? styles['active'] : ''}`}
            onClick={() => setStatusFilter('offline')}
          >
            🔴 Offline ({nodes.filter(n => n.status === 'offline').length})
          </button>
          <button 
            className={`${styles['filter-button']} ${statusFilter === 'error' ? styles['active'] : ''}`}
            onClick={() => setStatusFilter('error')}
          >
            ⚠️ Error ({nodes.filter(n => n.status === 'error').length})
          </button>
        </div>
      </div>

      {/* Nodes List */}
      <div className={styles['nodes-section']}>
        <h2 className={styles['section-title']}>
          📋 Network Nodes ({filteredNodes.length})
        </h2>
        <div className={styles['nodes-grid']}>
          {filteredNodes.map((node) => (
            <div 
              key={node.id} 
              className={styles['node-card']}
              onClick={() => setSelectedNode(node)}
            >
              <div className={styles['node-header']}>
                <div className={styles['node-info']}>
                  <div className={styles['node-name']}>{node.name}</div>
                  <div className={styles['node-id']}>ID: {node.id}</div>
                </div>
                <div 
                  className={`${styles['node-status']} ${styles[node.status]}`}
                >
                  ● {node.status.toUpperCase()}
                </div>
              </div>
              
              <div className={styles['node-metrics']}>
                <div className={styles['node-metric']}>
                  <span>Signal:</span>
                  <div className={styles['signal-bar']}>
                    <div 
                      className={`${styles['signal-fill']} ${styles[getSignalStrengthClass(node.signalStrength)]}`}
                      style={{ width: `${node.signalStrength}%` }}
                    />
                    <span className={styles['signal-text']}>{node.signalStrength}%</span>
                  </div>
                </div>
                <div className={styles['node-metric']}>
                  <span>Battery:</span>
                  <span className={`${styles['battery-level']} ${styles[getBatteryClass(node.batteryLevel)]}`}>
                    {node.batteryLevel}%
                  </span>
                </div>
                <div className={styles['node-metric']}>
                  <span>Data Rate:</span>
                  <span>{node.dataRate} kbps</span>
                </div>
                <div className={styles['node-metric']}>
                  <span>Last Seen:</span>
                  <span>{formatLastSeen(node.lastSeen)}</span>
                </div>
              </div>

              {node.continent && (
                <div className={styles['node-continent']}>
                  🌍 {node.continent}
                  {node.threatLevel && (
                    <span className={styles['threat-level']}>
                      ⚠️ Threat: {node.threatLevel}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Node Details Modal */}
      {selectedNode && (
        <div className={styles['modal-overlay']} onClick={() => setSelectedNode(null)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3 className={styles['modal-title']}>
                📡 {selectedNode.name}
              </h3>
              <button 
                className={styles['modal-close']}
                onClick={() => setSelectedNode(null)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles['modal-body']}>
              <div className={styles['node-details']}>
                <div className={styles['detail-section']}>
                  <h4>Node Information</h4>
                  <div className={styles['detail-item']}>
                    <span>Node ID:</span>
                    <span>{selectedNode.id}</span>
                  </div>
                  <div className={styles['detail-item']}>
                  <div className={styles['detail-item']}>
                    <span>Status:</span>
                    <span className={styles[selectedNode.status]}>
                      {selectedNode.status.toUpperCase()}
                    </span>
                  </div>
                    <span>Last Seen:</span>
                    <span>{new Date(selectedNode.lastSeen).toLocaleString()}</span>
                  </div>
                  {selectedNode.continent && (
                    <div className={styles['detail-item']}>
                      <span>Continent:</span>
                      <span>{selectedNode.continent}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles['detail-section']}>
                  <h4>Network Metrics</h4>
                  <div className={styles['detail-item']}>
                    <span>Signal Strength:</span>
                    <span className={styles[getSignalStrengthClass(selectedNode.signalStrength)]}>
                      {selectedNode.signalStrength}%
                    </span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>Battery Level:</span>
                    <span className={styles[getBatteryClass(selectedNode.batteryLevel)]}>
                      {selectedNode.batteryLevel}%
                    </span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>Data Rate:</span>
                    <span>{selectedNode.dataRate} kbps</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>Frequency:</span>
                    <span>{selectedNode.frequency.toFixed(1)} MHz</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>Spreading Factor:</span>
                    <span>SF{selectedNode.spreadingFactor}</span>
                  </div>
                </div>
                
                <div className={styles['detail-section']}>
                  <h4>Network Topology</h4>
                  <div className={styles['detail-item']}>
                    <span>Parent Node:</span>
                    <span>{selectedNode.parentId || 'None (Root)'}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <span>Children Nodes:</span>
                    <span>{selectedNode.children.length} nodes</span>
                  </div>
                  {selectedNode.children.length > 0 && (
                    <div className={styles['children-list']}>
                      <strong>Child Nodes:</strong>
                      <ul>
                        {selectedNode.children.map(childId => (
                          <li key={childId}>{childId}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {selectedNode.threatLevel && (
                  <div className={styles['detail-section']}>
                    <h4>Security Status</h4>
                    <div className={styles['detail-item']}>
                      <span>Threat Level:</span>
                      <span className={selectedNode.threatLevel > 3 ? styles['threat-high'] : styles['threat-low']}>
                        Level {selectedNode.threatLevel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles['controls']}>
        <button 
          className={styles['refresh-button']}
          onClick={fetchMeshData}
          disabled={isLoading}
        >
          {isLoading ? '⟳ Refreshing...' : '🔄 Refresh Network'}
        </button>
        {continentalMeshConnected && (
          <button 
            className={styles['continental-button']}
            onClick={() => window.open('/api/continental-mesh?action=status', '_blank')}
          >
            🌍 Continental Mesh Status
          </button>
        )}
      </div>
    </div>
  );
}
