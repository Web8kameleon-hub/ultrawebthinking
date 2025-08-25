/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Wifi, WifiOff, AlertTriangle, CheckCircle, XCircle, Router, Globe, Zap } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  type: 'gateway' | 'router' | 'endpoint' | 'sensor';
  status: 'active' | 'inactive' | 'warning' | 'error';
  signalStrength: number;
  dataRate: number;
  batteryLevel?: number;
  connections: string[];
  lastSeen: Date;
  location: { x: number; y: number };
}

interface NetworkMetrics {
  totalNodes: number;
  activeNodes: number;
  totalTraffic: number;
  avgSignalStrength: number;
  networkHealth: number;
}

const NetworkMonitor: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      id: 'gw-001',
      name: 'Main Gateway',
      type: 'gateway',
      status: 'active',
      signalStrength: 95,
      dataRate: 1024,
      connections: ['rt-001', 'rt-002'],
      lastSeen: new Date(),
      location: { x: 400, y: 200 }
    },
    {
      id: 'rt-001',
      name: 'Router Alpha',
      type: 'router',
      status: 'active',
      signalStrength: 87,
      dataRate: 512,
      batteryLevel: 89,
      connections: ['gw-001', 'ep-001', 'ep-002'],
      lastSeen: new Date(),
      location: { x: 200, y: 100 }
    },
    {
      id: 'rt-002',
      name: 'Router Beta',
      type: 'router',
      status: 'warning',
      signalStrength: 65,
      dataRate: 256,
      batteryLevel: 23,
      connections: ['gw-001', 'ep-003'],
      lastSeen: new Date(Date.now() - 120000),
      location: { x: 600, y: 300 }
    },
    {
      id: 'ep-001',
      name: 'Sensor Node 1',
      type: 'endpoint',
      status: 'active',
      signalStrength: 78,
      dataRate: 64,
      batteryLevel: 67,
      connections: ['rt-001'],
      lastSeen: new Date(),
      location: { x: 100, y: 50 }
    },
    {
      id: 'ep-002',
      name: 'Sensor Node 2',
      type: 'endpoint',
      status: 'active',
      signalStrength: 82,
      dataRate: 64,
      batteryLevel: 91,
      connections: ['rt-001'],
      lastSeen: new Date(),
      location: { x: 300, y: 50 }
    },
    {
      id: 'ep-003',
      name: 'Sensor Node 3',
      type: 'endpoint',
      status: 'error',
      signalStrength: 0,
      dataRate: 0,
      batteryLevel: 0,
      connections: [],
      lastSeen: new Date(Date.now() - 600000),
      location: { x: 700, y: 400 }
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    totalNodes: 0,
    activeNodes: 0,
    totalTraffic: 0,
    avgSignalStrength: 0,
    networkHealth: 0
  });

  useEffect(() => {
    // Calculate metrics
    const activeNodes = nodes.filter(n => n.status === 'active').length;
    const totalTraffic = nodes.reduce((sum, n) => sum + n.dataRate, 0);
    const avgSignalStrength = nodes.reduce((sum, n) => sum + n.signalStrength, 0) / nodes.length;
    const healthScore = ((activeNodes / nodes.length) * 0.6 + (avgSignalStrength / 100) * 0.4) * 100;

    setMetrics({
      totalNodes: nodes.length,
      activeNodes,
      totalTraffic,
      avgSignalStrength: Math.round(avgSignalStrength),
      networkHealth: Math.round(healthScore)
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === 'active') {
          return {
            ...node,
            signalStrength: Math.max(0, Math.min(100, node.signalStrength + (Math.random() - 0.5) * 10)),
            dataRate: Math.max(0, node.dataRate + (Math.random() - 0.5) * 100),
            batteryLevel: node.batteryLevel ? Math.max(0, node.batteryLevel - Math.random() * 0.1) : undefined,
            lastSeen: new Date()
          };
        }
        return node;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [nodes]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'gateway':
        return <Globe className="w-4 h-4" />;
      case 'router':
        return <Router className="w-4 h-4" />;
      case 'endpoint':
        return <Activity className="w-4 h-4" />;
      case 'sensor':
        return <Zap className="w-4 h-4" />;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  const renderConnection = (from: NetworkNode, to: NetworkNode) => {
    const strokeWidth = from.status === 'active' && to.status === 'active' ? 2 : 1;
    const strokeColor = from.status === 'active' && to.status === 'active' ? '#10B981' : '#D1D5DB';
    
    return (
      <motion.line
        key={`${from.id}-${to.id}`}
        x1={from.location.x}
        y1={from.location.y}
        x2={to.location.x}
        y2={to.location.y}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={from.status === 'active' && to.status === 'active' ? '' : '5,5'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Network Monitor
        </h2>
        <p className="text-gray-600 mt-2">Real-time network topology and performance monitoring</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Nodes</p>
              <p className="text-2xl font-bold text-blue-800">{metrics.totalNodes}</p>
            </div>
            <Router className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Active Nodes</p>
              <p className="text-2xl font-bold text-green-800">{metrics.activeNodes}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Total Traffic</p>
              <p className="text-2xl font-bold text-purple-800">{metrics.totalTraffic.toFixed(0)} KB/s</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Avg Signal</p>
              <p className="text-2xl font-bold text-yellow-800">{metrics.avgSignalStrength}%</p>
            </div>
            <Wifi className="w-8 h-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`bg-gradient-to-r p-4 rounded-lg border ${
            metrics.networkHealth > 80 ? 'from-green-100 to-green-200' :
            metrics.networkHealth > 60 ? 'from-yellow-100 to-yellow-200' :
            'from-red-100 to-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                metrics.networkHealth > 80 ? 'text-green-700' :
                metrics.networkHealth > 60 ? 'text-yellow-700' :
                'text-red-700'
              }`}>Network Health</p>
              <p className={`text-2xl font-bold ${
                metrics.networkHealth > 80 ? 'text-green-800' :
                metrics.networkHealth > 60 ? 'text-yellow-800' :
                'text-red-800'
              }`}>{metrics.networkHealth}%</p>
            </div>
            {metrics.networkHealth > 80 ? 
              <CheckCircle className="w-8 h-8 text-green-600" /> :
              metrics.networkHealth > 60 ?
              <AlertTriangle className="w-8 h-8 text-yellow-600" /> :
              <XCircle className="w-8 h-8 text-red-600" />
            }
          </div>
        </motion.div>
      </div>

      {/* Network Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg border shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4">Network Topology</h3>
            <div className="relative">
              <svg width="800" height="500" className="border rounded">
                {/* Render connections */}
                {nodes.map(node => 
                  node.connections.map(connId => {
                    const connectedNode = nodes.find(n => n.id === connId);
                    return connectedNode ? renderConnection(node, connectedNode) : null;
                  })
                )}

                {/* Render nodes */}
                {nodes.map((node, index) => (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.circle
                      cx={node.location.x}
                      cy={node.location.y}
                      r={node.type === 'gateway' ? 20 : node.type === 'router' ? 15 : 10}
                      fill={getNodeColor(node.status)}
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-pointer"
                      whileHover={{ scale: 1.2 }}
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    />
                    <text
                      x={node.location.x}
                      y={node.location.y + 35}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700"
                    >
                      {node.name}
                    </text>
                    {node.batteryLevel !== undefined && (
                      <text
                        x={node.location.x}
                        y={node.location.y + 50}
                        textAnchor="middle"
                        className="text-xs fill-gray-500"
                      >
                        🔋 {Math.round(node.batteryLevel)}%
                      </text>
                    )}
                  </motion.g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Node Details */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-lg border shadow-lg"
            >
              {(() => {
                const node = nodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      {getNodeIcon(node.type)}
                      <h3 className="font-semibold text-gray-800">{node.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        node.status === 'active' ? 'bg-green-100 text-green-800' :
                        node.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        node.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Type:</span> {node.type}</p>
                      <p><span className="font-medium">Signal:</span> {node.signalStrength}%</p>
                      <p><span className="font-medium">Data Rate:</span> {node.dataRate} KB/s</p>
                      {node.batteryLevel !== undefined && (
                        <p><span className="font-medium">Battery:</span> {Math.round(node.batteryLevel)}%</p>
                      )}
                      <p><span className="font-medium">Connections:</span> {node.connections.length}</p>
                      <p><span className="font-medium">Last Seen:</span> {node.lastSeen.toLocaleTimeString()}</p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Node List */}
          <div className="bg-white p-4 rounded-lg border shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Network Nodes</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {nodes.map(node => (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-2 rounded border cursor-pointer transition-colors ${
                    selectedNode === node.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getNodeIcon(node.type)}
                      <span className="text-sm font-medium">{node.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {node.status === 'active' ? 
                        <Wifi className="w-4 h-4 text-green-500" /> :
                        <WifiOff className="w-4 h-4 text-red-500" />
                      }
                      <span className="text-xs text-gray-500">{node.signalStrength}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-3">Network Actions</h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Topology
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Optimize Routes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Emergency Shutdown
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitor;
