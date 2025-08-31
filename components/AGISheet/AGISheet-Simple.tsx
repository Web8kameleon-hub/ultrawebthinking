/**
 * WEB8 EuroWeb - AGI Sheet Component (SIMPLIFIED WORKING VERSION)
 * Real-time Analysis and Neural Processing Grid
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 8.0.0 Ultra - SIMPLIFIED
 */

'use client'

import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

interface AGISheetProps {
  mode?: 'analysis' | 'live' | 'simulation'
  width?: number
  height?: number
}

interface Cell {
  value: string
  type: 'text' | 'number' | 'formula'
  status: 'normal' | 'processing' | 'error' | 'complete'
  agiBinding?: boolean
}

const AGISheet: React.FC<AGISheetProps> = ({ 
  mode = 'analysis', 
  width = 20, 
  height = 50 
}) => {
  const [cells, setCells] = useState<Map<string, Cell>>(new Map())
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [formulaBar, setFormulaBar] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate column letters (A, B, C, ...)
  const getColumnLetter = (index: number): string => {
    let result = '';
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'complete': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellKey = `${getColumnLetter(colIndex)}${rowIndex + 1}`;
    setSelectedCell(cellKey);
    const cell = cells.get(cellKey);
    setFormulaBar(cell?.value || '');
  };

  // Update cell value
  const updateCell = (key: string, value: string) => {
    const newCells = new Map(cells);
    newCells.set(key, {
      value,
      type: value.startsWith('=') ? 'formula' : isNaN(Number(value)) ? 'text' : 'number',
      status: 'normal',
      agiBinding: Math.random() > 0.8 // Some cells have AGI binding
    });
    setCells(newCells);
  };

  // Get cell styles
  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const cellKey = `${getColumnLetter(colIndex)}${rowIndex + 1}`;
    const cell = cells.get(cellKey);
    
    return {
      backgroundColor: cell?.agiBinding ? getStatusColor(cell.status) + '20' : '#0f1419',
      color: cell?.agiBinding ? '#d4af37' : '#f8fafc',
      border: selectedCell === cellKey ? '2px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.2)',
      borderLeft: cell?.agiBinding ? `3px solid ${getStatusColor(cell.status)}` : undefined,
      minWidth: '80px',
      height: '32px',
      padding: '0 8px',
      fontSize: '12px',
      fontWeight: 400,
      cursor: 'pointer',
      position: 'relative' as const
    };
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'rgba(15, 20, 25, 0.95)',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        background: 'rgba(26, 29, 41, 0.9)'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 600,
          color: '#d4af37',
          marginBottom: '8px'
        }}>
          📋 AGISheet - Neural Processing Grid
        </h2>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#94a3b8'
        }}>
          Real-time analysis spreadsheet with AGI integration
        </p>
      </div>

      {/* Formula Bar */}
      <div style={{
        background: 'rgba(26, 29, 41, 0.9)',
        padding: '8px 16px',
        borderBottom: '1px solid rgba(100, 116, 139, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ 
          minWidth: '60px', 
          fontSize: '12px', 
          fontWeight: 600,
          color: '#d4af37'
        }}>
          {selectedCell || 'A1'}
        </span>
        <input
          type="text"
          value={formulaBar}
          onChange={(e) => setFormulaBar(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && selectedCell) {
              updateCell(selectedCell, formulaBar);
            }
          }}
          style={{
            flex: 1,
            background: 'rgba(45, 52, 70, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '4px',
            padding: '8px',
            color: '#f8fafc',
            fontSize: '12px',
            outline: 'none'
          }}
          placeholder="Enter formula or value..."
        />
      </div>

      {/* Spreadsheet Grid */}
      <div 
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#0f1419',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Column Headers */}
        <div style={{
          display: 'flex',
          position: 'sticky',
          top: 0,
          background: 'rgba(26, 29, 41, 0.95)',
          zIndex: 2,
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <div style={{
            minWidth: '60px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(26, 29, 41, 0.95)',
            borderRight: '1px solid rgba(212, 175, 55, 0.3)',
            fontSize: '12px',
            fontWeight: 600
          }}>
            #
          </div>
          {Array.from({ length: width }, (_, colIndex) => (
            <div
              key={colIndex}
              style={{
                minWidth: '80px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid rgba(212, 175, 55, 0.3)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#d4af37'
              }}
            >
              {getColumnLetter(colIndex)}
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: height }, (_, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {/* Row Header */}
            <div style={{
              minWidth: '60px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(26, 29, 41, 0.95)',
              borderRight: '1px solid rgba(212, 175, 55, 0.3)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              fontSize: '12px',
              fontWeight: 600,
              color: '#d4af37'
            }}>
              {rowIndex + 1}
            </div>

            {/* Cells */}
            {Array.from({ length: width }, (_, colIndex) => {
              const cellKey = `${getColumnLetter(colIndex)}${rowIndex + 1}`;
              const cell = cells.get(cellKey);
              
              return (
                <motion.div
                  key={cellKey}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    ...getCellStyle(rowIndex, colIndex),
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRight: '1px solid rgba(212, 175, 55, 0.2)'
                  }}
                >
                  {cell?.value || ''}
                  {cell?.agiBinding && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: getStatusColor(cell.status)
                    }} />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AGISheet;
