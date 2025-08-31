/**
 * WEB8 EuroWeb - AGI Sheet Component (INDUSTRIAL VERSION)
 * Real AGI Integration with Zero Mock/Simulations
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra - Pure Real Implementation
 */

'use client'

import { cva } from 'class-variance-authority';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import styles from './AGISheet.module.css';

interface Cell {
  id: string;
  row: number;
  col: number;
  value: string;
  formula?: string;
  type: 'text' | 'number' | 'formula' | 'agi-command' | 'agi-status';
  agiBinding?: string;
  status?: 'idle' | 'processing' | 'active' | 'error' | 'warning' | 'inactive';
  metadata?: Record<string, any>;
}

interface AGILayer {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'processing';
  type: 'semantic' | 'decision' | 'planning' | 'control' | 'task' | 'admin' | 'core';
  connections: number;
  lastUpdate: string;
  logs: string[];
  commands: string[];
  performance: {
    uptime: number;
    throughput: number;
    errorRate: number;
    responseTime: number;
  };
}

interface AGISheetProps {
  mode?: 'analysis' | 'decision' | 'planning' | 'control' | 'task' | 'admin';
  width?: number;
  height?: number;
}

interface AGIError {
  message: string;
  code?: string;
}

// CVA for cell variants
const cellVariants = cva(styles.cell, {
  variants: {
    status: {
      idle: '',
      processing: styles.cellProcessing,
      active: styles.cellActive,
      error: styles.cellError,
      warning: styles.cellError,
      inactive: ''
    },
    selected: {
      true: styles.cellSelected,
      false: ''
    },
    header: {
      true: styles.cellHeader,
      false: ''
    },
    rowHeader: {
      true: styles.cellRowHeader,
      false: ''
    },
    agi: {
      true: styles.cellAgi,
      false: ''
    }
  },
  defaultVariants: {
    status: 'idle',
    selected: false,
    header: false,
    rowHeader: false,
    agi: false
  }
});

// CVA for AGI toggle button
const agiToggleVariants = cva(styles.agiToggle, {
  variants: {
    active: {
      true: styles.active,
      false: ''
    }
  },
  defaultVariants: {
    active: false
  }
});

// CVA for status indicators
const statusIndicatorVariants = cva(styles.statusIndicator, {
  variants: {
    status: {
      active: styles.statusActive,
      processing: styles.statusProcessing,
      error: styles.statusError,
      warning: styles.statusWarning,
      inactive: styles.statusInactive,
      idle: styles.statusInactive
    }
  }
});

const AGISheet: React.FC<AGISheetProps> = ({ 
  mode = 'analysis', 
  width = 20, 
  height = 50 
}) => {
  const [cells, setCells] = useState<Map<string, Cell>>(new Map());
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaBar, setFormulaBar] = useState<string>('');
  const [agiLayers, setAgiLayers] = useState<AGILayer[]>([]);
  const [isAGIActive, setIsAGIActive] = useState(true);
  const [currentMode, setCurrentMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AGIError | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load real AGI layers from API
  useEffect(() => {
    loadAGILayers();

    // Refresh layers every 30 seconds
    const interval = setInterval(loadAGILayers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real API call to load AGI layers
  const loadAGILayers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/agi/layers');

      if (!response.ok) {
        throw new Error(`Failed to load AGI layers: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load AGI layers');
      }

      setAgiLayers(data.layers);
      initializeAGIOverview(data.layers);

    } catch (err) {
      console.error('AGI Layers error:', err);
      setError({
        message: err instanceof Error ? err.message : 'Failed to load AGI layers',
        code: 'LAYERS_LOAD_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize AGI overview with real data
  const initializeAGIOverview = (layers: AGILayer[]) => {
    const newCells = new Map<string, Cell>();
    
    // Headers
    const headers = ['Layer Name', 'Status', 'Type', 'Connections', 'Last Update', 'Commands', 'AGI Binding'];
    headers.forEach((header, colIndex) => {
      const cellId = `${0}-${colIndex}`;
      newCells.set(cellId, {
        id: cellId,
        row: 0,
        col: colIndex,
        value: header,
        type: 'text',
        status: 'active'
      });
    });

    // Real AGI Layer data
    layers.forEach((layer, rowIndex) => {
      const actualRow = rowIndex + 1;

      newCells.set(`${actualRow}-0`, {
        id: `${actualRow}-0`,
        row: actualRow,
        col: 0,
        value: layer.name,
        type: 'text',
        agiBinding: layer.id,
        status: layer.status
      });

      newCells.set(`${actualRow}-1`, {
        id: `${actualRow}-1`,
        row: actualRow,
        col: 1,
        value: layer.status.toUpperCase(),
        type: 'agi-status',
        agiBinding: layer.id,
        status: layer.status
      });

      newCells.set(`${actualRow}-2`, {
        id: `${actualRow}-2`,
        row: actualRow,
        col: 2,
        value: layer.type,
        type: 'text',
        agiBinding: layer.id
      });

      newCells.set(`${actualRow}-3`, {
        id: `${actualRow}-3`,
        row: actualRow,
        col: 3,
        value: layer.connections.toString(),
        type: 'number',
        agiBinding: layer.id
      });

      newCells.set(`${actualRow}-4`, {
        id: `${actualRow}-4`,
        row: actualRow,
        col: 4,
        value: new Date(layer.lastUpdate).toLocaleTimeString(),
        type: 'text',
        agiBinding: layer.id
      });

      newCells.set(`${actualRow}-5`, {
        id: `${actualRow}-5`,
        row: actualRow,
        col: 5,
        value: layer.commands.join(', '),
        type: 'agi-command',
        agiBinding: layer.id
      });

      newCells.set(`${actualRow}-6`, {
        id: `${actualRow}-6`,
        row: actualRow,
        col: 6,
        value: `AGI.${layer.id}`,
        type: 'agi-command',
        agiBinding: layer.id,
        status: 'active'
      });
    });

    setCells(newCells);
  };

  // Real AGI command processing via API
  const processAGICommand = async (cell: Cell, command: string) => {
    if (!cell.agiBinding) {
      console.error('No AGI binding for cell:', cell.id);
      return;
    }

    try {
      // Update cell to processing state
      updateCellStatus(cell.id, 'processing');

      const response = await fetch('/api/agi/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          binding: cell.agiBinding,
          cellId: cell.id
        }),
      });

      if (!response.ok) {
        throw new Error(`AGI command failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        updateCellStatus(cell.id, result.status);
        updateLayerFromResult(cell.agiBinding, result);
      } else {
        updateCellStatus(cell.id, 'error');
        console.error('AGI command error:', result.error);
      }
    } catch (error) {
      console.error('AGI command processing error:', error);
      updateCellStatus(cell.id, 'error');
    }
  };

  // Update layer data from API result
  const updateLayerFromResult = (layerId: string, result: any) => {
    setAgiLayers(prev => prev.map(layer =>
      layer.id === layerId
        ? {
          ...layer,
          status: result.status,
          lastUpdate: new Date().toISOString(),
          logs: result.logs || layer.logs
        }
        : layer
    ));
  };

  // Update cell status
  const updateCellStatus = (cellId: string, status: Cell['status']) => {
    setCells(prev => {
      const newCells = new Map(prev);
      const cell = newCells.get(cellId);
      if (cell) {
        newCells.set(cellId, { ...cell, status });
      }
      return newCells;
    });
  };

  // Generate cell ID
  const getCellId = (row: number, col: number): string => `${row}-${col}`;

  // Generate column letters
  const getColumnLetter = (col: number): string => {
    let result = '';
    while (col >= 0) {
      result = String.fromCharCode(65 + (col % 26)) + result;
      col = Math.floor(col / 26) - 1;
    }
    return result;
  };

  // Get cell value
  const getCellValue = (row: number, col: number): string => {
    const cell = cells.get(getCellId(row, col));
    return cell?.value || '';
  };

  // Set cell value with real AGI processing
  const setCellValue = (row: number, col: number, value: string, type?: Cell['type']) => {
    const cellId = getCellId(row, col);
    const existingCell = cells.get(cellId);
    
    const newCell: Cell = {
      id: cellId,
      row,
      col,
      value,
      type: type || existingCell?.type || 'text',
      agiBinding: existingCell?.agiBinding,
      status: existingCell?.status || 'idle'
    };

    // Real AGI processing for special commands
    if (newCell.type === 'agi-command' && value.startsWith('AGI.')) {
      const [, layerId, action] = value.split('.');
      if (layerId && action) {
        processAGICommand(newCell, action);
      }
    }

    setCells(prev => new Map(prev.set(cellId, newCell)));
  };

  // Handle cell interactions
  const handleCellClick = (row: number, col: number) => {
    const cellId = getCellId(row, col);
    setSelectedCell(cellId);
    const cell = cells.get(cellId);
    setFormulaBar(cell?.formula || cell?.value || '');
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    const cellId = getCellId(row, col);
    const cell = cells.get(cellId);
    
    if (cell?.type === 'agi-command' && cell.agiBinding) {
      // Execute AGI command directly
      const command = cell.value.split('.').pop() || 'PROCESS';
      processAGICommand(cell, command);
    }
  };

  // Handle formula bar input
  const handleFormulaSubmit = () => {
    if (selectedCell) {
      const [row, col] = selectedCell.split('-').map(Number);
      setCellValue(row, col, formulaBar);
    }
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.header}
      >
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            AGISheet - Industrial Neural Processing Grid
          </h2>
          <p className={styles.description}>
            Real-time AGI integration • Mode: {currentMode} • {isAGIActive ? 'AGI ACTIVE' : 'AGI STANDBY'}
          </p>
        </div>
        <div className={styles.headerControls}>
          <select
            value={currentMode}
            onChange={(e) => setCurrentMode(e.target.value as any)}
            className={styles.modeSelect}
            title="Select AGI Mode"
            aria-label="AGI Mode Selection"
          >
            <option value="analysis">Analysis</option>
            <option value="decision">Decision</option>
            <option value="planning">Planning</option>
            <option value="control">Control</option>
            <option value="task">Task</option>
            <option value="admin">Admin</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAGIActive(!isAGIActive)}
            className={clsx(agiToggleVariants({ active: isAGIActive }))}
          >
            {isAGIActive ? 'AGI ON' : 'AGI OFF'}
          </motion.button>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.errorState}
        >
          ⚠️ {error.message}
        </motion.div>
      )}

      {/* Formula Bar */}
      <div className={styles.formulaBar}>
        <span className={styles.cellReference}>
          {selectedCell || 'A1'}
        </span>
        <input
          type="text"
          value={formulaBar}
          onChange={(e) => setFormulaBar(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleFormulaSubmit()}
          placeholder="Enter formula, AGI command, or value..."
          className={styles.formulaInput}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loadingSpinner} />
      )}

      {/* AGI Sheet Grid */}
      <div ref={containerRef} className={styles.gridContainer}>
        <div className={styles.gridWrapper}>
          {/* Column Headers */}
          <div className={styles.columnHeaders}>
            <div className={clsx(cellVariants({ header: true }))}>
              #
            </div>
            {Array.from({ length: width }, (_, colIndex) => (
              <div
                key={`col-${colIndex}`}
                className={clsx(cellVariants({ header: true }))}
              >
                {getColumnLetter(colIndex)}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: height }, (_, rowIndex) => (
            <div key={`row-${rowIndex}`} className={styles.row}>
              {/* Row Header */}
              <div className={clsx(cellVariants({ rowHeader: true }))}>
                {rowIndex + 1}
              </div>

              {/* Cells */}
              {Array.from({ length: width }, (_, colIndex) => {
                const cellId = getCellId(rowIndex, colIndex);
                const cell = cells.get(cellId);
                const isSelected = selectedCell === cellId;
                const isHeader = rowIndex === 0;

                return (
                  <motion.div
                    key={cellId}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                    className={clsx(cellVariants({
                      status: cell?.status,
                      selected: isSelected,
                      header: isHeader,
                      agi: !!cell?.agiBinding
                    }))}
                  >
                    <span className={styles.cellValue}>
                      {getCellValue(rowIndex, colIndex)}
                    </span>

                    {/* AGI Status Indicator */}
                    {cell?.agiBinding && (
                      <div className={clsx(statusIndicatorVariants({ status: cell.status }))} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className={styles.statusBar}>
        <span className={styles.statusActiveText}>
          ✅ AGI Layers: {agiLayers.filter(l => l.status === 'active').length}/{agiLayers.length} Active
        </span>
        <span className={styles.statusInfo}>
          📊 Cells: {cells.size} | 🧠 AGI Bindings: {Array.from(cells.values()).filter(c => c.agiBinding).length}
        </span>
        <span className={styles.statusBrand}>
          ⚡ EuroWeb AGISheet v8.0 | Industrial Mode
        </span>
      </div>
    </div>
  );
};

export default AGISheet;
export { AGISheet };

