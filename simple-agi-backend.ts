/**
 * Simple AGI Backend Server - Emergency Fix
 * @author Ledjan Ahmati
 * @version 8.0.0-SIMPLE
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Mock AGI data to reduce laptop load
const generateMockAGIData = () => {
  return {
    modules: [
      {
        moduleId: 'agi-core',
        moduleName: 'AGI Core',
        status: 'active',
        activity: Math.random() * 100,
        processingSpeed: 98.5,
        memoryUsage: 45.2,
        cpuUsage: 23.1,
        networkTraffic: 15.3,
        errors: 0,
        warnings: 0,
        lastUpdate: Date.now(),
        performance: {
          responseTime: 120,
          throughput: 95.2,
          efficiency: 89.7
        }
      },
      {
        moduleId: 'search-ultra',
        moduleName: 'Search Ultra',
        status: 'active',
        activity: Math.random() * 100,
        processingSpeed: 94.1,
        memoryUsage: 32.1,
        cpuUsage: 18.5,
        networkTraffic: 8.2,
        errors: 0,
        warnings: 0,
        lastUpdate: Date.now(),
        performance: {
          responseTime: 85,
          throughput: 92.1,
          efficiency: 91.3
        }
      }
    ],
    globalMetrics: {
      totalOperations: 15420,
      systemLoad: 25.6,
      networkHealth: 98.2,
      securityLevel: 100,
      ethicalCompliance: 100
    },
    timestamp: Date.now()
  };
};

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    server: 'Simple AGI Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/agi/modules', (req, res) => {
  res.json(generateMockAGIData());
});

app.post('/api/agi/neural-search', (req, res) => {
  const { query } = req.body;
  
  // Simulate neural search with reduced processing
  setTimeout(() => {
    res.json({
      query,
      results: [
        {
          title: `Neural Result for: ${query}`,
          content: `Optimized neural search result with reduced laptop load.`,
          relevance: 95.2,
          source: 'AGI Neural Engine',
          timestamp: new Date().toISOString()
        }
      ],
      processingTime: 45,
      neural: {
        confidence: 92.1,
        complexity: 'low',
        memoryUsed: '15MB'
      }
    });
  }, 50); // Much faster response
});

app.post('/api/agi/openmind', (req, res) => {
  const { query } = req.body;
  
  setTimeout(() => {
    res.json({
      query,
      response: `Optimized OpenMind response for: ${query}. System load reduced for better laptop performance.`,
      confidence: 89.5,
      processingTime: 35,
      timestamp: new Date().toISOString()
    });
  }, 40);
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Send initial data immediately
  socket.emit('moduleActivity', generateMockAGIData().modules);
  
  // Send periodic updates with reduced frequency to save resources
  const interval = setInterval(() => {
    socket.emit('moduleActivity', generateMockAGIData().modules);
    socket.emit('globalMetrics', generateMockAGIData().globalMetrics);
  }, 2000); // Every 2 seconds instead of constant updates
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    clearInterval(interval);
  });
  
  socket.on('subscribe', (modules) => {
    console.log('📡 Client subscribed to modules:', modules);
    socket.emit('subscribed', modules);
  });
});

// Memory optimization
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  // Don't crash, just log
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash, just log
});

const PORT = process.env.AGI_PORT || 4000;

server.listen(PORT, () => {
  console.log(`
🚀 Simple AGI Backend Server Running!
📡 Port: ${PORT}
🌐 Socket.IO: ws://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/api/health
⚡ Optimized for reduced laptop load
🧠 Author: Ledjan Ahmati
  `);
});

export default app;
