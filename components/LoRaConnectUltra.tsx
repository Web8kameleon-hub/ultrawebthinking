/**
 * LoRa Connect Ultra Dashboard Component
 * Komponenti i Dashboard-it LoRa Connect Ultra
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoRaConnectEngine, { 
  LoRaDevice, 
  LoRaGateway, 
  LoRaMessage, 
  SensorReading 
} from '../lib/loraConnectEngine';

const LoRaConnectUltra = () => {
  const [engine] = useState(() => LoRaConnectEngine.getInstance());
  const [devices, setDevices] = useState<LoRaDevice[]>([]);
  const [gateways, setGateways] = useState<LoRaGateway[]>([]);
  const [recentMessages, setRecentMessages] = useState<LoRaMessage[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [commandInput, setCommandInput] = useState('');

  // Real-time updates every 3 seconds
  useEffect(() => {
    const handleUpdate = (data: any) => {
      setDevices(data.devices);
      setGateways(data.gateways);
      setRecentMessages(data.recentMessages);
      setLastUpdate(data.timestamp);
      
      // Update sensor readings for selected device
      if (selectedDevice) {
        const readings = engine.getSensorReadings(selectedDevice, 20);
        setSensorReadings(readings);
      }
    };

    engine.onUpdate(handleUpdate);

    // Initial load
    handleUpdate({
      devices: engine.getDevices(),
      gateways: engine.getGateways(),
      recentMessages: engine.getRecentMessages(20),
      timestamp: new Date()
    });

    return () => {
      // Cleanup if needed
    };
  }, [engine, selectedDevice]);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    const readings = engine.getSensorReadings(deviceId, 20);
    setSensorReadings(readings);
  };

  const handleSendCommand = async (deviceId: string) => {
    if (!commandInput.trim()) return;

    try {
      const command = JSON.parse(commandInput);
      const success = await engine.sendCommand(deviceId, command);
      
      if (success) {
        alert('✅ Command sent successfully!');
        setCommandInput('');
      } else {
        alert('❌ Failed to send command. Device may be offline.');
      }
    } catch (error) {
      alert('❌ Invalid command format. Please use valid JSON.');
    }
  };

  const getDeviceStatusColor = (device: LoRaDevice) => {
    if (!device.isOnline) return '#ef4444';
    if (device.battery < 20) return '#f97316';
    if (device.rssi < -100) return '#eab308';
    return '#22c55e';
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -70) return 'Excellent';
    if (rssi > -85) return 'Good';
    if (rssi > -100) return 'Fair';
    return 'Poor';
  };

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            margin: '0 0 10px 0',
            background: 'linear-gradient(45deg, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📡 LoRa Connect Ultra
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.8,
            margin: 0
          }}>
            Real-time IoT Management System • Sistema e Menaxhimit të IoT në Kohë Reale
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.2)',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isRealTime ? '#22c55e' : '#ef4444',
              animation: isRealTime ? 'pulse 2s infinite' : 'none'
            }} />
            {isRealTime ? 'Live Data' : 'Paused'}
          </div>
          
          <div style={{
            fontSize: '12px',
            opacity: 0.7
          }}>
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Gateways Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>📡 Gateways</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
            {gateways.filter(gw => gw.status === 'online').length}/{gateways.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            {gateways.reduce((sum, gw) => sum + gw.connectedDevices, 0)} devices connected
          </div>
        </motion.div>

        {/* Devices Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', color: '#22c55e' }}>🔌 Devices</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
            {devices.filter(d => d.isOnline).length}/{devices.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            {devices.filter(d => d.battery < 20).length} low battery
          </div>
        </motion.div>

        {/* Messages Throughput */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>📊 Messages</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
            {recentMessages.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            Last 3 seconds
          </div>
        </motion.div>

        {/* Network Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>🗺️ Coverage</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
            {Math.round(gateways.reduce((sum, gw) => sum + gw.coverage, 0) / gateways.length)} km
          </div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            Average radius
          </div>
        </motion.div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* Devices List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>🔌 IoT Devices</h3>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {devices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleDeviceSelect(device.id)}
                style={{
                  background: selectedDevice === device.id ? 
                    'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${getDeviceStatusColor(device)}`,
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {device.name}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>
                      {device.type.toUpperCase()} • {device.frequency} MHz
                    </div>
                  </div>
                  
                  <div style={{
                    background: getDeviceStatusColor(device),
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%'
                  }} />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '10px',
                  fontSize: '12px'
                }}>
                  <div>
                    <div style={{ opacity: 0.7 }}>Battery</div>
                    <div style={{ 
                      color: device.battery < 20 ? '#ef4444' : '#22c55e' 
                    }}>
                      {Math.round(device.battery)}%
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ opacity: 0.7 }}>Signal</div>
                    <div>{getSignalStrength(device.rssi)}</div>
                  </div>
                  
                  <div>
                    <div style={{ opacity: 0.7 }}>RSSI</div>
                    <div>{device.rssi} dBm</div>
                  </div>
                </div>

                {device.data && (
                  <div style={{
                    marginTop: '10px',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}>
                    {Object.entries(device.data).slice(0, 3).map(([key, value]) => (
                      <span key={key} style={{ marginRight: '10px' }}>
                        {key}: {typeof value === 'object' ? 'Complex' : String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Device Details & Control */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>🎛️ Device Control</h3>
          
          {selectedDevice ? (
            <div>
              {(() => {
                const device = devices.find(d => d.id === selectedDevice);
                if (!device) return null;
                
                return (
                  <div>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0' }}>{device.name}</h4>
                      <div style={{ fontSize: '14px', opacity: 0.8 }}>
                        Location: {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
                      </div>
                      <div style={{ fontSize: '14px', opacity: 0.8 }}>
                        Last seen: {device.lastSeen.toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Real-time Data */}
                    {device.data && (
                      <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ margin: '0 0 10px 0' }}>📊 Live Data</h5>
                        <div style={{
                          background: 'rgba(0, 0, 0, 0.2)',
                          padding: '10px',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}>
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(device.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Command Interface */}
                    {device.type === 'actuator' && (
                      <div>
                        <h5 style={{ margin: '0 0 10px 0' }}>🎮 Send Command</h5>
                        <textarea
                          value={commandInput}
                          onChange={(e) => setCommandInput(e.target.value)}
                          placeholder='{"brightness": 80, "status": "on"}'
                          style={{
                            width: '100%',
                            height: '80px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            padding: '10px',
                            color: 'white',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            resize: 'none'
                          }}
                        />
                        <motion.button
                          onClick={() => handleSendCommand(device.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            marginTop: '10px',
                            width: '100%',
                            padding: '10px',
                            background: 'linear-gradient(45deg, #06b6d4, #3b82f6)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          📡 Send Command
                        </motion.button>
                      </div>
                    )}

                    {/* Quick Actions for Street Light */}
                    {device.id === 'city-001' && (
                      <div style={{ marginTop: '15px' }}>
                        <h5 style={{ margin: '0 0 10px 0' }}>⚡ Quick Actions</h5>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {[
                            { label: 'Turn On', cmd: '{"status": "on", "brightness": 100}' },
                            { label: 'Turn Off', cmd: '{"status": "off", "brightness": 0}' },
                            { label: 'Dim 50%', cmd: '{"brightness": 50}' },
                            { label: 'Bright', cmd: '{"brightness": 100}' }
                          ].map((action, idx) => (
                            <motion.button
                              key={idx}
                              onClick={() => {
                                setCommandInput(action.cmd);
                                setTimeout(() => handleSendCommand(device.id), 100);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(34, 197, 94, 0.2)',
                                border: '1px solid rgba(34, 197, 94, 0.5)',
                                borderRadius: '15px',
                                color: 'white',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              {action.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              opacity: 0.5
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
              <div>Select a device to view details and controls</div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Messages */}
      <div style={{
        marginTop: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>📨 Recent LoRa Messages</h3>
        
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          fontSize: '12px'
        }}>
          {recentMessages.map((message, index) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                borderRadius: '4px',
                marginBottom: '2px'
              }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{
                  background: message.messageType === 'uplink' ? '#22c55e' : '#f59e0b',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '10px'
                }}>
                  {message.messageType.toUpperCase()}
                </span>
                
                <span style={{ fontWeight: 'bold' }}>
                  {devices.find(d => d.id === message.deviceId)?.name || message.deviceId}
                </span>
                
                <span style={{ opacity: 0.7 }}>
                  {message.frequency} MHz • {message.dataRate}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ opacity: 0.7 }}>
                  RSSI: {message.rssi} dBm
                </span>
                <span style={{ opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default LoRaConnectUltra;
