/**
 * EuroWeb AGI Real-Time API Server
 * WebSocket & REST API endpoints for live data transmission
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 Real-Time Production
 * @contact dealsjona@gmail.com
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import RealTimeAggregator from './agi/RealTimeAggregator';

const app = express();
const server = createServer(app);
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

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Send initial data
  socket.emit('moduleActivity', aggregator.getCurrentActivities());
  socket.emit('analytics', aggregator.getAnalytics());
  socket.emit('ethicalCompliance', aggregator.getEthicalStatus());
  
  // Handle real-time subscription requests
  socket.on('subscribe', (modules: string[]) => {
    console.log(`📡 Client ${socket.id} subscribed to modules:`, modules);
    socket.join('subscribers');
  });
  
  socket.on('unsubscribe', () => {
    console.log(`📴 Client ${socket.id} unsubscribed`);
    socket.leave('subscribers');
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Real-time event broadcasting
aggregator.on('moduleActivity', (data: any) => {
  io.to('subscribers').emit('moduleActivity', data);
});

aggregator.on('statistics', (data: any) => {
  io.to('subscribers').emit('statistics', data);
});

aggregator.on('analytics', (data: any) => {
  io.to('subscribers').emit('analytics', data);
});

aggregator.on('ethicalCompliance', (data: any) => {
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
    
    res.json({
      success: true,
      timestamp: Date.now(),
      data: activity
    });
  } catch (error) {
    res.status(500).json({
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

server.listen(PORT, () => {
  console.log('🚀 EuroWeb AGI Real-Time API Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🔗 REST API: http://localhost:${PORT}/api`);
  
  // Start real-time transmission
  aggregator.startRealTimeTransmission();
  console.log('✅ Real-Time Data Transmission Active');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  aggregator.stopRealTimeTransmission();
  server.close(() => {
    console.log('✅ Server shutdown complete');
    process.exit(0);
  });
});

export { app, server, io, aggregator };
