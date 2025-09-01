/**
 * Neural Activity Dashboard Component
 * Real-time visualization of AGI neural network activity
 *
 * @version 8.0.0-WEB8-ADVANCED
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
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

const nodeVariants = cva(styles.nodeBase, {
  variants: {
    status: {
      active: styles.nodeActive,
      throttled: styles.nodeThrottled,
      error: styles.nodeError,
      inactive: styles.nodeInactive
    },
    activity: {
      low: styles.activityLow,
      medium: styles.activityMedium,
      high: styles.activityHigh
    }
  },
  defaultVariants: {
    status: "active",
    activity: "medium"
  }
});

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
    }, 1000); // Update every second for real-time feel

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activityMap && canvasRef.current) {
      drawNeuralNetwork();
    }
  }, [activityMap]);

  const fetchNetworkStatus = async () => {
    // Mock data - replace with actual API call
    const mockStatus: NetworkStatus = {
      timestamp: Date.now(),
      isRunning: 0.5 > 0.1,
      safeThinkActive: 0.5 > 0.7,
      throttledNodes: 0.5 > 0.8 ? ['node1', 'node3'] : [],
      totalNodes: 8,
      activeNodes: Math.floor(0.5 * 3) + 6,
      nodes: Array.from({ length: 8 }, (_, i) => ({
        id: `node${i + 1}`,
        name: `Neural Processor ${i + 1}`,
        type: ['cognitive', 'memory', 'processing', 'analysis'][Math.floor(0.5 * 4)],
        activity: 0.5 * 100,
        pulseRate: 0.5 * 5 + 1,
        flickering: 0.5 * 2,
        status: 0.5 > 0.8 ? 'throttled' : 0.5 > 0.95 ? 'error' : 'active',
        connections: Math.floor(0.5 * 5) + 2,
        errorCount: Math.floor(0.5 * 3)
      })),
      recentActivity: []
    };
    setNetworkStatus(mockStatus);
  };

  const fetchActivityMap = async () => {
    const mockMap: ActivityMap = {
      timestamp: Date.now(),
      safeThinkActive: 0.5 > 0.7,
      alerts: 0.5 > 0.8 ? ['High memory usage detected', 'Connection timeout on node 3'] : [],
      map: {
        'node1': { name: 'Input Processor', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 100, y: 100 }, connections: ['node2', 'node3'] },
        'node2': { name: 'Memory Core', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 200, y: 100 }, connections: ['node1', 'node4'] },
        'node3': { name: 'Logic Engine', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 150, y: 200 }, connections: ['node1', 'node5'] },
        'node4': { name: 'Pattern Matcher', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 300, y: 150 }, connections: ['node2', 'node6'] },
        'node5': { name: 'Decision Tree', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 100, y: 300 }, connections: ['node3', 'node7'] },
        'node6': { name: 'Output Buffer', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 350, y: 250 }, connections: ['node4', 'node8'] },
        'node7': { name: 'Safety Monitor', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 200, y: 350 }, connections: ['node5', 'node8'] },
        'node8': { name: 'Response Gen', activity: 0.5 * 100, pulseRate: 0.5 * 5, flickering: 0.5 * 2, status: 'active', coordinates: { x: 300, y: 300 }, connections: ['node6', 'node7'] }
      }
    };
    setActivityMap(mockMap);
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
          ctx.strokeStyle = '#00ff64';
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    });

    // Draw nodes
    Object.entries(activityMap.map).forEach(([nodeId, node]) => {
      const { x, y } = node.coordinates;
      const nodeRadius = 15 + (node.activity / 100) * 10;

      // Draw node glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius * 2);
      gradient.addColorStop(0, 'rgba(0, 255, 100, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 255, 100, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius * 2, 0, 2 * Math.PI);
      ctx.fill();

      // Draw main node
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = node.status === 'active' ? '#00ff64' : 
                     node.status === 'throttled' ? '#ff6400' : '#ff0064';
      ctx.fill();

      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(nodeId, x, y + nodeRadius + 15);
    });
  };

  if (!networkStatus) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <div>Connecting to Neural Network...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.mainContainer}
      >
        {/* Header */}
        <div className={styles.header}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.title}
          >
            🧠 Neural Activity Monitor
          </motion.h1>
          <div className={styles.statusBar}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`${styles.statusBadge} ${isConnected ? styles.statusConnected : styles.statusDisconnected}`}
            >
              <div className={`${styles.statusDot} ${isConnected ? styles.dotConnected : styles.dotDisconnected}`}></div>
              {isConnected ? 'Neural Network Connected' : 'Connection Lost'}
            </motion.div>
            {networkStatus.safeThinkActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`${styles.statusBadge} ${styles.statusSafeThink}`}
              >
                <div className={`${styles.statusDot} ${styles.dotSafeThink}`}></div>
                🛡️ SafeThink Guardian Active
              </motion.div>
            )}
            {networkStatus.throttledNodes.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className={`${styles.statusBadge} ${styles.statusThrottled}`}
              >
                <div className={`${styles.statusDot} ${styles.dotThrottled}`}></div>
                ⚡ {networkStatus.throttledNodes.length} Node(s) Throttled
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.dashboardGrid}>
          {/* Network Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className={styles.visualizationCard}
          >
            <h3 className={styles.cardTitle}>🌐 Neural Network Topology</h3>
            <canvas
              ref={canvasRef}
              width={500}
              height={400}
              className={styles.networkCanvas}
            />
          </motion.div>

          {/* Nodes List */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className={styles.nodesList}
          >
            <h3 className={styles.cardTitle}>🔗 Active Nodes</h3>
            <div className={styles.scrollContainer}>
              <AnimatePresence>
                {networkStatus.nodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${styles.nodeItem} ${
                      node.status === 'active' ? styles.nodeItemActive :
                      node.status === 'throttled' ? styles.nodeItemThrottled :
                      node.status === 'error' ? styles.nodeItemError : styles.nodeItemInactive
                    }`}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    <div className={styles.nodeHeader}>
                      <span className={styles.nodeName}>{node.name}</span>
                      <span className={styles.nodeType}>{node.type}</span>
                    </div>
                    <div className={styles.nodeMetrics}>
                      <span className={styles.nodeActivity}>{node.activity.toFixed(1)}%</span>
                      <span className={styles.nodePulse}>{node.pulseRate.toFixed(1)} Hz</span>
                    </div>
                    
                    {selectedNode === node.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.nodeDetails}
                      >
                        <div className={styles.detailRow}>
                          <span>Node Type:</span>
                          <span>{node.type}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Flickering Index:</span>
                          <span>{node.flickering.toFixed(2)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Node ID:</span>
                          <span>{node.id}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Connections:</span>
                          <span>{node.connections}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Errors:</span>
                          <span>{node.errorCount}</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* System Alerts */}
        {activityMap?.alerts && activityMap.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={styles.alertsContainer}
          >
            <h3 className={styles.alertsTitle}>
              <span>⚠️</span>
              System Alerts & Notifications
            </h3>
            <div className={styles.alertsList}>
              {activityMap.alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.alertItem}
                >
                  <span className={styles.alertIcon}>🔴</span>
                  <div className={styles.alertContent}>
                    <p className={styles.alertMessage}>{alert}</p>
                    <p className={styles.alertTime}>
                      {new Date().toLocaleTimeString()} - Priority: High
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={styles.footer}
        >
          <p>Neural Activity Monitor v8.0.0-WEB8-ADVANCED • Real-time AGI Network Visualization</p>
          <p>Last Update: {new Date().toLocaleString()}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

