import React, { useState } from 'react';
import AGITunnel from '../components/AGITunnel';
import { css } from 'styled-system/css';
import { PageTransition } from '../components/MotionComponents';

const AGITunnelDemo: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'agi'>('agi');
  const [showDataFlow, setShowDataFlow] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [flowHistory, setFlowHistory] = useState<any[]>([]);

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    console.log('Node clicked:', node);
  };

  const handleFlowComplete = (flow: any) => {
    setFlowHistory(prev => [flow, ...prev.slice(0, 9)]); // Keep last 10 flows
    console.log('Flow completed:', flow);
  };

  return (
    <PageTransition>
      <div className={css({
        minH: '100vh',
        bg: theme === 'dark' ? 'gray.900' : theme === 'light' ? 'gray.50' : 'black',
        color: theme === 'dark' ? 'gray.100' : theme === 'light' ? 'gray.900' : 'white',
        p: '8'
      })}>
        {/* Header */}
        <header className={css({ textAlign: 'center', mb: '8' })}>
          <h1 className={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '4',
            background: theme === 'agi' 
              ? 'linear-gradient(45deg, #00f5ff, #ff6b6b)' 
              : 'linear-gradient(45deg, #6366f1, #10b981)',
            backgroundClip: 'text',
            color: 'transparent'
          })}>
            🚇 AGI Tunnel Visualization
          </h1>
          
          <p className={css({ fontSize: 'lg', mb: '6', maxW: '2xl', mx: 'auto', opacity: 0.8 })}>
            Interactive visualization of AGI processing flow through neural pathways
          </p>
          
          {/* Controls */}
          <div className={css({ 
            display: 'flex', 
            gap: '4', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            mb: '6'
          })}>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className={css({
                px: '4',
                py: '2',
                borderRadius: 'md',
                border: '2px solid',
                borderColor: 'primary.500',
                bg: 'transparent',
                color: 'inherit',
                cursor: 'pointer'
              })}
            >
              <option value="agi">🤖 AGI Theme</option>
              <option value="dark">🌙 Dark Theme</option>
              <option value="light">☀️ Light Theme</option>
            </select>
            
            <label className={css({ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2',
              cursor: 'pointer'
            })}>
              <input
                type="checkbox"
                checked={showDataFlow}
                onChange={(e) => setShowDataFlow(e.target.checked)}
                className={css({ accentColor: 'primary.500' })}
              />
              Show Data Flow
            </label>
          </div>
        </header>

        {/* Main AGI Tunnel */}
        <div className={css({ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: '8'
        })}>
          <AGITunnel
            width={1000}
            height={600}
            theme={theme}
            showDataFlow={showDataFlow}
            interactive={true}
            onNodeClick={handleNodeClick}
            onFlowComplete={handleFlowComplete}
          />
        </div>

        {/* Information Panels */}
        <div className={css({
          maxW: '6xl',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(2, 1fr)' },
          gap: '6'
        })}>
          {/* Selected Node Info */}
          <div className={css({
            p: '6',
            bg: theme === 'dark' ? 'gray.800' : theme === 'light' ? 'white' : 'rgba(0, 0, 0, 0.8)',
            borderRadius: 'xl',
            border: '2px solid',
            borderColor: 'primary.500'
          })}>
            <h3 className={css({ fontSize: 'xl', fontWeight: 'bold', mb: '4' })}>
              🎯 Selected Node
            </h3>
            
            {selectedNode ? (
              <div className={css({ '& > div': { mb: '3' } })}>
                <div>
                  <strong>ID:</strong> {selectedNode.id}
                </div>
                <div>
                  <strong>Type:</strong> {selectedNode.type}
                </div>
                <div>
                  <strong>Label:</strong> {selectedNode.label}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={css({
                    ml: '2',
                    px: '2',
                    py: '1',
                    borderRadius: 'sm',
                    fontSize: 'sm',
                    bg: selectedNode.status === 'completed' ? 'green.500' : 
                        selectedNode.status === 'processing' ? 'yellow.500' : 
                        selectedNode.status === 'error' ? 'red.500' : 'gray.500',
                    color: 'white'
                  })}>
                    {selectedNode.status}
                  </span>
                </div>
                <div>
                  <strong>Connections:</strong> {selectedNode.connections.join(', ')}
                </div>
                <div>
                  <strong>Position:</strong> ({selectedNode.position.x}, {selectedNode.position.y})
                </div>
              </div>
            ) : (
              <p className={css({ color: 'gray.500', fontStyle: 'italic' })}>
                Click on a node to see its details
              </p>
            )}
          </div>

          {/* Flow History */}
          <div className={css({
            p: '6',
            bg: theme === 'dark' ? 'gray.800' : theme === 'light' ? 'white' : 'rgba(0, 0, 0, 0.8)',
            borderRadius: 'xl',
            border: '2px solid',
            borderColor: 'secondary.500'
          })}>
            <h3 className={css({ fontSize: 'xl', fontWeight: 'bold', mb: '4' })}>
              📊 Flow History
            </h3>
            
            <div className={css({ maxH: '20rem', overflowY: 'auto', '& > div': { mb: '2' } })}>
              {flowHistory.length > 0 ? (
                flowHistory.map((flow, index) => (
                  <div
                    key={flow.id}
                    className={css({
                      p: '3',
                      bg: theme === 'dark' ? 'gray.700' : theme === 'light' ? 'gray.100' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 'md',
                      fontSize: 'sm',
                      opacity: 1 - (index * 0.1)
                    })}
                  >
                    <div className={css({ fontWeight: 'semibold' })}>
                      {flow.fromNode} → {flow.toNode}
                    </div>
                    <div className={css({ fontSize: 'xs', color: 'gray.500' })}>
                      {new Date(flow.data.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className={css({ color: 'gray.500', fontStyle: 'italic' })}>
                  Start AGI processing to see flow data
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={css({
          maxW: '4xl',
          mx: 'auto',
          mt: '8',
          p: '6',
          bg: theme === 'dark' ? 'gray.800' : theme === 'light' ? 'white' : 'rgba(0, 0, 0, 0.8)',
          borderRadius: 'xl',
          textAlign: 'center'
        })}>
          <h3 className={css({ fontSize: 'xl', fontWeight: 'bold', mb: '4' })}>
            🎮 How to Use
          </h3>
          
          <div className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
            gap: '4',
            textAlign: 'left'
          })}>
            <div>
              <div className={css({ fontSize: 'lg', mb: '2' })}>🚀</div>
              <strong>Start Processing:</strong> Click the "Start AGI Flow" button to begin the neural processing simulation
            </div>
            <div>
              <div className={css({ fontSize: 'lg', mb: '2' })}>🖱️</div>
              <strong>Interact:</strong> Click on any node to see detailed information about that processing unit
            </div>
            <div>
              <div className={css({ fontSize: 'lg', mb: '2' })}>⚙️</div>
              <strong>Customize:</strong> Change themes and toggle data flow visualization using the controls
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={css({
          textAlign: 'center',
          mt: '12',
          p: '6',
          borderTop: '1px solid',
          borderColor: theme === 'dark' ? 'gray.700' : theme === 'light' ? 'gray.200' : 'gray.600'
        })}>
          <p className={css({ color: 'gray.500' })}>
            AGI Tunnel - Real-time visualization of artificial general intelligence processing flow
          </p>
        </footer>
      </div>
    </PageTransition>
  );
};

export default AGITunnelDemo;
