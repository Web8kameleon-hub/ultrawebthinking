/**
 * Simple AGI Backend Server
 * WebSocket server for real-time data broadcasting
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

// Create HTTP server
const server = http.createServer();
const wss = new WebSocketServer({ server });

// Mock AGI data generators
function generateAGIMetrics() {
  return {
    neuralActivity: Math.random() * 100,
    processingSpeed: Math.random() * 1000 + 500,
    memoryUsage: Math.random() * 80 + 10,
    ethicalCompliance: Math.random() * 10 + 90,
    learningRate: Math.random() * 5 + 2,
    timestamp: new Date().toISOString()
  };
}

function generateModuleActivities() {
  const modules = ['Neural Engine', 'Ethics Core', 'Learning Matrix', 'Decision Tree', 'Memory Bank'];
  return modules.map(module => ({
    id: module.toLowerCase().replace(' ', '_'),
    name: module,
    status: Math.random() > 0.8 ? 'processing' : 'active',
    activity: Math.random() * 100,
    lastUpdate: new Date().toISOString()
  }));
}

function generateSystemHealth() {
  return {
    cpu: Math.random() * 60 + 30,
    memory: Math.random() * 70 + 20,
    network: Math.random() * 30 + 70,
    storage: Math.random() * 40 + 40,
    temperature: Math.random() * 20 + 45,
    overall: Math.random() * 20 + 80
  };
}

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('🔌 New WebSocket connection established');
  
  // Send initial data
  ws.send(JSON.stringify({
    type: 'initial',
    data: {
      metrics: generateAGIMetrics(),
      moduleActivities: generateModuleActivities(),
      systemHealth: generateSystemHealth()
    }
  }));

  // Send periodic updates
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'update',
        data: {
          metrics: generateAGIMetrics(),
          moduleActivities: generateModuleActivities(),
          systemHealth: generateSystemHealth()
        }
      }));
    }
  }, 3000); // Update every 3 seconds

  ws.on('message', function message(data) {
    console.log('📨 Received:', data.toString());
  });

  ws.on('close', function close() {
    console.log('🔌 WebSocket connection closed');
    clearInterval(interval);
  });

  ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err);
    clearInterval(interval);
  });
});

// HTTP endpoint for health check
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      timestamp: new Date().toISOString(),
      connections: wss.clients.size
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 AGI Backend Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down AGI Backend Server...');
  server.close(() => {
    console.log('✅ Server shutdown complete');
    process.exit(0);
  });
});
