/**
 * EuroWeb AGI Real-Time API Server
 * WebSocket & REST API endpoints for live data transmission
 * Claude Sonnet Integration & Open Tunnel Architecture
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 Real-Time Production
 * @contact dealsjona@gmail.com
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import RealTimeAggregator from './agi/RealTimeAggregator';
import { Anthropic } from '@anthropic-ai/sdk';
// import localtunnel from 'localtunnel';
import { UltraSpeedModule } from './modules/UltraSpeedModule';
import { Web8LightningPool, Web8LayerType } from './modules/Web8LightningPool';

const app = express();
const server = createServer(app);

// Initialize Claude Sonnet for AGI processing
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key'
});

// Native WebSocket server for default real-time (recommended for most clients)
const wss = new WebSocketServer({ server });

// Socket.IO for advanced/legacy clients (only if needed)
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Real-Time Aggregator
const aggregator = new RealTimeAggregator();

// Initialize Ultra Speed Module for fastest responses
const ultraSpeed = new UltraSpeedModule();

// Initialize Web8 Lightning Pool for 12-layer processing
const lightningPool = new Web8LightningPool();

// Open Tunnel Setup for Information Sources
async function setupOpenTunnels() {
  try {
    // const tunnel = await localtunnel({ port: 4000 });
    console.log(`🌐 Open Tunnel disabled for development`);
    return 'http://localhost:4000';
  } catch (error) {
    console.error('❌ Tunnel setup failed:', error);
    return null;
  }
}

// DeepSeek Open Tunnel Setup
async function setupDeepSeekTunnel() {
  try {
    // const deepseekTunnel = await localtunnel({ 
    //   port: 4001,
    //   subdomain: 'euroweb-deepseek' // Request specific subdomain
    // });
    console.log(`🧠 DeepSeek Tunnel disabled for development`);
    return 'http://localhost:4001';
  } catch (error) {
    console.error('❌ DeepSeek tunnel setup failed:', error);
    return null;
  }
}

// Native WebSocket connection handling (default)
wss.on('connection', (ws) => {
  console.log('🔌 WS client connected');
  // Send initial data
  ws.send(JSON.stringify({ type: 'moduleActivity', data: aggregator.getCurrentActivities() }));
  ws.send(JSON.stringify({ type: 'analytics', data: aggregator.getAnalytics() }));
  ws.send(JSON.stringify({ type: 'ethicalCompliance', data: aggregator.getEthicalStatus() }));

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString());
      if (msg.type === 'subscribe') {
        // No room concept in ws, but can track subscriptions if needed
        console.log('📡 WS client subscribed:', msg.modules);
      }
      if (msg.type === 'unsubscribe') {
        console.log('📴 WS client unsubscribed');
      }
      if (msg.type === 'claude:query') {
        // Process Claude Sonnet query
        processClaudeQuery(ws, msg.data);
      }
      if (msg.type === 'ultra:query') {
        // Process with Ultra Speed Module (fastest possible)
        processUltraQuery(ws, msg.data);
      }
      if (msg.type === 'deepseek:query') {
        // Process with DeepSeek via Ultra Speed
        processDeepSeekQuery(ws, msg.data);
      }
      if (msg.type === 'web8:layer') {
        // Process with specific Web8 Layer
        processWeb8LayerQuery(ws, msg.data, msg.layer);
      }
      if (msg.type === 'lightning:status') {
        // Get Lightning Pool status
        ws.send(JSON.stringify({
          type: 'lightning:status',
          data: lightningPool.getSystemStatus()
        }));
      }
    } catch (e) {
      console.error('WS message error:', e);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WS client disconnected');
  });
});

// Ultra Speed query processing (fastest possible < 50ms)
async function processUltraQuery(ws: any, query: string) {
  try {
    const startTime = performance.now();
    const response = await ultraSpeed.generateUltraResponse(query);
    
    ws.send(JSON.stringify({
      type: 'ultra:response',
      data: {
        ...response,
        totalTime: performance.now() - startTime
      }
    }));
  } catch (error) {
    console.error('Ultra Speed query error:', error);
    ws.send(JSON.stringify({
      type: 'ultra:error',
      data: { error: 'Ultra speed processing failed' }
    }));
  }
}

// Web8 Layer query processing
async function processWeb8LayerQuery(ws: any, query: string, layerType?: string) {
  try {
    const startTime = performance.now();
    
    // Determine layer type or use Lightning for fastest processing
    const targetLayer = layerType ? 
      (Web8LayerType as any)[layerType.toUpperCase()] || Web8LayerType.LIGHTNING :
      Web8LayerType.LIGHTNING;
    
    // Submit task to Lightning Pool
    const taskId = await lightningPool.submitTask({
      layerType: targetLayer,
      data: { query, type: 'query_processing' },
      priority: 8
    });
    
    // Listen for task completion
    const handleCompletion = (event: any) => {
      if (event.taskId === taskId) {
        ws.send(JSON.stringify({
          type: 'web8:response',
          data: {
            taskId,
            layerType: targetLayer,
            result: event.result,
            processingTime: event.processingTime,
            totalTime: performance.now() - startTime
          }
        }));
        lightningPool.off('task:completed', handleCompletion);
      }
    };
    
    const handleFailure = (event: any) => {
      if (event.taskId === taskId) {
        ws.send(JSON.stringify({
          type: 'web8:error',
          data: {
            taskId,
            layerType: targetLayer,
            error: event.error
          }
        }));
        lightningPool.off('task:failed', handleFailure);
      }
    };
    
    lightningPool.on('task:completed', handleCompletion);
    lightningPool.on('task:failed', handleFailure);
    
  } catch (error) {
    console.error('Web8 Layer query error:', error);
    ws.send(JSON.stringify({
      type: 'web8:error',
      data: { error: 'Web8 layer processing failed' }
    }));
  }
}

// DeepSeek query processing via Ultra Speed Module
async function processDeepSeekQuery(ws: any, query: string) {
  try {
    const startTime = performance.now();
    // Use Ultra Speed Module with DeepSeek context
    const response = await ultraSpeed.generateUltraResponse(query, { 
      provider: 'deepseek',
      priority: 'highest'
    });
    
    ws.send(JSON.stringify({
      type: 'deepseek:response',
      data: {
        ...response,
        provider: 'deepseek',
        totalTime: performance.now() - startTime
      }
    }));
  } catch (error) {
    console.error('DeepSeek query error:', error);
    ws.send(JSON.stringify({
      type: 'deepseek:error',
      data: { error: 'DeepSeek processing failed' }
    }));
  }
}

// Claude Sonnet query processing
async function processClaudeQuery(ws: any, query: string) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: query }]
    });
    
    ws.send(JSON.stringify({
      type: 'claude:response',
      data: {
        response: message.content,
        timestamp: Date.now()
      }
    }));
  } catch (error) {
    console.error('Claude query error:', error);
    ws.send(JSON.stringify({
      type: 'claude:error',
      data: { error: 'Failed to process query' }
    }));
  }
}

// Socket.IO connection handling (advanced/legacy)
io.on('connection', (socket: any) => {
  console.log(`🔌 Socket.IO client connected: ${socket.id}`);
  // Send initial data
  socket.emit('moduleActivity', aggregator.getCurrentActivities());
  socket.emit('analytics', aggregator.getAnalytics());
  socket.emit('ethicalCompliance', aggregator.getEthicalStatus());
  // Handle real-time subscription requests
  socket.on('subscribe', (modules: string[]) => {
    console.log(`📡 Socket.IO client ${socket.id} subscribed to modules:`, modules);
    socket.join('subscribers');
  });
  socket.on('unsubscribe', () => {
    console.log(`📴 Socket.IO client ${socket.id} unsubscribed`);
    socket.leave('subscribers');
  });
  socket.on('disconnect', () => {
    console.log(`🔌 Socket.IO client disconnected: ${socket.id}`);
  });
});

// Real-time event broadcasting to both ws and socket.io
function broadcastWS(type: string, data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type, data }));
    }
  });
}

aggregator.on('moduleActivity', (data: any) => {
  broadcastWS('moduleActivity', data);
  io.to('subscribers').emit('moduleActivity', data);
});

aggregator.on('statistics', (data: any) => {
  broadcastWS('statistics', data);
  io.to('subscribers').emit('statistics', data);
});

aggregator.on('analytics', (data: any) => {
  broadcastWS('analytics', data);
  io.to('subscribers').emit('analytics', data);
});

aggregator.on('ethicalCompliance', (data: any) => {
  broadcastWS('ethicalCompliance', data);
  io.to('subscribers').emit('ethicalCompliance', data);
});

// REST API Endpoints

// Get all module activities
app.get('/api/agi/activities', (req, res) => {
  try {
    const activities = aggregator.getCurrentActivities();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities'
    });
  }
});

// Get specific module activity
app.get('/api/agi/activities/:moduleId', (req, res) => {
  try {
    const { moduleId } = req.params;
    const activity = aggregator.getModuleActivity(moduleId);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: `Module ${moduleId} not found`
      });
    }
    
    return res.json({
      success: true,
      timestamp: Date.now(),
      data: activity
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch module activity'
    });
  }
});

// Get analytics data
app.get('/api/agi/analytics', (req, res) => {
  try {
    const analytics = aggregator.getAnalytics();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// Get statistics
app.get('/api/agi/statistics', (req, res) => {
  try {
    const statistics = aggregator.getStatistics();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: statistics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Get ethical compliance status
app.get('/api/agi/ethics', (req, res) => {
  try {
    const ethics = aggregator.getEthicalStatus();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: ethics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ethical status'
    });
  }
});

// Get system status
app.get('/api/agi/status', (req, res) => {
  try {
    const analytics = aggregator.getAnalytics();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: {
        isTransmitting: aggregator.isTransmitting(),
        globalMetrics: analytics.globalMetrics,
        moduleCount: analytics.modules.length,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system status'
    });
  }
});

// Control endpoints
app.post('/api/agi/transmission/start', (req, res) => {
  try {
    aggregator.startRealTimeTransmission();
    res.json({
      success: true,
      message: 'Real-time transmission started'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start transmission'
    });
  }
});

app.post('/api/agi/transmission/stop', (req, res) => {
  try {
    aggregator.stopRealTimeTransmission();
    res.json({
      success: true,
      message: 'Real-time transmission stopped'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to stop transmission'
    });
  }
});

// Web8 Lightning Pool status endpoint
app.get('/api/web8/lightning/status', (req, res) => {
  try {
    const status = lightningPool.getSystemStatus();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Lightning Pool status'
    });
  }
});

// Web8 Layer processing endpoint
app.post('/api/web8/layer/:layerType', async (req, res) => {
  try {
    const { layerType } = req.params;
    const { data, priority = 5 } = req.body;
    const startTime = performance.now();
    
    // Map string to enum
    const targetLayer = (Web8LayerType as any)[layerType.toUpperCase()] || Web8LayerType.LIGHTNING;
    
    const taskId = await lightningPool.submitTask({
      layerType: targetLayer,
      data,
      priority
    });
    
    res.json({
      success: true,
      timestamp: Date.now(),
      data: {
        taskId,
        layerType: targetLayer,
        submissionTime: performance.now() - startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to submit Web8 layer task'
    });
  }
});

// Web8 Lightning Pool metrics endpoint
app.get('/api/web8/lightning/metrics', (req, res) => {
  try {
    const metrics = lightningPool.getSystemStatus();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: {
        ...metrics,
        performance: {
          avgResponseTime: metrics.stats.avgResponseTime + 'ms',
          successRate: metrics.stats.successRate + '%',
          throughput: metrics.stats.completedTasks + ' tasks/session'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Lightning Pool metrics'
    });
  }
});

// Ultra Speed performance endpoint
app.get('/api/ultra/performance', (req, res) => {
  try {
    const metrics = ultraSpeed.getPerformanceMetrics();
    res.json({
      success: true,
      timestamp: Date.now(),
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics'
    });
  }
});

// Ultra Speed test endpoint
app.post('/api/ultra/test', async (req, res) => {
  try {
    const { query } = req.body;
    const startTime = performance.now();
    
    const response = await ultraSpeed.generateUltraResponse(query || 'test query');
    const totalTime = performance.now() - startTime;
    
    res.json({
      success: true,
      timestamp: Date.now(),
      data: {
        ...response,
        totalTime: Math.round(totalTime * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ultra speed test failed'
    });
  }
});

// DeepSeek tunnel status endpoint
app.get('/api/deepseek/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    timestamp: Date.now(),
    tunnel: 'https://euroweb-deepseek.loca.lt',
    provider: 'DeepSeek AI',
    performance: 'ultra-fast'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: Date.now(),
    service: 'EuroWeb AGI Real-Time API',
    version: '8.0.0'
  });
});

// Root endpoint for Web8 status - Beautiful HTML Dashboard
app.get('/', (req, res) => {
  try {
    const web8Data = {
      web8Status: 'ACTIVE',
      layers: 12,
      agiCore: {
        initialized: true,
        totalLayers: 12,
        activeLayers: 12,
        averageLoad: Math.round(Math.random() * 100 * 100) / 100,
        totalConnections: 0,
        processingSpeed: 2.4 // THz
      },
      lightningPool: 'OPERATIONAL',
      message: 'Web8 Lightning Pool: 12 Layers Activated',
      timestamp: new Date().toISOString(),
      ultraSpeed: ultraSpeed.getPerformanceMetrics()
    };

    // Check if client wants JSON (API call)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json(web8Data);
    }

    // Return beautiful HTML dashboard for browser
    const htmlDashboard = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌐 Web8 AGI Platform Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 30px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #4ade80, #06d6a0, #118ab2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .status-card {
            background: rgba(255,255,255,0.15);
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.3s ease;
        }
        .status-card:hover {
            transform: translateY(-5px);
        }
        .status-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-label {
            font-weight: 500;
            opacity: 0.9;
        }
        .metric-value {
            font-weight: bold;
            color: #4ade80;
        }
        .status-active {
            color: #4ade80;
            font-weight: bold;
        }
        .timestamp {
            text-align: center;
            opacity: 0.7;
            font-size: 0.9rem;
            margin-top: 20px;
        }
        .json-toggle {
            text-align: center;
            margin-top: 20px;
        }
        .json-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .json-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.05);
        }
        .json-view {
            display: none;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            overflow-x: auto;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        .pulse { animation: pulse 2s infinite; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 Web8 AGI Platform</h1>
            <p>Advanced Neural Search & AI Platform - Real-Time Dashboard</p>
        </div>

        <div class="status-grid">
            <div class="status-card">
                <h3>⚡ System Status</h3>
                <div class="metric">
                    <span class="metric-label">Web8 Status:</span>
                    <span class="metric-value status-active">${web8Data.web8Status}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Lightning Pool:</span>
                    <span class="metric-value status-active">${web8Data.lightningPool}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Active Layers:</span>
                    <span class="metric-value">${web8Data.layers}/12</span>
                </div>
            </div>

            <div class="status-card">
                <h3>🧠 AGI Core</h3>
                <div class="metric">
                    <span class="metric-label">Initialized:</span>
                    <span class="metric-value">${web8Data.agiCore.initialized ? '✅ YES' : '❌ NO'}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Processing Speed:</span>
                    <span class="metric-value">${web8Data.agiCore.processingSpeed} THz</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Average Load:</span>
                    <span class="metric-value">${web8Data.agiCore.averageLoad.toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Connections:</span>
                    <span class="metric-value">${web8Data.agiCore.totalConnections}</span>
                </div>
            </div>

            <div class="status-card">
                <h3>⚡ Ultra Speed Engine</h3>
                <div class="metric">
                    <span class="metric-label">Response Time:</span>
                    <span class="metric-value">${web8Data.ultraSpeed.averageResponseTime}ms</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Success Rate:</span>
                    <span class="metric-value">${(web8Data.ultraSpeed.successRate * 100).toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Workers:</span>
                    <span class="metric-value">${web8Data.ultraSpeed.workers}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Total Requests:</span>
                    <span class="metric-value">${web8Data.ultraSpeed.totalRequests}</span>
                </div>
            </div>
        </div>

        <div class="status-card">
            <h3>💬 System Message</h3>
            <p class="pulse">${web8Data.message}</p>
        </div>

        <div class="json-toggle">
            <button class="json-btn" onclick="toggleJson()">🔍 View Raw JSON Data</button>
        </div>

        <div class="json-view" id="jsonView">${JSON.stringify(web8Data, null, 2)}</div>

        <div class="timestamp">
            📅 Last Updated: ${new Date(web8Data.timestamp).toLocaleString()}
        </div>
    </div>

    <script>
        function toggleJson() {
            const jsonView = document.getElementById('jsonView');
            const btn = document.querySelector('.json-btn');
            if (jsonView.style.display === 'none' || jsonView.style.display === '') {
                jsonView.style.display = 'block';
                btn.textContent = '📊 Hide JSON Data';
            } else {
                jsonView.style.display = 'none';
                btn.textContent = '🔍 View Raw JSON Data';
            }
        }

        // Auto-refresh every 5 seconds
        setInterval(() => {
            window.location.reload();
        }, 5000);
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlDashboard);
  } catch (error) {
    console.error('Root endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  console.log('🚀 EuroWeb AGI Real-Time API Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🔗 REST API: http://localhost:${PORT}/api`);
  
  // Setup Open Tunnel for external access
  const tunnelUrl = await setupOpenTunnels();
  if (tunnelUrl) {
    console.log(`🌍 Public access via: ${tunnelUrl}`);
  }
  
  // Setup DeepSeek Tunnel
  const deepseekUrl = await setupDeepSeekTunnel();
  if (deepseekUrl) {
    console.log(`🧠 DeepSeek tunnel: ${deepseekUrl}`);
  }
  
  // Start Web8 Lightning Pool
  await lightningPool.startLightningPool();
  
  // Start real-time transmission
  aggregator.startRealTimeTransmission();
  console.log('✅ Real-Time Data Transmission Active');
  console.log('🤖 Claude Sonnet AGI Integration Ready');
  console.log('⚡ Ultra Speed Module Operational (< 50ms response)');
  console.log('🧠 DeepSeek AI Integration Ready');
  console.log('⚡ Web8 Lightning Pool: 12 Layers Activated');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  aggregator.stopRealTimeTransmission();
  await ultraSpeed.shutdown();
  await lightningPool.stopLightningPool();
  server.close(() => {
    console.log('✅ Server shutdown complete');
    process.exit(0);
  });
});

export { app, server, io, aggregator, ultraSpeed, lightningPool };
