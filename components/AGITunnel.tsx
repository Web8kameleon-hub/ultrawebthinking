// AGI Tunnel Component - Pure TypeScript + Framer Motion - Industrial Grade
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';
import styles from './AGITunnel.module.css';

// CVA for tunnel container
const tunnelVariants = cva(styles.container, {
  variants: {
    theme: {
      light: styles.light,
      dark: styles.dark,
      agi: styles.agi
    }
  },
  defaultVariants: {
    theme: 'agi'
  }
});

// CVA for nodes
const nodeVariants = cva(styles.node, {
  variants: {
    type: {
      input: styles.nodeInput,
      processing: styles.nodeProcessing,
      relay: styles.nodeRelay,
      output: styles.nodeOutput
    },
    selected: {
      true: styles.nodeSelected,
      false: ''
    }
  },
  defaultVariants: {
    selected: false
  }
});

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

  // Node type styles - using real data only
  const getNodeStyle = (node: TunnelNode) => {
    const baseSize = 16 + (node.intensity / 100) * 8;

    return {
      width: `${baseSize}px`,
      height: `${baseSize}px`,
      transform: `translate(-50%, -50%) translateZ(${node.z * 20}px)`,
      boxShadow: node.type === 'input' ? '0 0 8px #00ff7f' :
        node.type === 'processing' ? '0 0 8px #ffff00' :
          node.type === 'relay' ? '0 0 8px #ff69b4' : '0 0 8px #ff1493'
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
      className={tunnelVariants({ theme })}
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      {/* Background Grid */}
      <div className={styles.backgroundGrid} />

      {/* Connections */}
      <svg className={styles.svg}>
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
                stroke={theme === 'light' ? '#adb5bd' : theme === 'dark' ? '#495057' : '#dda0dd'}
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
              fill={theme === 'light' ? '#007bff' : theme === 'dark' ? '#0dcaf0' : '#00ff7f'}
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
            boxShadow: '0 0 20px rgba(138, 43, 226, 0.8)'
          }}
          whileTap={{ scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: node.z * 0.1
          }}
          onClick={() => handleNodeClick(node)}
          className={nodeVariants({ type: node.type, selected: node === selectedNode })}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            ...getNodeStyle(node)
          }}
        >
          {node.type[0].toUpperCase()}
        </motion.div>
      ))}

      {/* Info Panel */}
      <div className={styles.infoPanel}>
        <div>Nodes: {nodes.length}</div>
        <div>Active Flows: {dataFlows.length}</div>
        <div>Selected: {selectedNode ? selectedNode.id : 'no data'}</div>
        <div>Theme: {theme.toUpperCase()}</div>
      </div>

      {/* Performance Metrics */}
      <div className={styles.performanceMetrics}>
        <div>Throughput: {dataFlows.length > 0 ? Math.round(dataFlows.length * 1.5) : 0} ops/s</div>
        <div>Latency: {dataFlows.length > 0 ? '5-15ms' : 'no data'}</div>
        <div>Efficiency: {nodes.length > 0 ? Math.round(nodes.reduce((acc, n) => acc + n.intensity, 0) / nodes.length) : 0}%</div>
      </div>
    </motion.div>
  );
};

// Default export
export default AGITunnel;

