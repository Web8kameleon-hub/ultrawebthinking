/**
 * Test Real-Time Connection
 * Direct WebSocket connection test
 */

import { io } from 'socket.io-client';

console.log('🚀 Starting WebSocket connection test...');

const socket = io('http://localhost:4000', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected to real-time server!');
  console.log('📡 Socket ID:', socket.id);
  
  // Subscribe to modules
  socket.emit('subscribe', ['agi-core', 'neural-analytics', 'guardian']);
  console.log('📨 Subscription request sent');
});

socket.on('moduleActivity', (data) => {
  console.log('📊 Module Activity:', data);
});

socket.on('analytics', (data) => {
  console.log('📈 Analytics:', data);
});

socket.on('ethicalCompliance', (data) => {
  console.log('⚖️ Ethical Compliance:', data);
});

socket.on('statistics', (data) => {
  console.log('📊 Statistics:', data);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.log('🚨 Connection Error:', error.message);
});

// Keep alive for 30 seconds
setTimeout(() => {
  console.log('⏰ Test completed, disconnecting...');
  socket.disconnect();
  process.exit(0);
}, 30000);
