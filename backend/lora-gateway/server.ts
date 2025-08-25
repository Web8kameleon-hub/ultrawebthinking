/**
 * LoRa Gateway Server with Real-time WebSocket
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { loraGateway, LoRaMessage, LoRaDevice } from './LoRaGateway';
import { solanaIntegrator } from './SolanaIntegrator';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// LoRa Gateway Events
loraGateway.on('connected', () => {
  console.log('🌐 LoRa Gateway connected');
  io.emit('lora:status', { connected: true });
});

loraGateway.on('disconnected', () => {
  console.log('🔌 LoRa Gateway disconnected');
  io.emit('lora:status', { connected: false });
});

loraGateway.on('message', async (message: LoRaMessage) => {
  console.log('📨 Broadcasting LoRa message:', message);
  
  // Broadcast to all connected clients
  io.emit('lora:message', message);
  
  // Store on Solana blockchain
  try {
    const signature = await solanaIntegrator.storeLoRaMessage(message);
    if (signature) {
      io.emit('solana:stored', { messageId: message.id, signature });
    }
  } catch (error) {
    console.error('Failed to store on Solana:', error);
  }
});

loraGateway.on('deviceUpdate', (device: LoRaDevice) => {
  console.log('📱 Device updated:', device);
  io.emit('lora:device', device);
});

loraGateway.on('error', (error) => {
  console.error('❌ LoRa Gateway error:', error);
  io.emit('lora:error', { error: error.message });
});

// REST API Endpoints
app.get('/api/lora/status', (req, res) => {
  res.json(loraGateway.getStatus());
});

app.get('/api/lora/devices', (req, res) => {
  res.json(loraGateway.getDevices());
});

app.get('/api/lora/messages', (req, res) => {
  const { deviceId } = req.query;
  res.json(loraGateway.getMessages(deviceId as string));
});

app.post('/api/lora/send', async (req, res) => {
  try {
    const { deviceId, message } = req.body;
    await loraGateway.sendMessage(deviceId, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/solana/wallet', async (req, res) => {
  try {
    const walletInfo = await solanaIntegrator.getWalletInfo();
    res.json(walletInfo);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/solana/messages', async (req, res) => {
  try {
    const { deviceId } = req.query;
    const messages = await solanaIntegrator.getStoredMessages(deviceId as string);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/api/solana/airdrop', async (req, res) => {
  try {
    const { amount = 1 } = req.body;
    const signature = await solanaIntegrator.airdropSol(amount);
    res.json({ signature });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('👤 Client connected:', socket.id);
  
  // Send current status
  socket.emit('lora:status', { connected: loraGateway.getStatus().connected });
  socket.emit('lora:devices', loraGateway.getDevices());
  
  socket.on('lora:subscribe', (deviceId) => {
    socket.join(`device:${deviceId}`);
    console.log(`📱 Client subscribed to device: ${deviceId}`);
  });
  
  socket.on('lora:unsubscribe', (deviceId) => {
    socket.leave(`device:${deviceId}`);
    console.log(`📱 Client unsubscribed from device: ${deviceId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('👤 Client disconnected:', socket.id);
  });
});

// Initialize services
async function initializeServices() {
  try {
    console.log('🚀 Initializing LoRa Gateway Server...');
    
    // Initialize Solana integrator
    await solanaIntegrator.initialize();
    
    // Request airdrop for testing (devnet only)
    try {
      await solanaIntegrator.airdropSol(2);
    } catch (error) {
      console.log('ℹ️ Airdrop skipped (not devnet or already funded)');
    }
    
    // Connect to LoRa Gateway
    await loraGateway.connect();
    
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    console.log('⚠️ Server will continue without LoRa hardware connection');
  }
}

const PORT = process.env.LORA_PORT || 4001;

server.listen(PORT, () => {
  console.log(`🌐 LoRa Gateway Server running on port ${PORT}`);
  initializeServices();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down LoRa Gateway Server...');
  await loraGateway.disconnect();
  process.exit(0);
});

export { app, server, io };
