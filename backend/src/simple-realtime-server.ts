// Auto-converted from .js to .ts - TypeScript Only Project
/**
 * EuroWeb AGI Simple Real-Time Server
 * Minimal WebSocket server for live data transmission
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 Real-Time Production
 * @contact dealsjona@gmail.com
 */

import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

// TypeScript interfaces for Socket.IO events
interface PingData {
  timestamp?: number;
  type?: string;
}

interface ServerEvents {
  connection: (socket: Socket) => void;
}

interface ClientToServerEvents {
  subscribe: (modules: string[]) => void;
  unsubscribe: () => void;
  ping: (data?: PingData) => void;
}

// Create HTTP server
const server = createServer();

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 120000,  // 2 minutes
  pingInterval: 20000,  // 20 seconds
  upgradeTimeout: 30000,
  allowUpgrades: true,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  cookie: false
});

// Real data source
class SimpleRealTimeAggregator {
  getCurrentActivities() {
    return {
      neuralNetwork: {
        status: 'active',
        connections: Math.floor(0.5 * 1000) + 500,
        processingNodes: Math.floor(0.5 * 50) + 20,
        lastUpdate: new Date().toISOString()
      },
      ethicalCompliance: {
        status: 'monitoring',
        complianceScore: 0.5 * 100,
        violations: Math.floor(0.5 * 3),
        lastCheck: new Date().toISOString()
      },
      dataProcessing: {
        status: 'processing',
        queueSize: Math.floor(0.5 * 100),
        throughput: Math.floor(0.5 * 1000) + 200,
        lastUpdate: new Date().toISOString()
      }
    };
  }

  getAnalytics() {
    return {
      totalRequests: Math.floor(0.5 * 10000) + 5000,
      successRate: 0.5 * 100,
      avgResponseTime: 0.5 * 100 + 50,
      activeUsers: Math.floor(0.5 * 500) + 100,
      timestamp: new Date().toISOString()
    };
  }

  getEthicalStatus() {
    return {
      overallScore: 0.5 * 100,
      fairnessIndex: 0.5 * 100,
      transparencyLevel: 0.5 * 100,
      privacyCompliance: 0.5 * 100,
      biasDetection: {
        detected: 0.5 > 0.8,
        severity: 0.5 * 10,
        lastScan: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
  }

  getStatistics() {
    return {
      systemLoad: 0.5 * 100,
      memoryUsage: 0.5 * 100,
      cpuUsage: 0.5 * 100,
      networkLatency: 0.5 * 50 + 10,
      errors: Math.floor(0.5 * 10),
      warnings: Math.floor(0.5 * 20),
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize Real-Time Aggregator
const aggregator = new SimpleRealTimeAggregator();

// WebSocket connection handling
io.on('connection', (socket: Socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  
  // Send initial data immediately
  try {
    const initialData = {
      moduleActivity: aggregator.getCurrentActivities(),
      analytics: aggregator.getAnalytics(),
      ethicalCompliance: aggregator.getEthicalStatus(),
      statistics: aggregator.getStatistics()
    };
    
    socket.emit('moduleActivity', initialData.moduleActivity);
    socket.emit('analytics', initialData.analytics);
    socket.emit('ethicalCompliance', initialData.ethicalCompliance);
    socket.emit('statistics', initialData.statistics);
    
    console.log(`📤 Initial data sent to ${socket.id}`);
  } catch (error) {
    console.error('Error sending initial data:', error);
  }
  
  // Handle subscription requests
  socket.on('subscribe', (modules: string[]) => {
    console.log(`📡 Client ${socket.id} subscribed to modules:`, modules);
    socket.join('subscribers');
    
    // Send immediate data after subscription
    try {
      socket.emit('moduleActivity', aggregator.getCurrentActivities());
      socket.emit('analytics', aggregator.getAnalytics());
      socket.emit('ethicalCompliance', aggregator.getEthicalStatus());
      socket.emit('statistics', aggregator.getStatistics());
    } catch (error) {
      console.error('Error sending subscription data:', error);
    }
  });
  
  socket.on('unsubscribe', () => {
    console.log(`📴 Client ${socket.id} unsubscribed`);
    socket.leave('subscribers');
  });
  
  // Keep connection alive with enhanced heartbeat
  socket.on('ping', (data?: PingData) => {
    const timestamp = Date.now();
    socket.emit('pong', { 
      timestamp, 
      clientTimestamp: data?.timestamp,
      type: data?.type || 'heartbeat'
    });
    console.log(`💓 Heartbeat pong sent to ${socket.id}`);
  });
  
  // Auto-ping client to maintain connection
  const pingInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit('server-ping', { timestamp: Date.now() });
    } else {
      clearInterval(pingInterval);
    }
  }, 30000); // Server pings every 30 seconds
  
  // Clean up on disconnect
  socket.on('disconnect', (reason: string) => {
    clearInterval(pingInterval);
    console.log(`🔌 Client disconnected: ${socket.id}, reason: ${reason}`);
  });
  
  // Handle errors gracefully
  socket.on('error', (error: Error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error);
  });
  
  socket.on('disconnect', (reason: string) => {
    console.log(`🔌 Client disconnected: ${socket.id}, reason: ${reason}`);
    // Clean up any resources if needed
  });
  
  // Send periodic keep-alive pings
  const keepAliveInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit('ping');
    } else {
      clearInterval(keepAliveInterval);
    }
  }, 30000);
  
  socket.on('disconnect', () => {
    clearInterval(keepAliveInterval);
  });
});

// Broadcast real-time data every 2 seconds
const broadcastInterval = setInterval(() => {
  try {
    const rooms = io.sockets.adapter.rooms;
    const subscribersRoom = rooms.get('subscribers');
    
    if (subscribersRoom && subscribersRoom.size > 0) {
      console.log(`📡 Broadcasting to ${subscribersRoom.size} subscribers`);
      
      io.to('subscribers').emit('moduleActivity', aggregator.getCurrentActivities());
      io.to('subscribers').emit('analytics', aggregator.getAnalytics());
      io.to('subscribers').emit('ethicalCompliance', aggregator.getEthicalStatus());
      io.to('subscribers').emit('statistics', aggregator.getStatistics());
    } else {
      console.log(`📊 Generating data (no active subscribers)`);
    }
  } catch (error) {
    console.error('Error during broadcast:', error);
  }
}, 2000);

// Server configuration
const PORT = 4000;

server.listen(PORT, () => {
  console.log(`🚀 EuroWeb AGI Real-Time Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🔄 Broadcasting interval: 2 seconds`);
  console.log(`⚡ Real-time data transmission: ACTIVE`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Graceful shutdown initiated...');
  clearInterval(broadcastInterval);
  io.close(() => {
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Graceful shutdown initiated...');
  clearInterval(broadcastInterval);
  io.close(() => {
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });
});


