/**
 * Test LoRa Connect Engine
 * Testimi i Motorit LoRa Connect
 */

import LoRaConnectEngine from './lib/loraConnectEngine';

async function testLoRaConnectEngine() {
  console.log('📡 Testing LoRa Connect Engine...\n');
  
  const engine = LoRaConnectEngine.getInstance();
  
  // Test 1: Get initial devices and gateways
  console.log('Test 1: Initial system state');
  const devices = engine.getDevices();
  const gateways = engine.getGateways();
  
  console.log('✅ Devices loaded:', devices.length);
  devices.forEach(device => {
    console.log(`   - ${device.name} (${device.type}) - Battery: ${Math.round(device.battery)}% - Online: ${device.isOnline}`);
  });
  
  console.log('✅ Gateways loaded:', gateways.length);
  gateways.forEach(gateway => {
    console.log(`   - ${gateway.name} - Status: ${gateway.status} - Coverage: ${gateway.coverage}km`);
  });
  console.log('---');
  
  // Test 2: Wait for real-time updates
  console.log('Test 2: Real-time data simulation (waiting 6 seconds for 2 updates)');
  
  let updateCount = 0;
  engine.onUpdate((data) => {
    updateCount++;
    console.log(`✅ Update ${updateCount}:`, {
      timestamp: data.timestamp.toLocaleTimeString(),
      onlineDevices: data.devices.filter((d: any) => d.isOnline).length,
      totalMessages: data.recentMessages.length,
      avgBattery: Math.round(data.devices.reduce((sum: number, d: any) => sum + d.battery, 0) / data.devices.length)
    });
    
    if (updateCount >= 2) {
      console.log('---');
      testCommandSending();
    }
  });
  
  // Test 3: Send commands (will be called after 2 updates)
  async function testCommandSending() {
    console.log('Test 3: Sending commands to devices');
    
    // Send command to street light
    const streetLight = devices.find(d => d.id === 'city-001');
    if (streetLight) {
      console.log(`Sending command to ${streetLight.name}...`);
      const success = await engine.sendCommand('city-001', { brightness: 90, status: 'on' });
      console.log(`✅ Command result: ${success ? 'Success' : 'Failed'}`);
      
      // Check updated data
      setTimeout(() => {
        const updatedDevice = engine.getDevices().find(d => d.id === 'city-001');
        if (updatedDevice?.data) {
          console.log(`✅ Updated street light data:`, updatedDevice.data);
        }
      }, 1000);
    }
    
    // Test invalid device command
    const invalidResult = await engine.sendCommand('invalid-device', { test: true });
    console.log(`✅ Invalid device command result: ${invalidResult ? 'Success' : 'Failed (expected)'}`);
    
    console.log('---');
    
    // Test 4: Sensor readings
    setTimeout(() => {
      console.log('Test 4: Sensor readings');
      const weatherStation = devices.find(d => d.id === 'env-001');
      if (weatherStation) {
        const readings = engine.getSensorReadings(weatherStation.id, 5);
        console.log(`✅ Weather station readings (last 5):`, readings.length);
        readings.forEach((reading, idx) => {
          console.log(`   ${idx + 1}. ${reading.timestamp.toLocaleTimeString()} - Temp: ${reading.temperature}°C, Humidity: ${reading.humidity}%`);
        });
      }
      
      console.log('---');
      
      // Test 5: Messages
      console.log('Test 5: Recent LoRa messages');
      const recentMessages = engine.getRecentMessages(10);
      console.log(`✅ Recent messages:`, recentMessages.length);
      recentMessages.slice(0, 3).forEach((msg, idx) => {
        const device = devices.find(d => d.id === msg.deviceId);
        console.log(`   ${idx + 1}. ${msg.messageType.toUpperCase()} from ${device?.name || msg.deviceId} - RSSI: ${msg.rssi} dBm`);
      });
      
      console.log('\n🎉 LoRa Connect Engine test completed!');
      console.log('💡 The system is now running with real-time updates every 3 seconds');
      console.log('🚀 Open http://localhost:3000 and navigate to LoRa Connect tab to see the dashboard');
      
      // Stop after testing
      setTimeout(() => {
        engine.stop();
        console.log('🔴 Simulation stopped for testing');
      }, 5000);
    }, 2000);
  }
}

testLoRaConnectEngine().catch(console.error);
