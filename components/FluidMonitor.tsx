/**
 * FLUID FLOW MONITOR - Natural Water-like Interface
 * Web8 real-time monitoring of fluid architecture with beautiful animations
 * 
 * @version 8.0.0-WEB8-FLUID
 * @author Ledjan Ahmati
 */

'use client';

import * as React from 'react';

interface FlowMetrics {
  timestamp: number;
  globalFlow: {
    turbulence: number;
    clarity: number;
    velocity: number;
    pressure: number;
    temperature: string;
  };
  streams: Array<{
    name: string;
    type: string;
    velocity: number;
    clarity: number;
    obstacles: number;
    state: string;
    health: number;
  }>;
  recommendations: string[];
  waterQuality: string;
}

export const FluidMonitor: React.FC = () => {
  const [metrics, setMetrics] = React.useState<FlowMetrics | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  // Fetch flow metrics
  const fetchMetrics = async () => {
    try {
      // Simulate API call with mock data
      const mockData: FlowMetrics = {
        timestamp: Date.now(),
        globalFlow: {
          turbulence: Math.random() * 100,
          clarity: 85 + Math.random() * 15,
          velocity: 70 + Math.random() * 30,
          pressure: 80 + Math.random() * 20,
          temperature: '22°C'
        },
        streams: [
          {
            name: 'Main Flow',
            type: 'primary',
            velocity: 85 + Math.random() * 15,
            clarity: 90 + Math.random() * 10,
            obstacles: Math.floor(Math.random() * 3),
            state: 'optimal',
            health: 95 + Math.random() * 5
          },
          {
            name: 'Data Stream',
            type: 'secondary',
            velocity: 75 + Math.random() * 20,
            clarity: 88 + Math.random() * 12,
            obstacles: Math.floor(Math.random() * 2),
            state: 'good',
            health: 88 + Math.random() * 12
          }
        ],
        recommendations: ['Maintain current flow', 'Monitor pressure levels'],
        waterQuality: 'Crystal Clear'
      };
      
      setMetrics(mockData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching flow metrics:', error);
      setIsLoading(false);
    }
  };

  // Auto-refresh metrics
  React.useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 2000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh]);

  // Animate water flow on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !metrics) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationTime = 0;

    const animate = () => {
      animationTime += 0.02;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw water flow animation
      drawWaterFlow(ctx, canvas.width, canvas.height, animationTime, metrics);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [metrics]);

  // Control flow functions
  const boostVelocity = async (streamName: string) => {
    try {
      const response = await fetch('/api/fluid/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'boost_velocity',
          stream: streamName,
          value: 10
        })
      });
      
      if (response.ok) {
        fetchMetrics(); // Refresh
      }
    } catch (error) {
      console.error('Error boosting velocity:', error);
    }
  };

  const removeObstacle = async (streamName: string, obstacle: string) => {
    try {
      const response = await fetch('/api/fluid/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove_obstacle',
          stream: streamName,
          obstacle: obstacle
        })
      });
      
      if (response.ok) {
        fetchMetrics(); // Refresh
      }
    } catch (error) {
      console.error('Error removing obstacle:', error);
    }
  };

  const resetFlow = async () => {
    try {
      const response = await fetch('/api/fluid/flow', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchMetrics(); // Refresh
      }
    } catch (error) {
      console.error('Error resetting flow:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        borderRadius: '15px',
        padding: '40px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #42a5f5',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#1565c0', fontSize: '1.2rem' }}>
          Analyzing water flow patterns...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
        borderRadius: '15px',
        padding: '40px'
      }}>
        <p style={{ color: '#d32f2f', fontSize: '1.2rem', marginBottom: '20px' }}>
          Unable to connect to fluid flow system
        </p>
        <button 
          onClick={fetchMetrics}
          style={{
            padding: '12px 24px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '12px'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '2.5rem',
          background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700'
        }}>
          🌊 Fluid Architecture Monitor
        </h1>
        <div>
          <span style={{ color: '#666', marginRight: '10px' }}>Water Quality:</span>
          <span style={{
            padding: '6px 12px',
            background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
            color: 'white',
            borderRadius: '20px',
            fontWeight: '600'
          }}>
            {metrics.waterQuality}
          </span>
        </div>
      </div>

      {/* Global Flow Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>💧 Velocity</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#42a5f5' }}>
            {metrics.globalFlow.velocity.toFixed(1)}%
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>⚡ Pressure</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#66bb6a' }}>
            {metrics.globalFlow.pressure.toFixed(1)}%
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>🛡️ Clarity</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffb74d' }}>
            {metrics.globalFlow.clarity.toFixed(1)}%
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>🌡️ Temperature</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ba68c8' }}>
            {metrics.globalFlow.temperature}
          </div>
        </div>
      </div>

      {/* Stream Status */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1565c0' }}>Stream Status</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {metrics.streams.map((stream, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              background: '#f5f5f5',
              borderRadius: '8px',
              borderLeft: `4px solid ${stream.state === 'optimal' ? '#4caf50' : '#ff9800'}`
            }}>
              <div>
                <strong>{stream.name}</strong> ({stream.type})
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Velocity: {stream.velocity.toFixed(1)}% | Clarity: {stream.clarity.toFixed(1)}%
                </div>
              </div>
              <div style={{
                padding: '4px 12px',
                background: stream.state === 'optimal' ? '#4caf50' : '#ff9800',
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.8rem'
              }}>
                {stream.state.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas Animation */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#1565c0' }}>Live Flow Visualization</h2>
        <canvas 
          ref={canvasRef}
          width={800}
          height={200}
          style={{
            width: '100%',
            height: '200px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #e3f2fd, #bbdefb)'
          }}
        />
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          style={{
            padding: '10px 20px',
            background: autoRefresh ? '#4caf50' : '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {autoRefresh ? '⏸️ Pause' : '▶️ Resume'} Auto-Refresh
        </button>
        
        <button
          onClick={fetchMetrics}
          style={{
            padding: '10px 20px',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Now
        </button>
      </div>
    </div>
  );
};

function drawWaterFlow(ctx: CanvasRenderingContext2D, width: number, height: number, animationTime: number, metrics: FlowMetrics) {
  // Set up the gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#e3f2fd');
  gradient.addColorStop(0.5, '#bbdefb');
  gradient.addColorStop(1, '#90caf9');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Draw multiple water streams
  const numStreams = metrics.streams.length;
  const streamHeight = height / numStreams;
  
  metrics.streams.forEach((stream, index) => {
    const y = index * streamHeight;
    const streamVelocity = stream.velocity / 100;
    const streamClarity = stream.clarity / 100;
    
    // Draw water particles
    for (let i = 0; i < 20; i++) {
      const particleX = (animationTime * 50 * streamVelocity + i * 40) % width;
      const particleY = y + streamHeight/2 + Math.sin(animationTime * 2 + i) * 10;
      
      // Particle size based on clarity
      const particleSize = 2 + streamClarity * 3;
      
      ctx.globalAlpha = streamClarity * 0.8;
      ctx.fillStyle = stream.state === 'optimal' ? '#42a5f5' : '#ff9800';
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw stream name
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#1565c0';
    ctx.font = '14px Arial';
    ctx.fillText(stream.name, 10, y + 20);
    
    // Draw velocity indicator
    ctx.fillStyle = stream.state === 'optimal' ? '#4caf50' : '#ff9800';
    ctx.fillRect(10, y + streamHeight - 10, width * streamVelocity, 3);
  });
  
  // Draw overall flow indicators
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#1565c0';
  ctx.font = '16px Arial';
  ctx.fillText(`Global Velocity: ${metrics.globalFlow.velocity.toFixed(1)}%`, width - 200, 25);
  ctx.fillText(`Pressure: ${metrics.globalFlow.pressure.toFixed(1)}%`, width - 200, 45);
  ctx.fillText(`Temperature: ${metrics.globalFlow.temperature}`, width - 200, 65);
}
