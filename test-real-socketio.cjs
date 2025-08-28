/**
 * Test Real Socket.IO Data
 * Teston të dhënat reale nga backend
 */

const { io } = require('socket.io-client');

console.log('🔌 Testing Real Socket.IO Data...\n');

// Connect to backend Socket.IO server
const socket = io('http://localhost:3002', {
  autoConnect: true,
  timeout: 5000
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server\n');
  
  // Test AGI Med analysis with real data
  console.log('🩺 Testing AGI Med real analysis...');
  socket.emit('agimed:analyze', {
    patientId: 'test-123',
    symptoms: ['fever', 'headache'],
    vitals: { temperature: 38.5, pulse: 90 }
  });
  
  // Test AGI Bio scan with real data
  console.log('🌱 Testing AGI Bio real scan...');
  socket.emit('agibio:scan', {
    sampleId: 'bio-456',
    scanType: 'cellular',
    parameters: { resolution: 'high', depth: 'full' }
  });
  
  // Test AGI Eco calculation with real data
  console.log('💰 Testing AGI Eco real calculation...');
  socket.emit('agiei:calculate', {
    operation: 'efficiency',
    resources: ['cpu', 'memory', 'network'],
    timeframe: 'realtime'
  });
});

// Listen for real AGI Med results
socket.on('agimed:result', (data) => {
  console.log('\n🩺 AGI Med Real Analysis Result:');
  console.log('Analysis:', data.analysis);
  console.log('Real Metrics:', JSON.stringify(data.metrics, null, 2));
  console.log('---');
});

// Listen for real AGI Bio results
socket.on('agibio:result', (data) => {
  console.log('\n🌱 AGI Bio Real Scan Result:');
  console.log('Scan:', data.scan);
  console.log('Bio Metrics:', JSON.stringify(data.bio_metrics, null, 2));
  console.log('---');
});

// Listen for real AGI Eco results
socket.on('agiei:result', (data) => {
  console.log('\n💰 AGI Eco Real Calculation Result:');
  console.log('Calculation:', data.calculation);
  console.log('Eco Metrics:', JSON.stringify(data.eco_metrics, null, 2));
  console.log('---');
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

socket.on('disconnect', () => {
  console.log('\n🔌 Disconnected from Socket.IO server');
});

// Auto disconnect after 10 seconds
setTimeout(() => {
  console.log('\n⏰ Auto-disconnecting...');
  socket.disconnect();
  process.exit(0);
}, 10000);
