'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'

interface Cell {
  id: string
  row: number
  col: number
  value: string
  formula?: string
  type: 'text' | 'number' | 'formula' | 'agi-command' | 'agi-status'
  agiBinding?: string
  status?: 'idle' | 'processing' | 'active' | 'error' | 'warning'
  metadata?: Record<string, any>
}

interface AGILayer {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error' | 'processing'
  type: 'semantic' | 'decision' | 'planning' | 'control' | 'task' | 'admin' | 'core'
  connections: number
  lastUpdate: Date
  logs: string[]
  commands: string[]
}

interface AGISheetProps {
  mode?: 'analysis' | 'decision' | 'planning' | 'control' | 'task' | 'admin'
  width?: number
  height?: number
}

// Named export for AGISheet
export const AGISheet: React.FC<AGISheetProps> = ({ 
  mode = 'analysis', 
  width = 20, 
  height = 50 
}) => {
  const [cells, setCells] = useState<Map<string, Cell>>(new Map())
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [formulaBar, setFormulaBar] = useState<string>('')
  const [agiLayers, setAgiLayers] = useState<AGILayer[]>([])
  const [isAGIActive, setIsAGIActive] = useState(true)
  const [currentMode, setCurrentMode] = useState(mode)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

  // Initialize AGI Layers
  useEffect(() => {
    const initialLayers: AGILayer[] = [
      {
        id: 'core',
        name: 'AGI Core Engine',
        status: 'active',
        type: 'core',
        connections: 7,
        lastUpdate: new Date(),
        logs: ['System initialized', 'Neural networks online'],
        commands: ['INIT', 'PROCESS', 'ANALYZE']
      },
      {
        id: 'semantic',
        name: 'Semantic Analysis',
        status: 'active',
        type: 'semantic',
        connections: 45,
        lastUpdate: new Date(),
        logs: ['Processing natural language', 'Context analysis complete'],
        commands: ['PARSE', 'UNDERSTAND', 'CLASSIFY']
      },
      {
        id: 'decision',
        name: 'Decision Engine',
        status: 'processing',
        type: 'decision',
        connections: 23,
        lastUpdate: new Date(),
        logs: ['Evaluating options', 'Decision tree analysis'],
        commands: ['DECIDE', 'EVALUATE', 'RECOMMEND']
      },
      {
        id: 'planning',
        name: 'Strategic Planning',
        status: 'active',
        type: 'planning',
        connections: 18,
        lastUpdate: new Date(),
        logs: ['Long-term strategy planning', 'Resource allocation'],
        commands: ['PLAN', 'SCHEDULE', 'OPTIMIZE']
      },
      {
        id: 'control',
        name: 'Control Systems',
        status: 'active',
        type: 'control',
        connections: 34,
        lastUpdate: new Date(),
        logs: ['System monitoring', 'Performance optimization'],
        commands: ['MONITOR', 'CONTROL', 'ADJUST']
      },
      {
        id: 'task',
        name: 'Task Execution',
        status: 'active',
        type: 'task',
        connections: 67,
        lastUpdate: new Date(),
        logs: ['Task queue processing', 'Workflow execution'],
        commands: ['EXECUTE', 'QUEUE', 'COMPLETE']
      },
      {
        id: 'admin',
        name: 'Admin & Security',
        status: 'active',
        type: 'admin',
        connections: 12,
        lastUpdate: new Date(),
        logs: ['Security scan complete', 'Access control updated'],
        commands: ['SECURE', 'AUDIT', 'MANAGE']
      }
    ]
    setAgiLayers(initialLayers)
    
    // Initialize default AGI Layer overview in cells
    initializeAGIOverview(initialLayers)
  }, [])

  const initializeAGIOverview = (layers: AGILayer[]) => {
    const newCells = new Map<string, Cell>()
    
    // Headers
    const headers = ['Layer Name', 'Status', 'Type', 'Connections', 'Last Update', 'Commands', 'AGI Binding']
    headers.forEach((header, colIndex) => {
      const cellId = `${0}-${colIndex}`
      newCells.set(cellId, {
        id: cellId,
        row: 0,
        col: colIndex,
        value: header,
        type: 'text',
        status: 'active'
      })
    })

    // AGI Layer data
    layers.forEach((layer, rowIndex) => {
      const actualRow = rowIndex + 1
      
      // Layer Name
      newCells.set(`${actualRow}-0`, {
        id: `${actualRow}-0`,
        row: actualRow,
        col: 0,
        value: layer.name,
        type: 'text',
        agiBinding: layer.id,
        status: layer.status === 'inactive' ? 'idle' : layer.status
      })
      
      // Status
      newCells.set(`${actualRow}-1`, {
        id: `${actualRow}-1`,
        row: actualRow,
        col: 1,
        value: layer.status.toUpperCase(),
        type: 'agi-status',
        agiBinding: layer.id,
        status: layer.status === 'inactive' ? 'idle' : layer.status
      })
      
      // Type
      newCells.set(`${actualRow}-2`, {
        id: `${actualRow}-2`,
        row: actualRow,
        col: 2,
        value: layer.type,
        type: 'text',
        agiBinding: layer.id
      })
      
      // Connections
      newCells.set(`${actualRow}-3`, {
        id: `${actualRow}-3`,
        row: actualRow,
        col: 3,
        value: layer.connections.toString(),
        type: 'number',
        agiBinding: layer.id
      })
      
      // Last Update
      newCells.set(`${actualRow}-4`, {
        id: `${actualRow}-4`,
        row: actualRow,
        col: 4,
        value: layer.lastUpdate.toLocaleTimeString(),
        type: 'text',
        agiBinding: layer.id
      })
      
      // Commands
      newCells.set(`${actualRow}-5`, {
        id: `${actualRow}-5`,
        row: actualRow,
        col: 5,
        value: layer.commands.join(', '),
        type: 'agi-command',
        agiBinding: layer.id
      })
      
      // AGI Binding
      newCells.set(`${actualRow}-6`, {
        id: `${actualRow}-6`,
        row: actualRow,
        col: 6,
        value: `AGI.${layer.id}`,
        type: 'agi-command',
        agiBinding: layer.id,
        status: 'active'
      })
    })

    setCells(newCells)
  }

  const getCellId = (row: number, col: number): string => `${row}-${col}`

  const getColumnLetter = (col: number): string => {
    let result = ''
    while (col >= 0) {
      result = String.fromCharCode(65 + (col % 26)) + result
      col = Math.floor(col / 26) - 1
    }
    return result
  }

  const getCellValue = (row: number, col: number): string => {
    const cell = cells.get(getCellId(row, col))
    return cell?.value ?? ''
  }

  const setCellValue = (row: number, col: number, value: string, type?: Cell['type']) => {
    const cellId = getCellId(row, col)
    const existingCell = cells.get(cellId)
    
    const newCell: Cell = {
      id: cellId,
      row,
      col,
      value,
      type: type ?? existingCell?.type ?? 'text',
      agiBinding: existingCell?.agiBinding,
      status: existingCell?.status ?? 'idle'
    }

    // AGI Processing for special cell types
    if (newCell.type === 'agi-command' && value.startsWith('AGI.')) {
      newCell.status = 'processing'
      processAGICommand(newCell, value)
    }

    setCells(prev => new Map(prev.set(cellId, newCell)))
  }

  const processAGICommand = (cell: Cell, command: string) => {
    // Simulate AGI command processing
    setTimeout(() => {
      const [, layerId, action] = command.split('.')
      const layer = agiLayers.find(l => l.id === layerId)
      
      if (layer && action) {
        // Update layer status based on command
        setAgiLayers(prev => prev.map(l => 
          l.id === layerId 
            ? { ...l, lastUpdate: new Date(), logs: [...l.logs, `Command executed: ${action}`] }
            : l
        ))
        
        // Update cell status
        setCells(prev => {
          const newCells = new Map(prev)
          const updatedCell = { ...cell, status: 'active' as const }
          newCells.set(cell.id, updatedCell)
          return newCells
        })
      }
    }, 1000)
  }

  const handleCellClick = (row: number, col: number) => {
    const cellId = getCellId(row, col)
    setSelectedCell(cellId)
    const cell = cells.get(cellId)
    setFormulaBar(cell?.formula ?? cell?.value ?? '')
  }

  const handleCellDoubleClick = (row: number, col: number) => {
    const cellId = getCellId(row, col)
    const cell = cells.get(cellId)
    
    if (cell?.type === 'agi-command' ?? cell?.agiBinding) {
      // Open AGI command interface
      console.log('Opening AGI interface for:', cell.agiBinding)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return '#22c55e'
      case 'processing': return '#f59e0b'
      case 'error': return '#ef4444'
      case 'warning': return '#f97316'
      default: return '#64748b'
    }
  }

  const getCellStyle = (row: number, col: number): React.CSSProperties => {
    const cell = cells.get(getCellId(row, col))
    const isSelected = selectedCell === getCellId(row, col)
    const isHeader = row === 0
    
    let backgroundColor = '#1e293b'
    if (isHeader) {backgroundColor = '#0f172a'}
    if (isSelected) {backgroundColor = 'rgba(212, 175, 55, 0.2)'}
    if (cell?.agiBinding) {backgroundColor = 'rgba(34, 197, 94, 0.1)'}
    
    return {
      width: '150px',
      height: '32px',
      border: '1px solid rgba(100, 116, 139, 0.3)',
      backgroundColor,
      color: isHeader ? '#d4af37' : '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      fontSize: '12px',
      fontWeight: isHeader ? 600 : 400,
      cursor: 'pointer',
      position: 'relative' as const,
      borderLeft: cell?.agiBinding ? `3px solid ${getStatusColor(cell.status)}` : undefined
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0f172a',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, monospace'
    }}>
      {/* AGISheet Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        padding: '12px 16px',
        borderBottom: '2px solid #d4af37',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ 
            color: '#d4af37', 
            fontSize: '18px', 
            margin: 0,
            fontWeight: 700
          }}>
            📋 AGISheet - Kameleoni i Inteligjencës Operacionale
          </h2>
          <p style={{ 
            color: '#cbd5e1', 
            fontSize: '12px', 
            margin: '4px 0 0 0' 
          }}>
            Excel me tru AGI • Mode: {currentMode} • {isAGIActive ? '🧠 AGI ACTIVE' : '⏸️ AGI STANDBY'}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={currentMode}
            onChange={(e) => setCurrentMode(e.target.value as any)}
            style={{
              background: '#334155',
              border: '1px solid #d4af37',
              color: '#f8fafc',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value="analysis">Analysis</option>
            <option value="decision">Decision</option>
            <option value="planning">Planning</option>
            <option value="control">Control</option>
            <option value="task">Task</option>
            <option value="admin">Admin</option>
          </select>
          
          <button
            onClick={() => setIsAGIActive(!isAGIActive)}
            style={{
              background: isAGIActive ? '#22c55e' : '#64748b',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {isAGIActive ? '🧠 AGI ON' : '⏸️ AGI OFF'}
          </button>
        </div>
      </div>

      {/* Formula Bar */}
      <div style={{
        background: '#1e293b',
        padding: '8px 16px',
        borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ color: '#d4af37', fontSize: '12px', fontWeight: 600 }}>
          {selectedCell ?? 'A1'}
        </span>
        <input
          type="text"
          value={formulaBar}
          onChange={(e) => setFormulaBar(e.target.value)}
          placeholder="Enter formula, AGI command, or value..."
          style={{
            flex: 1,
            background: '#334155',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            color: '#f8fafc',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        />
      </div>

      {/* AGISheet Grid */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#0f172a'
        }}
      >
        <div style={{
          display: 'inline-block',
          minWidth: '100%'
        }}>
          {/* Column Headers */}
          <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 10 }}>
            <div style={{
              ...getCellStyle(-1, -1),
              backgroundColor: '#0a0f1a',
              color: '#64748b',
              fontWeight: 700
            }}>
              📋
            </div>
            {Array.from({ length: width }, (_, colIndex) => (
              <div
                key={`col-${colIndex}`}
                style={{
                  ...getCellStyle(-1, colIndex),
                  backgroundColor: '#0a0f1a',
                  color: '#d4af37',
                  fontWeight: 700,
                  justifyContent: 'center'
                }}
              >
                {getColumnLetter(colIndex)}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: height }, (_, rowIndex) => (
            <div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
              {/* Row Header */}
              <div style={{
                ...getCellStyle(rowIndex, -1),
                backgroundColor: '#0a0f1a',
                color: '#d4af37',
                fontWeight: 600,
                justifyContent: 'center'
              }}>
                {rowIndex + 1}
              </div>

              {/* Cells */}
              {Array.from({ length: width }, (_, colIndex) => (
                <div
                  key={getCellId(rowIndex, colIndex)}
                  style={getCellStyle(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                >
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%'
                  }}>
                    {getCellValue(rowIndex, colIndex)}
                  </span>
                  
                  {/* AGI Status Indicator */}
                  {cells.get(getCellId(rowIndex, colIndex))?.agiBinding && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(cells.get(getCellId(rowIndex, colIndex))?.status)
                    }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* AGI Status Bar */}
      <div style={{
        background: '#1e293b',
        padding: '8px 16px',
        borderTop: '1px solid rgba(100, 116, 139, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px'
      }}>
        <span style={{ color: '#22c55e' }}>
          ✅ AGI Layers: {agiLayers.filter(l => l.status === 'active').length}/{agiLayers.length} Active
        </span>
        <span style={{ color: '#cbd5e1' }}>
          📊 Cells: {cells.size} | 🧠 AGI Bindings: {Array.from(cells.values()).filter(c => c.agiBinding).length}
        </span>
        <span style={{ color: '#d4af37' }}>
          ⚡ EuroWeb AGISheet v1.0 | Web8 Kameleon Mode
        </span>
      </div>
    </div>
  )
}

// Removed default export: AGISheet

