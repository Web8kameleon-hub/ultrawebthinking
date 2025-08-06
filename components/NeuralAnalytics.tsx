/**
 * WEB8 EuroWeb - Neural Analytics Component
 * Real-time Neural Network Monitoring
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra
 */

'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NeuralNode {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'output' | 'decision' | 'ethical';
  activity: number;
  pulseRate: number;
  status: 'active' | 'idle' | 'overloaded';
  connections: number;
  errorCount: number;
  position: { x: number; y: number };
}

interface NeuralMetrics {
  totalNodes: number;
  activeNodes: number;
  averageActivity: number;
  throughput: number;
  latency: number;
  accuracy: number;
  learningRate: number;
  memoryUsage: number;
}

export const NeuralAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<NeuralMetrics>({
    totalNodes: 0,
    activeNodes: 0,
    averageActivity: 0,
    throughput: 0,
    latency: 0,
    accuracy: 0,
    learningRate: 0,
    memoryUsage: 0
  });

  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading neural data
    const timer = setTimeout(() => {
      setMetrics({
        totalNodes: 847,
        activeNodes: 823,
        averageActivity: 76.3,
        throughput: 1250.7,
        latency: 12.4,
        accuracy: 97.8,
        learningRate: 0.0045,
        memoryUsage: 68.2
      });

      setNodes([
        {
          id: 'n1',
          name: 'Input Layer Alpha',
          type: 'input',
          activity: 89.5,
          pulseRate: 142.3,
          status: 'active',
          connections: 24,
          errorCount: 0,
          position: { x: 50, y: 150 }
        },
        {
          id: 'n2',
          name: 'Processing Core Beta',
          type: 'processing',
          activity: 95.2,
          pulseRate: 98.7,
          status: 'active',
          connections: 48,
          errorCount: 1,
          position: { x: 200, y: 100 }
        },
        {
          id: 'n3',
          name: 'Decision Engine Gamma',
          type: 'decision',
          activity: 82.1,
          pulseRate: 156.4,
          status: 'active',
          connections: 36,
          errorCount: 0,
          position: { x: 350, y: 180 }
        },
        {
          id: 'n4',
          name: 'Ethics Controller Delta',
          type: 'ethical',
          activity: 67.8,
          pulseRate: 45.2,
          status: 'active',
          connections: 12,
          errorCount: 0,
          position: { x: 500, y: 120 }
        },
        {
          id: 'n5',
          name: 'Output Interface Epsilon',
          type: 'output',
          activity: 91.3,
          pulseRate: 203.6,
          status: 'active',
          connections: 18,
          errorCount: 2,
          position: { x: 650, y: 160 }
        }
      ]);

      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getNodeColor = (type: string, status: string) => {
    if (status === 'overloaded') return '#ef4444';
    switch (type) {
      case 'input': return '#3b82f6';
      case 'processing': return '#8b5cf6';
      case 'decision': return '#f59e0b';
      case 'ethical': return '#10b981';
      case 'output': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        background: 'rgba(15, 20, 25, 0.9)',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(212, 175, 55, 0.3)',
            borderTop: '4px solid #d4af37',
            borderRadius: '50%'
          }}
        />
        <div style={{ marginLeft: '20px', fontSize: '18px', color: '#d4af37' }}>
          Loading Neural Analytics...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(15, 20, 25, 0.9)',
      minHeight: '100%',
      color: '#f8fafc'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '30px' }}
      >
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          background: 'linear-gradient(45deg, #d4af37, #f7e08b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          🧠 Neural Analytics Dashboard
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '16px' }}>
          Real-time monitoring of neural network performance and activity
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}
      >
        {Object.entries(metrics).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            style={{
              background: 'rgba(45, 52, 70, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#d4af37',
              marginBottom: '8px'
            }}>
              {typeof value === 'number' ? value.toFixed(1) : value}
              {key.includes('Rate') || key.includes('Usage') || key.includes('Activity') || key.includes('Accuracy') ? '%' : ''}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#cbd5e1',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Neural Network Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          background: 'rgba(26, 29, 41, 0.9)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px'
        }}
      >
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#d4af37',
          marginBottom: '20px'
        }}>
          Neural Network Topology
        </h2>

        <div style={{
          position: 'relative',
          height: '300px',
          background: 'rgba(15, 20, 25, 0.8)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Connection Lines */}
          <svg style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}>
            {nodes.map((node, i) => 
              nodes.slice(i + 1).map((targetNode, j) => (
                <motion.line
                  key={`${node.id}-${targetNode.id}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: (i + j) * 0.1 }}
                  x1={node.position.x + 30}
                  y1={node.position.y + 30}
                  x2={targetNode.position.x + 30}
                  y2={targetNode.position.y + 30}
                  stroke="rgba(212, 175, 55, 0.3)"
                  strokeWidth="1"
                />
              ))
            )}
          </svg>

          {/* Neural Nodes */}
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
              whileHover={{ scale: 1.1 }}
              style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
                width: '60px',
                height: '60px',
                background: getNodeColor(node.type, node.status),
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>
                {node.activity.toFixed(0)}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Node Details Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{
          background: 'rgba(26, 29, 41, 0.9)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '20px 30px',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#d4af37',
            margin: 0
          }}>
            Neural Node Status
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(45, 52, 70, 0.5)' }}>
                <th style={{ padding: '15px', textAlign: 'left', color: '#cbd5e1', fontSize: '14px' }}>Node</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#cbd5e1', fontSize: '14px' }}>Type</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#cbd5e1', fontSize: '14px' }}>Activity</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#cbd5e1', fontSize: '14px' }}>Pulse Rate</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#cbd5e1', fontSize: '14px' }}>Connections</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#cbd5e1', fontSize: '14px' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#cbd5e1', fontSize: '14px' }}>Errors</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => (
                <tr key={node.id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                  <td style={{ padding: '15px', color: '#f8fafc', fontSize: '14px' }}>{node.name}</td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    <span style={{
                      background: getNodeColor(node.type, node.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {node.type}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#d4af37', fontSize: '14px', fontWeight: 600 }}>
                    {node.activity.toFixed(1)}%
                  </td>
                  <td style={{ padding: '15px', color: '#f8fafc', fontSize: '14px' }}>
                    {node.pulseRate.toFixed(1)} Hz
                  </td>
                  <td style={{ padding: '15px', color: '#f8fafc', fontSize: '14px' }}>
                    {node.connections}
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px' }}>
                    <span style={{
                      color: node.status === 'active' ? '#22c55e' : node.status === 'overloaded' ? '#ef4444' : '#6b7280'
                    }}>
                      {node.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: node.errorCount > 0 ? '#ef4444' : '#22c55e', fontSize: '14px' }}>
                    {node.errorCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
