/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Router, 
  Monitor, 
  Wifi, 
  Power, 
  PowerOff, 
  Settings, 
  Trash2, 
  Plus, 
  Edit, 
  Bluetooth,
  Zap,
  Camera,
  Mic,
  Speaker,
  HardDrive,
  Cpu,
  Battery,
  RefreshCw
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'smartphone' | 'tablet' | 'laptop' | 'desktop' | 'router' | 'camera' | 'speaker' | 'sensor' | 'gateway';
  brand: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  connectivity: 'wifi' | 'ethernet' | 'bluetooth' | 'lora' | 'zigbee';
  ipAddress?: string;
  macAddress: string;
  batteryLevel?: number;
  lastSeen: Date;
  location: string;
  firmware: string;
  capabilities: string[];
  isManaged: boolean;
}

const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'dev-001',
      name: 'iPhone 15 Pro',
      type: 'smartphone',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      status: 'online',
      connectivity: 'wifi',
      ipAddress: '192.168.1.101',
      macAddress: '00:1B:44:11:3A:B7',
      batteryLevel: 87,
      lastSeen: new Date(),
      location: 'Living Room',
      firmware: 'iOS 17.1',
      capabilities: ['Camera', 'Microphone', 'GPS', 'NFC'],
      isManaged: true
    },
    {
      id: 'dev-002',
      name: 'MacBook Pro M3',
      type: 'laptop',
      brand: 'Apple',
      model: 'MacBook Pro 16"',
      status: 'online',
      connectivity: 'wifi',
      ipAddress: '192.168.1.102',
      macAddress: '00:1B:44:11:3A:B8',
      batteryLevel: 45,
      lastSeen: new Date(),
      location: 'Office',
      firmware: 'macOS Sonoma 14.1',
      capabilities: ['Camera', 'Microphone', 'USB-C', 'Thunderbolt'],
      isManaged: true
    },
    {
      id: 'dev-003',
      name: 'Security Camera',
      type: 'camera',
      brand: 'Hikvision',
      model: 'DS-2CD2043G2-I',
      status: 'online',
      connectivity: 'ethernet',
      ipAddress: '192.168.1.201',
      macAddress: '00:1B:44:11:3A:C1',
      lastSeen: new Date(),
      location: 'Front Door',
      firmware: 'V5.7.3',
      capabilities: ['4K Recording', 'Night Vision', 'Motion Detection', 'Audio'],
      isManaged: true
    },
    {
      id: 'dev-004',
      name: 'LoRa Gateway',
      type: 'gateway',
      brand: 'RAK',
      model: 'RAK7268',
      status: 'online',
      connectivity: 'lora',
      ipAddress: '192.168.1.202',
      macAddress: '00:1B:44:11:3A:D1',
      lastSeen: new Date(),
      location: 'Roof',
      firmware: 'v1.2.5',
      capabilities: ['LoRaWAN', 'GPS', 'LTE', 'Ethernet'],
      isManaged: true
    },
    {
      id: 'dev-005',
      name: 'Smart Speaker',
      type: 'speaker',
      brand: 'Amazon',
      model: 'Echo Dot 5th Gen',
      status: 'offline',
      connectivity: 'wifi',
      macAddress: '00:1B:44:11:3A:E1',
      lastSeen: new Date(Date.now() - 300000),
      location: 'Bedroom',
      firmware: 'v2.1.0',
      capabilities: ['Voice Control', 'Music Streaming', 'Smart Home Hub'],
      isManaged: false
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Simulate real-time device updates
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => {
        if (device.status === 'online' && device.batteryLevel !== undefined) {
          return {
            ...device,
            batteryLevel: Math.max(0, device.batteryLevel - Math.random() * 0.5),
            lastSeen: new Date()
          };
        }
        return device;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const scanForDevices = () => {
    setIsScanning(true);
    console.log('🔍 Scanning for new devices...');
    
    setTimeout(() => {
      // Simulate finding a new device
      const newDevice: Device = {
        id: `dev-${Date.now()}`,
        name: 'New Smart Sensor',
        type: 'sensor',
        brand: 'Generic',
        model: 'TH-001',
        status: 'online',
        connectivity: 'zigbee',
        macAddress: `00:1B:44:11:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
        batteryLevel: Math.floor(Math.random() * 100),
        lastSeen: new Date(),
        location: 'Unknown',
        firmware: 'v1.0.0',
        capabilities: ['Temperature', 'Humidity'],
        isManaged: false
      };
      
      setDevices(prev => [...prev, newDevice]);
      setIsScanning(false);
      console.log('✅ Device scan completed');
    }, 3000);
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newStatus = device.status === 'online' ? 'offline' : 'online';
        return {
          ...device,
          status: newStatus,
          lastSeen: new Date()
        };
      }
      return device;
    }));
  };

  const removeDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
    if (selectedDevice === deviceId) {
      setSelectedDevice(null);
    }
  };

  const toggleManagement = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return { ...device, isManaged: !device.isManaged };
      }
      return device;
    }));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'tablet':
        return <Monitor className="w-6 h-6" />;
      case 'laptop':
      case 'desktop':
        return <Monitor className="w-6 h-6" />;
      case 'router':
      case 'gateway':
        return <Router className="w-6 h-6" />;
      case 'camera':
        return <Camera className="w-6 h-6" />;
      case 'speaker':
        return <Speaker className="w-6 h-6" />;
      case 'sensor':
        return <Zap className="w-6 h-6" />;
      default:
        return <HardDrive className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500 bg-green-100 border-green-200';
      case 'offline':
        return 'text-red-500 bg-red-100 border-red-200';
      case 'maintenance':
        return 'text-yellow-500 bg-yellow-100 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-200 border-red-300';
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200';
    }
  };

  const filteredDevices = devices.filter(device => {
    if (filterStatus !== 'all' && device.status !== filterStatus) return false;
    if (filterType !== 'all' && device.type !== filterType) return false;
    return true;
  });

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const managedDevices = devices.filter(d => d.isManaged).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Device Manager
        </h2>
        <p className="text-gray-600 mt-2">Manage and monitor all connected devices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Devices</p>
              <p className="text-2xl font-bold text-blue-800">{devices.length}</p>
            </div>
            <HardDrive className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Online</p>
              <p className="text-2xl font-bold text-green-800">{onlineDevices}</p>
            </div>
            <Power className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Managed</p>
              <p className="text-2xl font-bold text-purple-800">{managedDevices}</p>
            </div>
            <Settings className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Types</p>
              <p className="text-2xl font-bold text-orange-800">{new Set(devices.map(d => d.type)).size}</p>
            </div>
            <Cpu className="w-8 h-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg border">
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
            <option value="error">Error</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="smartphone">Smartphones</option>
            <option value="laptop">Laptops</option>
            <option value="camera">Cameras</option>
            <option value="router">Routers</option>
            <option value="speaker">Speakers</option>
            <option value="sensor">Sensors</option>
          </select>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scanForDevices}
            disabled={isScanning}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Devices'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Device</span>
          </motion.button>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${getStatusColor(device.status)} ${
              selectedDevice === device.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getDeviceIcon(device.type)}
                <h3 className="font-semibold text-gray-800">{device.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                {device.isManaged && <Settings className="w-4 h-4 text-blue-500" />}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  device.status === 'online' ? 'bg-green-100 text-green-800' :
                  device.status === 'offline' ? 'bg-red-100 text-red-800' :
                  device.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {device.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Brand:</span> {device.brand} {device.model}</p>
              <p><span className="font-medium">Location:</span> {device.location}</p>
              <p><span className="font-medium">Connectivity:</span> {device.connectivity.toUpperCase()}</p>
              {device.ipAddress && (
                <p><span className="font-medium">IP:</span> {device.ipAddress}</p>
              )}
              {device.batteryLevel !== undefined && (
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        device.batteryLevel > 50 ? 'bg-green-500' :
                        device.batteryLevel > 20 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${device.batteryLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{Math.round(device.batteryLevel)}%</span>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Last seen: {device.lastSeen.toLocaleTimeString()}
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDeviceStatus(device.id);
                }}
                className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                  device.status === 'online' ? 
                  'bg-red-600 text-white hover:bg-red-700' :
                  'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {device.status === 'online' ? <PowerOff className="w-3 h-3" /> : <Power className="w-3 h-3" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleManagement(device.id);
                }}
                className={`flex-1 py-2 px-3 rounded text-xs font-medium transition-colors ${
                  device.isManaged ?
                  'bg-purple-600 text-white hover:bg-purple-700' :
                  'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <Settings className="w-3 h-3" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeDevice(device.id);
                }}
                className="py-2 px-3 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Device Details */}
      {selectedDevice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border shadow-lg"
        >
          {(() => {
            const device = devices.find(d => d.id === selectedDevice);
            if (!device) return null;

            return (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Device Details: {device.name}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">MAC Address</p>
                    <p className="font-medium">{device.macAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Firmware</p>
                    <p className="font-medium">{device.firmware}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Connectivity</p>
                    <p className="font-medium">{device.connectivity.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Management Status</p>
                    <p className="font-medium">{device.isManaged ? 'Managed' : 'Unmanaged'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Update</p>
                    <p className="font-medium">{device.lastSeen.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {device.capabilities.map(capability => (
                      <span
                        key={capability}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default DeviceManager;
