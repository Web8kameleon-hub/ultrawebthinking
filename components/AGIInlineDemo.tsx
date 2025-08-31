/**
 * AGIInlineDemo.tsx
 * Demo komponent që tregon inline CSS me AGI funksionalitet
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import React, { useEffect, useState } from 'react';
import { InlineStyleEngine } from '../themes/InlineStyleEngine';
import useInlineStyles from '../themes/useInlineStyles';

interface AGIStatus {
  core: boolean;
  planner: boolean;
  semantic: boolean;
  executor: boolean;
  monitor: boolean;
}

const AGIInlineDemo: React.FC = () => {
  const { getStyle, combineStyles, addHoverEffect } = useInlineStyles();
  const [agiStatus, setAgiStatus] = useState<AGIStatus>({
    core: false,
    planner: false,
    semantic: false,
    executor: false,
    monitor: false
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulojmë inicializimin e AGI moduleve
    const initializeAGI = async () => {
      const modules = ['core', 'planner', 'semantic', 'executor', 'monitor'];
      
      for (let i = 0; i < modules.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const module = modules[i] as keyof AGIStatus;
        setAgiStatus(prev => ({ ...prev, [module]: true }));
      }
      
      setIsLoading(false);
    };

    initializeAGI();
  }, []);

  // Inline Styles
  const containerStyle: React.CSSProperties = {
    ...InlineStyleEngine.layout.container,
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    ...InlineStyleEngine.typography.h1,
    textAlign: 'center',
    color: InlineStyleEngine.colors.primary,
    marginBottom: '40px'
  };

  const gridStyle: React.CSSProperties = {
    ...InlineStyleEngine.layout.grid.responsive,
    marginBottom: '40px'
  };

  const moduleCardStyle: React.CSSProperties = {
    ...InlineStyleEngine.card.elevated,
    textAlign: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const moduleCardHoverStyle: React.CSSProperties = {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  };

  const statusIndicatorStyle = (isActive: boolean): React.CSSProperties => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: isActive ? InlineStyleEngine.colors.success : InlineStyleEngine.colors.gray[300],
    margin: '0 auto 16px auto',
    transition: 'background-color 0.3s ease'
  });

  const moduleNameStyle: React.CSSProperties = {
    ...InlineStyleEngine.typography.h3,
    marginBottom: '8px'
  };

  const statusTextStyle: React.CSSProperties = {
    ...InlineStyleEngine.typography.small,
    color: InlineStyleEngine.colors.gray[600],
    fontWeight: '500'
  };

  const controlPanelStyle: React.CSSProperties = {
    ...InlineStyleEngine.card.base,
    ...InlineStyleEngine.layout.flex.center,
    gap: '20px',
    padding: '30px'
  };

  const primaryButtonHover = addHoverEffect(
    getStyle('button.primary.base'),
    getStyle('button.primary.hover')
  );

  const secondaryButtonHover = addHoverEffect(
    getStyle('button.secondary.base'),
    getStyle('button.secondary.hover')
  );

  const loadingStyle: React.CSSProperties = {
    ...InlineStyleEngine.layout.flex.center,
    height: '200px',
    ...InlineStyleEngine.typography.h2,
    color: InlineStyleEngine.colors.primary
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          🤖 Inicializimi i AGI sistemit...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>
        🧠 AGI Sistema - Inline CSS Demo
      </h1>

      <div style={gridStyle}>
        {Object.entries(agiStatus).map(([module, isActive]) => {
          const cardHover = addHoverEffect(moduleCardStyle, moduleCardHoverStyle);
          
          return (
            <div
              key={module}
              style={cardHover.style}
              onMouseEnter={cardHover.onMouseEnter}
              onMouseLeave={cardHover.onMouseLeave}
            >
              <div style={statusIndicatorStyle(isActive)} />
              <h3 style={moduleNameStyle}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </h3>
              <p style={statusTextStyle}>
                {isActive ? '✅ Aktiv' : '⏳ Duke ngarkuar...'}
              </p>
            </div>
          );
        })}
      </div>

      <div style={controlPanelStyle}>
        <button
          style={primaryButtonHover.style}
          onMouseEnter={primaryButtonHover.onMouseEnter}
          onMouseLeave={primaryButtonHover.onMouseLeave}
          onClick={() => console.log('AGI Test started')}
        >
          🚀 Fillo AGI Test
        </button>
        
        <button
          style={secondaryButtonHover.style}
          onMouseEnter={secondaryButtonHover.onMouseEnter}
          onMouseLeave={secondaryButtonHover.onMouseLeave}
          onClick={() => console.log('AGI Reset')}
        >
          🔄 Reset Sistema
        </button>
      </div>

      <div style={{
        ...InlineStyleEngine.card.base,
        marginTop: '30px',
        backgroundColor: InlineStyleEngine.colors.light
      }}>
        <h3 style={InlineStyleEngine.typography.h3}>
          📊 Statistika Sistemit
        </h3>
        <div style={{
          ...InlineStyleEngine.layout.flex.row,
          gap: '30px',
          marginTop: '20px'
        }}>
          <div>
            <strong>Modula Aktive:</strong> {Object.values(agiStatus).filter(Boolean).length}/5
          </div>
          <div>
            <strong>Status:</strong> {Object.values(agiStatus).every(Boolean) ? '🟢 Online' : '🟡 Initializing'}
          </div>
          <div>
            <strong>Arkitektura:</strong> Modular TypeScript
          </div>
        </div>
      </div>
    </div>
  );
};

export default AGIInlineDemo;
