// AGI Tunnel Component - Pure TypeScript + Framer Motion - Industrial Grade
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TunnelNode {
  id: string;
  x: number;
  y: number;
  z: number;
  type: 'input' | 'processing' | 'output' | 'relay';
  intensity: number;
  connections: string[];
}

interface DataFlow {
  from: string;
  to: string;
  data: any;
  timestamp: number;
  speed: number;
}

interface AGITunnelProps {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark' | 'agi';
  showDataFlow?: boolean;
  onNodeClick?: (node: TunnelNode) => void;
  onDataFlow?: (flow: DataFlow) => void;
}

const AGITunnel: React.FC<AGITunnelProps> = ({
  width = 800,
  height = 600,
  theme = 'agi',
  showDataFlow = true,
  onNodeClick,
  onDataFlow
}) => {
  // Pure TypeScript - NO HOOKS - industrial grade
  let nodes: TunnelNode[] = [];
  let dataFlows: DataFlow[] = [];
  let selectedNode: TunnelNode | null = null as TunnelNode | null;

  // Theme configurations
  const themeConfigs = {
    light: {
      backgroundColor: '#f8f9fa',
      nodeColor: '#6c757d',
      connectionColor: '#adb5bd',
      dataFlowColor: '#007bff',
      textColor: '#212529'
    },
    dark: {
      backgroundColor: '#212529',
      nodeColor: '#6c757d',
      connectionColor: '#495057',
      dataFlowColor: '#0dcaf0',
      textColor: '#f8f9fa'
    },
    agi: {
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      nodeColor: '#8a2be2',
      connectionColor: '#dda0dd',
      dataFlowColor: '#00ff7f',
      textColor: '#ffffff'
    }
  };

  const config = themeConfigs[theme];

  // Initialize nodes
  const initializeNodes = () => {
    const newNodes: TunnelNode[] = [
      // Input layer
      { id: 'input-1', x: 10, y: 30, z: 0, type: 'input', intensity: 80, connections: ['proc-1', 'proc-2'] },
      { id: 'input-2', x: 10, y: 50, z: 0, type: 'input', intensity: 65, connections: ['proc-1', 'proc-3'] },
      { id: 'input-3', x: 10, y: 70, z: 0, type: 'input', intensity: 90, connections: ['proc-2', 'proc-3'] },
      
      // Processing layer
      { id: 'proc-1', x: 35, y: 25, z: 1, type: 'processing', intensity: 75, connections: ['relay-1', 'output-1'] },
      { id: 'proc-2', x: 35, y: 50, z: 1, type: 'processing', intensity: 85, connections: ['relay-1', 'output-2'] },
      { id: 'proc-3', x: 35, y: 75, z: 1, type: 'processing', intensity: 70, connections: ['relay-2', 'output-2'] },
      
      // Relay layer
      { id: 'relay-1', x: 60, y: 35, z: 2, type: 'relay', intensity: 60, connections: ['output-1', 'output-3'] },
      { id: 'relay-2', x: 60, y: 65, z: 2, type: 'relay', intensity: 55, connections: ['output-2', 'output-3'] },
      
      // Output layer
      { id: 'output-1', x: 85, y: 25, z: 3, type: 'output', intensity: 95, connections: [] },
      { id: 'output-2', x: 85, y: 50, z: 3, type: 'output', intensity: 88, connections: [] },
      { id: 'output-3', x: 85, y: 75, z: 3, type: 'output', intensity: 92, connections: [] }
    ];
    
    nodes = newNodes;
    return newNodes;
  };

  // Generate data flows
  const generateDataFlows = () => {
    const newFlows: DataFlow[] = [];
    
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        if (Math.random() > 0.7) { // 30% chance of data flow
          newFlows.push({
            from: node.id,
            to: targetId,
            data: { value: Math.random() * 100, type: 'neural_signal' },
            timestamp: Date.now(),
            speed: 0.5 + Math.random() * 1.5
          });
        }
      });
    });
    
    dataFlows = newFlows;
    return newFlows;
  };

  // Handle node click
  const handleNodeClick = (node: TunnelNode) => {
    selectedNode = node;
    onNodeClick?.(node);
    console.log('Node clicked:', node);
  };

  // Node type styles
  const getNodeStyle = (node: TunnelNode) => {
    const baseSize = 16 + (node.intensity / 100) * 8;
    const colors = {
      input: '#00ff7f',
      processing: '#ffff00',
      relay: '#ff69b4',
      output: '#ff1493'
    };

    return {
      width: `${baseSize}px`,
      height: `${baseSize}px`,
      backgroundColor: colors[node.type],
      border: node === selectedNode ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '50%',
      boxShadow: `0 0 ${node.intensity / 10}px ${colors[node.type]}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '8px',
      fontWeight: 'bold',
      color: 'black'
    };
  };

  // Initialize immediately - NO useEffect
  initializeNodes();
  generateDataFlows();

    const interval = setInterval(() => {
      if (showDataFlow) {
        const flows = generateDataFlows();
        flows.forEach(flow => onDataFlow?.(flow));
      }
    }, 1000);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: config.backgroundColor,
        border: `2px solid ${config.nodeColor}`,
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        perspective: '1000px',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Background Grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            radial-gradient(circle at 2px 2px, ${config.connectionColor}40 1px, transparent 0)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }}
      />

      {/* Connections */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        } as any}
      >
        {nodes.map(node => 
          node.connections.map(targetId => {
            const targetNode = nodes.find(n => n.id === targetId);
            if (!targetNode) {return null;}

            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${targetNode.x}%`}
                y2={`${targetNode.y}%`}
                stroke={config.connectionColor}
                strokeWidth="2"
                strokeOpacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: Math.random() * 0.5 }}
              />
            );
          })
        )}

        {/* Data Flow Animations */}
        {showDataFlow && dataFlows.map((flow, index) => {
          const fromNode = nodes.find(n => n.id === flow.from);
          const toNode = nodes.find(n => n.id === flow.to);
          if (!fromNode || !toNode) {return null;}

          return (
            <motion.circle
              key={`flow-${index}`}
              r="3"
              fill={config.dataFlowColor}
              initial={{
                cx: `${fromNode.x}%`,
                cy: `${fromNode.y}%`,
                opacity: 1
              }}
              animate={{
                cx: `${toNode.x}%`,
                cy: `${toNode.y}%`,
                opacity: 0
              }}
              transition={{
                duration: flow.speed,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          );
        })}
      </svg>

      {/* Tunnel Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          whileHover={{ 
            scale: 1.3, 
            rotateY: 180,
            boxShadow: `0 0 20px ${config.nodeColor}`
          }}
          whileTap={{ scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: node.z * 0.1
          }}
          onClick={() => handleNodeClick(node)}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: `translate(-50%, -50%) translateZ(${node.z * 20}px)`,
            ...getNodeStyle(node)
          }}
        >
          {node.type[0].toUpperCase()}
        </motion.div>
      ))}

      {/* Info Panel */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          color: config.textColor,
          fontSize: '12px',
          fontFamily: 'monospace'
        } as any}
      >
        <div>Nodes: {nodes.length}</div>
        <div>Active Flows: {dataFlows.length}</div>
        <div>Selected: {selectedNode ? selectedNode.id : 'None'}</div>
        <div>Theme: {theme.toUpperCase()}</div>
      </div>

      {/* Performance Metrics */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '8px',
          color: config.textColor,
          fontSize: '10px',
          fontFamily: 'monospace'
        } as any}
      >
        <div>Throughput: {Math.round(dataFlows.length * 1.5)} ops/s</div>
        <div>Latency: {Math.round(Math.random() * 10 + 5)}ms</div>
        <div>Efficiency: {Math.round(nodes.reduce((acc, n) => acc + n.intensity, 0) / nodes.length)}%</div>
      </div>
    </motion.div>
  );
};

// Removed default export: AGITunnel;

