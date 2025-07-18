import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { css } from 'styled-system/css';
import { 
  primaryColorVar,
  secondaryColorVar,
  backgroundColorVar,
  textColorVar,
  fadeInUp,
  pulse,
  agiGlow,
  morphingBackground,
  glassMorphism
} from '../styles/vanilla-extract.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

// AGI Tunnel Data Types
interface TunnelNode {
  id: string;
  type: 'input' | 'processing' | 'output' | 'memory' | 'decision';
  label: string;
  status: 'idle' | 'active' | 'processing' | 'completed' | 'error';
  data?: any;
  connections: string[];
  position: { x: number; y: number };
}

interface TunnelFlow {
  id: string;
  fromNode: string;
  toNode: string;
  data: any;
  speed: number;
  color: string;
}

interface AGITunnelProps {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark' | 'agi';
  showDataFlow?: boolean;
  interactive?: boolean;
  onNodeClick?: (node: TunnelNode) => void;
  onFlowComplete?: (flow: TunnelFlow) => void;
}

const AGITunnel: React.FC<AGITunnelProps> = ({
  width = 1000,
  height = 600,
  theme = 'agi',
  showDataFlow = true,
  interactive = true,
  onNodeClick,
  onFlowComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<TunnelNode[]>([]);
  const [flows, setFlows] = useState<TunnelFlow[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize AGI Tunnel Nodes
  useEffect(() => {
    const initialNodes: TunnelNode[] = [
      {
        id: 'input',
        type: 'input',
        label: 'Input Layer',
        status: 'idle',
        connections: ['sense', 'memory'],
        position: { x: 100, y: height / 2 }
      },
      {
        id: 'sense',
        type: 'processing',
        label: 'Sensory Processing',
        status: 'idle',
        connections: ['analysis', 'pattern'],
        position: { x: 250, y: height / 3 }
      },
      {
        id: 'memory',
        type: 'memory',
        label: 'Memory Core',
        status: 'idle',
        connections: ['analysis', 'context'],
        position: { x: 250, y: (height * 2) / 3 }
      },
      {
        id: 'analysis',
        type: 'processing',
        label: 'Deep Analysis',
        status: 'idle',
        connections: ['decision'],
        position: { x: 400, y: height / 2 }
      },
      {
        id: 'pattern',
        type: 'processing',
        label: 'Pattern Recognition',
        status: 'idle',
        connections: ['decision'],
        position: { x: 400, y: height / 4 }
      },
      {
        id: 'context',
        type: 'processing',
        label: 'Context Engine',
        status: 'idle',
        connections: ['decision'],
        position: { x: 400, y: (height * 3) / 4 }
      },
      {
        id: 'decision',
        type: 'decision',
        label: 'Decision Matrix',
        status: 'idle',
        connections: ['synthesis', 'validation'],
        position: { x: 550, y: height / 2 }
      },
      {
        id: 'synthesis',
        type: 'processing',
        label: 'Response Synthesis',
        status: 'idle',
        connections: ['output'],
        position: { x: 700, y: height / 3 }
      },
      {
        id: 'validation',
        type: 'processing',
        label: 'Output Validation',
        status: 'idle',
        connections: ['output'],
        position: { x: 700, y: (height * 2) / 3 }
      },
      {
        id: 'output',
        type: 'output',
        label: 'Output Layer',
        status: 'idle',
        connections: [],
        position: { x: 850, y: height / 2 }
      }
    ];

    setNodes(initialNodes);
  }, [height]);

  // Theme configuration
  const getThemeVars = () => {
    switch (theme) {
      case 'dark':
        return {
          [primaryColorVar]: '#818cf8',
          [secondaryColorVar]: '#34d399',
          [backgroundColorVar]: '#111827',
          [textColorVar]: '#f9fafb'
        };
      case 'light':
        return {
          [primaryColorVar]: '#6366f1',
          [secondaryColorVar]: '#10b981',
          [backgroundColorVar]: '#ffffff',
          [textColorVar]: '#1f2937'
        };
      default: // agi theme
        return {
          [primaryColorVar]: '#00f5ff',
          [secondaryColorVar]: '#ff6b6b',
          [backgroundColorVar]: '#0a0a0a',
          [textColorVar]: '#ffffff'
        };
    }
  };

  // Node status colors
  const getNodeColor = (node: TunnelNode) => {
    switch (node.status) {
      case 'active': return '#00f5ff';
      case 'processing': return '#ff6b6b';
      case 'completed': return '#4ade80';
      case 'error': return '#ef4444';
      default: return '#64748b';
    }
  };

  // Node type icons
  const getNodeIcon = (type: TunnelNode['type']) => {
    switch (type) {
      case 'input': return '📥';
      case 'processing': return '⚙️';
      case 'output': return '📤';
      case 'memory': return '🧠';
      case 'decision': return '🎯';
      default: return '🔘';
    }
  };

  // Start AGI Processing Flow
  const startProcessing = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Simulate AGI processing flow
    const processQueue = ['input', 'sense', 'memory', 'analysis', 'pattern', 'context', 'decision', 'synthesis', 'validation', 'output'];
    
    for (const nodeId of processQueue) {
      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, status: 'processing' }
          : node
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, status: 'completed' }
          : node
      ));
      
      // Create data flow
      if (showDataFlow) {
        const currentNode = nodes.find(n => n.id === nodeId);
        if (currentNode && currentNode.connections.length > 0) {
          currentNode.connections.forEach(targetId => {
            const flow: TunnelFlow = {
              id: `${nodeId}-${targetId}-${Date.now()}`,
              fromNode: nodeId,
              toNode: targetId,
              data: { processed: true, timestamp: Date.now() },
              speed: 1,
              color: getNodeColor(currentNode)
            };
            
            setFlows(prev => [...prev, flow]);
            
            // Remove flow after animation
            setTimeout(() => {
              setFlows(prev => prev.filter(f => f.id !== flow.id));
              onFlowComplete?.(flow);
            }, 1000);
          });
        }
      }
    }
    
    // Reset after completion
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({ ...node, status: 'idle' })));
      setIsProcessing(false);
    }, 2000);
  };

  // Handle node click
  const handleNodeClick = (node: TunnelNode) => {
    if (!interactive) return;
    
    setSelectedNode(node.id);
    onNodeClick?.(node);
    
    // Auto-deselect after 3 seconds
    setTimeout(() => setSelectedNode(null), 3000);
  };

  return (
    <div
      style={assignInlineVars(getThemeVars())}
      className={css({
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        bg: backgroundColorVar,
        borderRadius: 'xl',
        overflow: 'hidden',
        border: '2px solid',
        borderColor: primaryColorVar
      })}
    >
      {/* Background Effect */}
      <div className={`${morphingBackground} ${css({ 
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        zIndex: 1
      })}`} />
      
      {/* Tunnel Grid */}
      <svg
        width={width}
        height={height}
        className={css({ position: 'absolute', inset: 0, zIndex: 2 })}
      >
        {/* Grid Lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke={primaryColorVar} strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Node Connections */}
        {nodes.map(node => 
          node.connections.map(targetId => {
            const targetNode = nodes.find(n => n.id === targetId);
            if (!targetNode) return null;
            
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={node.position.x}
                y1={node.position.y}
                x2={targetNode.position.x}
                y2={targetNode.position.y}
                stroke={primaryColorVar}
                strokeWidth="2"
                opacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            );
          })
        )}
        
        {/* Data Flow Animations */}
        <AnimatePresence>
          {flows.map(flow => {
            const fromNode = nodes.find(n => n.id === flow.fromNode);
            const toNode = nodes.find(n => n.id === flow.toNode);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <motion.circle
                key={flow.id}
                r="4"
                fill={flow.color}
                initial={{ 
                  cx: fromNode.position.x,
                  cy: fromNode.position.y,
                  opacity: 0
                }}
                animate={{ 
                  cx: toNode.position.x,
                  cy: toNode.position.y,
                  opacity: [0, 1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </AnimatePresence>
      </svg>
      
      {/* Nodes */}
      <div className={css({ position: 'relative', zIndex: 3 })}>
        {nodes.map(node => (
          <motion.div
            key={node.id}
            className={`${node.id === selectedNode ? agiGlow : ''} ${css({
              position: 'absolute',
              cursor: interactive ? 'pointer' : 'default',
              userSelect: 'none'
            })}`}
            style={{
              left: node.position.x - 40,
              top: node.position.y - 30
            }}
            onClick={() => handleNodeClick(node)}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
          >
            {/* Node Circle */}
            <motion.div
              className={css({
                w: '20',
                h: '20',
                borderRadius: 'full',
                border: '3px solid',
                borderColor: getNodeColor(node),
                bg: backgroundColorVar,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'sm',
                mb: '2'
              })}
              animate={node.status === 'processing' ? {
                scale: [1, 1.2, 1],
                borderColor: [getNodeColor(node), '#ff6b6b', getNodeColor(node)]
              } : {}}
              transition={{ duration: 0.8, repeat: node.status === 'processing' ? Infinity : 0 }}
            >
              {getNodeIcon(node.type)}
            </motion.div>
            
            {/* Node Label */}
            <div className={css({
              fontSize: 'xs',
              textAlign: 'center',
              color: textColorVar,
              fontWeight: 'semibold',
              maxW: '20',
              lineHeight: 'tight'
            })}>
              {node.label}
            </div>
            
            {/* Status Indicator */}
            {node.status !== 'idle' && (
              <motion.div
                className={css({
                  position: 'absolute',
                  top: '-2',
                  right: '-2',
                  w: '4',
                  h: '4',
                  borderRadius: 'full',
                  bg: getNodeColor(node)
                })}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Control Panel */}
      <div className={`${glassMorphism} ${css({
        position: 'absolute',
        top: '4',
        right: '4',
        p: '4',
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
        zIndex: 10
      })}`}>
        <motion.button
          onClick={startProcessing}
          disabled={isProcessing}
          className={css({
            px: '3',
            py: '2',
            bg: primaryColorVar,
            color: 'white',
            borderRadius: 'md',
            border: 'none',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: 'sm',
            fontWeight: 'semibold',
            opacity: isProcessing ? 0.7 : 1,
            transition: 'all 0.2s'
          })}
          whileHover={!isProcessing ? { scale: 1.05 } : {}}
          whileTap={!isProcessing ? { scale: 0.95 } : {}}
        >
          {isProcessing ? '🔄 Processing...' : '🚀 Start AGI Flow'}
        </motion.button>
        
        <div className={css({
          fontSize: 'xs',
          color: textColorVar,
          textAlign: 'center'
        })}>
          Theme: {theme.toUpperCase()}
        </div>
        
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={css({
              fontSize: 'xs',
              color: textColorVar,
              p: '2',
              bg: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 'sm',
              textAlign: 'center'
            })}
          >
            Selected: {nodes.find(n => n.id === selectedNode)?.label}
          </motion.div>
        )}
      </div>
      
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={css({
              position: 'absolute',
              inset: 0,
              bg: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20
            })}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={css({
                w: '16',
                h: '16',
                border: '4px solid',
                borderColor: primaryColorVar,
                borderTopColor: 'transparent',
                borderRadius: 'full'
              })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AGITunnel;
