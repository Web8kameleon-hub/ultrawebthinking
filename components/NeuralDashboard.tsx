/**
 * Neural Activity Dashboard Component
 * Real-time visualization of AGI neural network activity
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './NeuralDashboard.module.css';

interface NodeStatus {
  id: string;
  name: string;
  type: string;
  activity: number;
  pulseRate: number;
  flickering: number;
  status: string;
  connections: number;
  errorCount: number;
}

interface NetworkStatus {
  timestamp: number;
  isRunning: boolean;
  safeThinkActive: boolean;
  throttledNodes: string[];
  totalNodes: number;
  activeNodes: number;
  nodes: NodeStatus[];
  recentActivity: any[];
}

interface ActivityMapNode {
  name: string;
  activity: number;
  pulseRate: number;
  flickering: number;
  status: string;
  coordinates: { x: number; y: number };
  connections: string[];
}

interface ActivityMap {
  timestamp: number;
  map: Record<string, ActivityMapNode>;
  safeThinkActive: boolean;
  alerts: string[];
}

export default function NeuralDashboard() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [activityMap, setActivityMap] = useState<ActivityMap | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simulate neural planner connection
    setIsConnected(true);
    fetchNetworkStatus();
    
    const interval = setInterval(() => {
      fetchNetworkStatus();
      fetchActivityMap();
    }, 500); // Update every 500ms for real-time feel

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activityMap && canvasRef.current) {
      drawNeuralNetwork();
    }
  }, [activityMap]);

  const fetchNetworkStatus = async () => {
    try {
      // Simulate network status data
      const mockStatus: NetworkStatus = {
        timestamp: Date.now(),
        isRunning: true,
        safeThinkActive: Math.random() < 0.1, // 10% chance SafeThink is active
        throttledNodes: Math.random() < 0.2 ? ['n1'] : [], // 20% chance n1 is throttled
        totalNodes: 8,
        activeNodes: 8,
        nodes: [
          {
            id: 'n1',
            name: 'Primary Input Processor',
            type: 'input',
            activity: Math.random() * 40 + 60, // High activity for input
            pulseRate: Math.random() * 50 + 50,
            flickering: Math.random() * 2,
            status: Math.random() < 0.2 ? 'throttled' : 'active',
            connections: 3,
            errorCount: Math.floor(Math.random() * 5)
          },
          {
            id: 'n7',
            name: 'Ethical Oversight Controller',
            type: 'ethical',
            activity: Math.random() * 30 + 40,
            pulseRate: Math.random() * 40 + 30,
            flickering: Math.random() * 5, // Higher chance of flickering for ethical monitoring
            status: 'active',
            connections: 1,
            errorCount: 0
          },
          // Add other nodes...
          ...['n2', 'n3', 'n4', 'n5', 'n6', 'n8'].map(id => ({
            id,
            name: `Neural Node ${id.toUpperCase()}`,
            type: 'processing',
            activity: Math.random() * 60 + 20,
            pulseRate: Math.random() * 60 + 20,
            flickering: Math.random() * 3,
            status: 'active' as const,
            connections: Math.floor(Math.random() * 4) + 1,
            errorCount: Math.floor(Math.random() * 3)
          }))
        ],
        recentActivity: []
      };
      
      setNetworkStatus(mockStatus);
    } catch (error) {
      console.error('Failed to fetch network status:', error);
    }
  };

  const fetchActivityMap = async () => {
    try {
      // Simulate activity map data
      const mockMap: ActivityMap = {
        timestamp: Date.now(),
        map: {
          n1: {
            name: 'Primary Input Processor',
            activity: Math.random() * 40 + 60,
            pulseRate: Math.random() * 50 + 50,
            flickering: Math.random() * 2,
            status: Math.random() < 0.2 ? 'throttled' : 'active',
            coordinates: { x: 100, y: 200 },
            connections: ['n2', 'n3', 'n7']
          },
          n7: {
            name: 'Ethical Oversight Controller',
            activity: Math.random() * 30 + 40,
            pulseRate: Math.random() * 40 + 30,
            flickering: Math.random() * 5,
            status: 'active',
            coordinates: { x: 700, y: 350 },
            connections: ['n8']
          },
          // Add other nodes...
          ...Object.fromEntries(['n2', 'n3', 'n4', 'n5', 'n6', 'n8'].map(id => [
            id,
            {
              name: `Neural Node ${id.toUpperCase()}`,
              activity: Math.random() * 60 + 20,
              pulseRate: Math.random() * 60 + 20,
              flickering: Math.random() * 3,
              status: 'active',
              coordinates: { 
                x: Math.random() * 800 + 100, 
                y: Math.random() * 400 + 100 
              },
              connections: []
            }
          ]))
        },
        safeThinkActive: Math.random() < 0.1,
        alerts: []
      };

      // Generate alerts based on node conditions
      Object.entries(mockMap.map).forEach(([nodeId, node]) => {
        if (nodeId === 'n1' && node.pulseRate > 80) {
          mockMap.alerts.push(`${nodeId}: High pulse rate (${node.pulseRate.toFixed(1)}Hz)`);
        }
        if (nodeId === 'n7' && node.flickering > 3) {
          mockMap.alerts.push(`${nodeId}: Excessive flickering (${node.flickering.toFixed(1)})`);
        }
      });

      setActivityMap(mockMap);
    } catch (error) {
      console.error('Failed to fetch activity map:', error);
    }
  };

  const drawNeuralNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas || !activityMap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first
    Object.entries(activityMap.map).forEach(([nodeId, node]) => {
      node.connections.forEach(targetId => {
        const targetNode = activityMap.map[targetId];
        if (targetNode) {
          ctx.beginPath();
          ctx.moveTo(node.coordinates.x, node.coordinates.y);
          ctx.lineTo(targetNode.coordinates.x, targetNode.coordinates.y);
          ctx.strokeStyle = `rgba(0, 255, 100, ${node.activity / 200})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    Object.entries(activityMap.map).forEach(([nodeId, node]) => {
      const x = node.coordinates.x;
      const y = node.coordinates.y;
      const radius = 15 + (node.activity / 100) * 10; // Size based on activity

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      // Color based on status and activity
      let color = '#00ff64'; // Default green
      if (node.status === 'throttled') color = '#ff8800';
      if (node.status === 'safethink') color = '#0088ff';
      if (node.status === 'offline') color = '#ff4444';
      
      // Pulse effect based on pulse rate
      const pulseAlpha = 0.3 + (Math.sin(Date.now() * node.pulseRate / 1000) + 1) * 0.35;
      ctx.fillStyle = color.replace(')', `, ${pulseAlpha})`).replace('#', 'rgba(').replace(/(..)(..)(..)/, '$1, $2, $3');
      ctx.fill();

      // Border for special nodes
      if (nodeId === 'n1' || nodeId === 'n7') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Flickering effect for n7
      if (nodeId === 'n7' && node.flickering > 3) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(255, 68, 68, ${Math.random()})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(nodeId.toUpperCase(), x, y + 4);

      // Activity indicator
      ctx.font = '10px monospace';
      ctx.fillText(`${node.activity.toFixed(0)}%`, x, y + radius + 15);
    });

    // Draw SafeThink overlay if active
    if (activityMap.safeThinkActive) {
      ctx.fillStyle = 'rgba(0, 136, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0088ff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SAFETHINK MODE ACTIVE', canvas.width / 2, 30);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff64';
      case 'throttled': return '#ff8800';
      case 'safethink': return '#0088ff';
      case 'offline': return '#ff4444';
      default: return '#666666';
    }
  };

  const getActivityLevel = (activity: number) => {
    if (activity > 80) return 'Very High';
    if (activity > 60) return 'High';
    if (activity > 40) return 'Medium';
    if (activity > 20) return 'Low';
    return 'Very Low';
  };

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Connecting to Neural Planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🧠 Neural Activity Dashboard</h1>
        <div className={styles.statusIndicators}>
          <div className={`${styles.indicator} ${networkStatus?.isRunning ? styles.online : styles.offline}`}>
            <span className={styles.dot}></span>
            {networkStatus?.isRunning ? 'Neural Network Online' : 'Neural Network Offline'}
          </div>
          {networkStatus?.safeThinkActive && (
            <div className={`${styles.indicator} ${styles.safethink}`}>
              <span className={styles.dot}></span>
              SafeThink Mode Active
            </div>
          )}
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Neural Network Visualization */}
        <div className={styles.networkView}>
          <h3>Neural Network Map</h3>
          <canvas
            ref={canvasRef}
            width={1000}
            height={500}
            className={styles.canvas}
            onClick={(e) => {
              // Handle node selection based on click coordinates
              // Implementation would map coordinates to nodes
            }}
          />
        </div>

        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <h3>Network Control</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span>Total Nodes:</span>
              <span>{networkStatus?.totalNodes || 0}</span>
            </div>
            <div className={styles.stat}>
              <span>Active Nodes:</span>
              <span className={styles.active}>{networkStatus?.activeNodes || 0}</span>
            </div>
            <div className={styles.stat}>
              <span>Throttled:</span>
              <span className={styles.throttled}>{networkStatus?.throttledNodes.length || 0}</span>
            </div>
          </div>

          {/* Critical Node Monitoring */}
          <div className={styles.criticalNodes}>
            <h4>Critical Node Status</h4>
            {networkStatus?.nodes.filter(n => n.id === 'n1' || n.id === 'n7').map(node => (
              <div key={node.id} className={styles.criticalNode}>
                <div className={styles.nodeHeader}>
                  <span className={styles.nodeId}>{node.id.toUpperCase()}</span>
                  <span 
                    className={styles.nodeStatus}
                    style={{ color: getStatusColor(node.status) }}
                  >
                    {node.status.toUpperCase()}
                  </span>
                </div>
                <div className={styles.nodeMetrics}>
                  <div className={styles.metric}>
                    <span>Activity:</span>
                    <span>{node.activity.toFixed(1)}%</span>
                  </div>
                  <div className={styles.metric}>
                    <span>Pulse Rate:</span>
                    <span>{node.pulseRate.toFixed(1)}Hz</span>
                  </div>
                  <div className={styles.metric}>
                    <span>Flickering:</span>
                    <span className={node.flickering > 3 ? styles.warning : ''}>
                      {node.flickering.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* Special alerts for n1 and n7 */}
                {node.id === 'n1' && node.pulseRate > 80 && (
                  <div className={styles.alert}>
                    ⚠️ n1 overload detected — input throttled
                  </div>
                )}
                {node.id === 'n7' && node.flickering > 3 && (
                  <div className={styles.alert}>
                    🚨 n7 ethical pulse anomaly — fallback activated
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Details Grid */}
      <div className={styles.nodeGrid}>
        <h3>All Neural Nodes</h3>
        <div className={styles.grid}>
          {networkStatus?.nodes.map(node => (
            <div 
              key={node.id} 
              className={`${styles.nodeCard} ${selectedNode === node.id ? styles.selected : ''}`}
              onClick={() => setSelectedNode(node.id)}
            >
              <div className={styles.nodeCardHeader}>
                <span className={styles.nodeId}>{node.id.toUpperCase()}</span>
                <span 
                  className={styles.nodeType}
                  style={{ color: getStatusColor(node.status) }}
                >
                  {node.type}
                </span>
              </div>
              <div className={styles.nodeCardContent}>
                <p className={styles.nodeName}>{node.name}</p>
                <div className={styles.nodeMetrics}>
                  <div className={styles.metric}>
                    <span>Activity:</span>
                    <span className={styles.activityBar}>
                      <div 
                        className={styles.activityFill}
                        style={{ 
                          width: `${node.activity}%`,
                          backgroundColor: getStatusColor(node.status)
                        }}
                      ></div>
                      <span className={styles.activityText}>{node.activity.toFixed(1)}%</span>
                    </span>
                  </div>
                  <div className={styles.metric}>
                    <span>Pulse:</span>
                    <span>{node.pulseRate.toFixed(1)}Hz</span>
                  </div>
                  <div className={styles.metric}>
                    <span>Status:</span>
                    <span style={{ color: getStatusColor(node.status) }}>
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Panel */}
      {activityMap?.alerts && activityMap.alerts.length > 0 && (
        <div className={styles.alertsPanel}>
          <h3>🚨 Active Alerts</h3>
          <div className={styles.alerts}>
            {activityMap.alerts.map((alert, index) => (
              <div key={index} className={styles.alert}>
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
