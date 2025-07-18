// AGI-powered component me CSS të thjeshtë - INDUSTRIAL VERSION
import React from 'react';
import { agiCore } from '../lib/AGICore';

interface AGIPanelProps {
  className?: string;
  children?: React.ReactNode;
}

// Inline styles - NO STYLED-SYSTEM
const agiStyles = {
  panel: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e74c3c',
    boxShadow: '0 4px 20px rgba(231, 76, 60, 0.3)',
    color: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'all 0.3s ease',
  },
  panelActive: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(231, 76, 60, 0.5)',
  },
  stackColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    alignItems: 'center',
  },
  statusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  statusActive: {
    background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
    animation: 'glow 1.5s ease-in-out infinite',
  },
  statusInactive: {
    background: '#95a5a6',
  },
  statusText: {
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center' as const,
  },
  metricValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e74c3c',
  },
};

export const AGIPanel: React.FC<AGIPanelProps> = ({ className, children }) => {
  const memory = agiCore.getMemory();
  const isAGIActive = memory.agi.responses.length > 0;
  
  return (
    <div
      style={{
        ...agiStyles.panel,
        ...(isAGIActive ? agiStyles.panelActive : {}),
        ...(className ? {} : {})
      }}
    >
      <div style={agiStyles.stackColumn}>
        {/* AGI Status Indicator */}
        <div 
          style={{
            ...agiStyles.statusIndicator,
            ...(isAGIActive ? agiStyles.statusActive : agiStyles.statusInactive)
          }}
        />
        
        {/* AGI Status Text */}
        <div style={agiStyles.statusText}>
          AGI Status: {isAGIActive ? 'ACTIVE' : 'STANDBY'}
        </div>
        
        {/* Performance Metrics */}
        <div style={agiStyles.metricValue}>
          Performance: {agiCore.getStatus().performance}%
        </div>
        
        {children}
      </div>
    </div>
  );
};

export const AGIMetricsDisplay: React.FC = () => {
  const status = agiCore.getStatus();
  
  return (
    <div style={agiStyles.panel}>
      <div style={agiStyles.stackColumn}>
        <div style={agiStyles.metricValue}>Memory: {status.memory}MB</div>
        <div style={agiStyles.metricValue}>Connections: {status.connections}</div>
        <div style={agiStyles.metricValue}>Uptime: {status.uptime}s</div>
      </div>
    </div>
  );
};

// Global CSS injection for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(231, 76, 60, 0.8);
        opacity: 1;
      }
      50% { 
        box-shadow: 0 0 30px rgba(231, 76, 60, 1);
        opacity: 0.8;
      }
    }
  `;
  document.head.appendChild(style);
}

export default AGIPanel;
