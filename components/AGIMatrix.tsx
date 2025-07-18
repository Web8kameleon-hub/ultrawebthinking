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

// Matrix Cell Types
interface MatrixCell {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'data' | 'processing' | 'memory' | 'output' | 'neural' | 'quantum';
  intensity: number;
  connections: string[];
  isActive: boolean;
  lastUpdate: number;
}

interface AGIMatrixProps {
  width?: number;
  height?: number;
  gridSize?: number;
  theme?: 'matrix' | 'neural' | 'quantum' | 'cyber';
  autoUpdate?: boolean;
  interactive?: boolean;
  showConnections?: boolean;
  onCellClick?: (cell: MatrixCell) => void;
  onMatrixUpdate?: (matrix: MatrixCell[][]) => void;
}

const AGIMatrix: React.FC<AGIMatrixProps> = ({
  width = 800,
  height = 600,
  gridSize = 20,
  theme = 'matrix',
  autoUpdate = true,
  interactive = true,
  showConnections = true,
  onCellClick,
  onMatrixUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [matrix, setMatrix] = useState<MatrixCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<MatrixCell | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingWave, setProcessingWave] = useState<{x: number, y: number, radius: number} | null>(null);

  const rows = Math.floor(height / gridSize);
  const cols = Math.floor(width / gridSize);

  // Initialize Matrix
  useEffect(() => {
    const initMatrix = () => {
      const newMatrix: MatrixCell[][] = [];
      
      for (let y = 0; y < rows; y++) {
        const row: MatrixCell[] = [];
        for (let x = 0; x < cols; x++) {
          const cellTypes: MatrixCell['type'][] = ['data', 'processing', 'memory', 'output', 'neural', 'quantum'];
          const randomType = cellTypes[Math.floor(Math.random() * cellTypes.length)];
          
          const cell: MatrixCell = {
            id: `${x}-${y}`,
            x,
            y,
            value: Math.random(),
            type: randomType,
            intensity: Math.random() * 0.8 + 0.2,
            connections: [],
            isActive: Math.random() > 0.7,
            lastUpdate: Date.now()
          };
          
          // Add some connections to nearby cells
          if (x > 0) cell.connections.push(`${x-1}-${y}`);
          if (y > 0) cell.connections.push(`${x}-${y-1}`);
          if (x < cols - 1 && Math.random() > 0.6) cell.connections.push(`${x+1}-${y}`);
          if (y < rows - 1 && Math.random() > 0.6) cell.connections.push(`${x}-${y+1}`);
          
          row.push(cell);
        }
        newMatrix.push(row);
      }
      
      setMatrix(newMatrix);
      onMatrixUpdate?.(newMatrix);
    };

    initMatrix();
  }, [rows, cols, onMatrixUpdate]);

  // Auto-update matrix
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      setMatrix(prev => 
        prev.map(row => 
          row.map(cell => ({
            ...cell,
            value: Math.min(1, Math.max(0, cell.value + (Math.random() - 0.5) * 0.1)),
            intensity: Math.min(1, Math.max(0.1, cell.intensity + (Math.random() - 0.5) * 0.2)),
            isActive: Math.random() > 0.8 ? !cell.isActive : cell.isActive,
            lastUpdate: Date.now()
          }))
        )
      );
    }, 200);

    return () => clearInterval(interval);
  }, [autoUpdate]);

  // Theme configurations
  const getThemeConfig = () => {
    switch (theme) {
      case 'neural':
        return {
          vars: {
            [primaryColorVar]: '#ff6b6b',
            [secondaryColorVar]: '#4ecdc4',
            [backgroundColorVar]: '#2c3e50',
            [textColorVar]: '#ecf0f1'
          },
          colors: {
            data: '#3498db',
            processing: '#e74c3c',
            memory: '#9b59b6',
            output: '#2ecc71',
            neural: '#f39c12',
            quantum: '#1abc9c'
          }
        };
      case 'quantum':
        return {
          vars: {
            [primaryColorVar]: '#8b5cf6',
            [secondaryColorVar]: '#06b6d4',
            [backgroundColorVar]: '#0f172a',
            [textColorVar]: '#f1f5f9'
          },
          colors: {
            data: '#3b82f6',
            processing: '#8b5cf6',
            memory: '#ec4899',
            output: '#10b981',
            neural: '#f59e0b',
            quantum: '#06b6d4'
          }
        };
      case 'cyber':
        return {
          vars: {
            [primaryColorVar]: '#00ff00',
            [secondaryColorVar]: '#ff0080',
            [backgroundColorVar]: '#000000',
            [textColorVar]: '#00ff00'
          },
          colors: {
            data: '#00ff00',
            processing: '#ff0080',
            memory: '#0080ff',
            output: '#ffff00',
            neural: '#ff8000',
            quantum: '#8000ff'
          }
        };
      default: // matrix
        return {
          vars: {
            [primaryColorVar]: '#00ff41',
            [secondaryColorVar]: '#ff0040',
            [backgroundColorVar]: '#000000',
            [textColorVar]: '#00ff41'
          },
          colors: {
            data: '#00ff41',
            processing: '#ff0040',
            memory: '#00ffff',
            output: '#ffff00',
            neural: '#ff8040',
            quantum: '#8040ff'
          }
        };
    }
  };

  const themeConfig = getThemeConfig();

  // Handle cell click
  const handleCellClick = (cell: MatrixCell) => {
    if (!interactive) return;
    
    setSelectedCell(cell);
    onCellClick?.(cell);
    
    // Create processing wave effect
    setProcessingWave({ x: cell.x, y: cell.y, radius: 0 });
    
    setTimeout(() => setProcessingWave(null), 1000);
    setTimeout(() => setSelectedCell(null), 3000);
  };

  // Start AGI processing simulation
  const startProcessing = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Simulate neural network activation
    for (let wave = 0; wave < 5; wave++) {
      const centerX = Math.floor(cols / 2);
      const centerY = Math.floor(rows / 2);
      
      for (let radius = 0; radius < Math.max(cols, rows) / 2; radius++) {
        setMatrix(prev => 
          prev.map((row, y) => 
            row.map((cell, x) => {
              const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
              if (Math.abs(distance - radius) < 2) {
                return {
                  ...cell,
                  isActive: true,
                  intensity: 1,
                  value: Math.random()
                };
              }
              return cell;
            })
          )
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsProcessing(false);
  };

  return (
    <div
      ref={containerRef}
      style={assignInlineVars(themeConfig.vars)}
      className={css({
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        bg: backgroundColorVar,
        borderRadius: 'lg',
        overflow: 'hidden',
        border: '2px solid',
        borderColor: primaryColorVar,
        fontFamily: 'mono'
      })}
    >
      {/* Background Effect */}
      <div className={`${morphingBackground} ${css({
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        zIndex: 1
      })}`} />
      
      {/* Matrix Grid */}
      <div className={css({ position: 'relative', zIndex: 2 })}>
        {matrix.map((row, y) => 
          row.map((cell, x) => (
            <motion.div
              key={cell.id}
              className={css({
                position: 'absolute',
                cursor: interactive ? 'pointer' : 'default',
                userSelect: 'none'
              })}
              style={{
                left: x * gridSize,
                top: y * gridSize,
                width: gridSize - 1,
                height: gridSize - 1
              }}
              onClick={() => handleCellClick(cell)}
              whileHover={interactive ? { scale: 1.1, zIndex: 10 } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
            >
              {/* Cell Background */}
              <motion.div
                className={css({
                  w: 'full',
                  h: 'full',
                  borderRadius: 'sm',
                  position: 'relative',
                  overflow: 'hidden'
                })}
                style={{
                  backgroundColor: themeConfig.colors[cell.type],
                  opacity: cell.intensity * (cell.isActive ? 1 : 0.3)
                }}
                animate={cell.isActive ? {
                  opacity: [cell.intensity * 0.3, cell.intensity, cell.intensity * 0.3],
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: cell.isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {/* Cell Value Display */}
                <div className={css({
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: gridSize < 20 ? 'xs' : 'sm',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                })}>
                  {cell.type === 'quantum' ? '⚛️' :
                   cell.type === 'neural' ? '🧠' :
                   cell.type === 'memory' ? '💾' :
                   cell.type === 'processing' ? '⚙️' :
                   cell.type === 'output' ? '📤' :
                   Math.floor(cell.value * 9)}
                </div>
                
                {/* Connection Lines */}
                {showConnections && cell.connections.map(connId => {
                  const [connX, connY] = connId.split('-').map(Number);
                  if (connX >= 0 && connX < cols && connY >= 0 && connY < rows) {
                    const dx = (connX - x) * gridSize;
                    const dy = (connY - y) * gridSize;
                    
                    return (
                      <div
                        key={connId}
                        className={css({
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          w: '1px',
                          bg: primaryColorVar,
                          opacity: 0.3,
                          transformOrigin: 'top',
                          pointerEvents: 'none'
                        })}
                        style={{
                          height: Math.sqrt(dx * dx + dy * dy),
                          transform: `rotate(${Math.atan2(dy, dx) * 180 / Math.PI + 90}deg)`
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </motion.div>
              
              {/* Selection Highlight */}
              {selectedCell?.id === cell.id && (
                <motion.div
                  className={`${agiGlow} ${css({
                    position: 'absolute',
                    inset: '-2px',
                    border: '2px solid',
                    borderColor: primaryColorVar,
                    borderRadius: 'md',
                    pointerEvents: 'none'
                  })}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                />
              )}
            </motion.div>
          ))
        )}
      </div>
      
      {/* Processing Wave Effect */}
      <AnimatePresence>
        {processingWave && (
          <motion.div
            className={css({
              position: 'absolute',
              border: '2px solid',
              borderColor: primaryColorVar,
              borderRadius: 'full',
              pointerEvents: 'none'
            })}
            style={{
              left: processingWave.x * gridSize - processingWave.radius,
              top: processingWave.y * gridSize - processingWave.radius,
              width: processingWave.radius * 2,
              height: processingWave.radius * 2
            }}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 5,
              rotate: 360
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      
      {/* Control Panel */}
      <div className={`${glassMorphism} ${css({
        position: 'absolute',
        top: '4',
        left: '4',
        p: '3',
        display: 'flex',
        flexDirection: 'column',
        gap: '2',
        zIndex: 20,
        fontSize: 'sm'
      })}`}>
        <motion.button
          onClick={startProcessing}
          disabled={isProcessing}
          className={css({
            px: '3',
            py: '2',
            bg: primaryColorVar,
            color: 'black',
            borderRadius: 'md',
            border: 'none',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: 'xs',
            fontWeight: 'bold',
            opacity: isProcessing ? 0.7 : 1,
            transition: 'all 0.2s'
          })}
          whileHover={!isProcessing ? { scale: 1.05 } : {}}
          whileTap={!isProcessing ? { scale: 0.95 } : {}}
        >
          {isProcessing ? '🌊 Processing...' : '🚀 Activate Matrix'}
        </motion.button>
        
        <div className={css({ color: textColorVar, fontSize: 'xs', textAlign: 'center' })}>
          {theme.toUpperCase()} Theme
        </div>
        
        <div className={css({ color: textColorVar, fontSize: 'xs', textAlign: 'center' })}>
          {cols}×{rows} Cells
        </div>
        
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={css({
              color: textColorVar,
              fontSize: 'xs',
              p: '2',
              bg: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 'sm',
              maxW: '32'
            })}
          >
            <div>Cell: {selectedCell.id}</div>
            <div>Type: {selectedCell.type}</div>
            <div>Value: {selectedCell.value.toFixed(2)}</div>
            <div>Intensity: {selectedCell.intensity.toFixed(2)}</div>
          </motion.div>
        )}
      </div>
      
      {/* Stats Panel */}
      <div className={`${glassMorphism} ${css({
        position: 'absolute',
        bottom: '4',
        right: '4',
        p: '3',
        fontSize: 'xs',
        color: textColorVar,
        zIndex: 20
      })}`}>
        <div>Active Cells: {matrix.flat().filter(cell => cell.isActive).length}</div>
        <div>Total Cells: {matrix.flat().length}</div>
        <div>Connections: {matrix.flat().reduce((sum, cell) => sum + cell.connections.length, 0)}</div>
      </div>
    </div>
  );
};

export default AGIMatrix;
