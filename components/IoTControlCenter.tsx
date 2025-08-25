/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Power, PowerOff, Settings, Activity, Zap, Thermometer, Camera, Lock } from 'lucide-react';

interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'camera' | 'thermostat' | 'security';
  status: 'online' | 'offline' | 'maintenance';
  value?: string | number;
  unit?: string;
  location: string;
  lastSeen: Date;
  controlEnabled: boolean;
}

const IoTControlCenter: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'temp-001',
      name: 'Temperature Sensor',
      type: 'sensor',
      status: 'online',
      value: 22.5,
      unit: '°C',
      location: 'Living Room',
      lastSeen: new Date(),
      controlEnabled: false
    },
    {
      id: 'light-001',
      name: 'Smart Light',
      type: 'actuator',
      status: 'online',
      value: 'ON',
      location: 'Bedroom',
      lastSeen: new Date(),
      controlEnabled: true
    },
    {
      id: 'cam-001',
      name: 'Security Camera',
      type: 'camera',
      status: 'online',
      value: 'Recording',
      location: 'Front Door',
      lastSeen: new Date(),
      controlEnabled: true
    },
    {
      id: 'thermo-001',
      name: 'Smart Thermostat',
      type: 'thermostat',
      status: 'online',
      value: 20,
      unit: '°C',
      location: 'Hall',
      lastSeen: new Date(),
      controlEnabled: true
    },
    {
      id: 'lock-001',
      name: 'Smart Lock',
      type: 'security',
      status: 'offline',
      value: 'LOCKED',
      location: 'Main Door',
      lastSeen: new Date(Date.now() - 300000),
      controlEnabled: true
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => {
        if (device.type === 'sensor' && device.status === 'online') {
          return {
            ...device,
            value: Math.round((Math.random() * 10 + 18) * 10) / 10,
            lastSeen: new Date()
          };
        }
        return device;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId && device.controlEnabled) {
        if (device.type === 'actuator') {
          return {
            ...device,
            value: device.value === 'ON' ? 'OFF' : 'ON',
            lastSeen: new Date()
          };
        }
        if (device.type === 'security') {
          return {
            ...device,
            value: device.value === 'LOCKED' ? 'UNLOCKED' : 'LOCKED',
            lastSeen: new Date()
          };
        }
      }
      return device;
    }));
  };

  const getDeviceIcon = (type: string, status: string) => {
    if (status === 'offline') return <WifiOff className="w-5 h-5 text-red-500" />;
    
    switch (type) {
      case 'sensor':
        return <Thermometer className="w-5 h-5 text-blue-500" />;
      case 'actuator':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-purple-500" />;
      case 'thermostat':
        return <Activity className="w-5 h-5 text-green-500" />;
      case 'security':
        return <Lock className="w-5 h-5 text-red-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-green-400 bg-green-50';
      case 'offline':
        return 'border-red-400 bg-red-50';
      case 'maintenance':
        return 'border-yellow-400 bg-yellow-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          IoT Control Center
        </h2>
        <p className="text-gray-600 mt-2">Monitor and control your connected devices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Online Devices</p>
              <p className="text-2xl font-bold text-green-800">
                {devices.filter(d => d.status === 'online').length}
              </p>
            </div>
            <Wifi className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Offline Devices</p>
              <p className="text-2xl font-bold text-red-800">
                {devices.filter(d => d.status === 'offline').length}
              </p>
            </div>
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Controllable</p>
              <p className="text-2xl font-bold text-blue-800">
                {devices.filter(d => d.controlEnabled).length}
              </p>
            </div>
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Active Sensors</p>
              <p className="text-2xl font-bold text-purple-800">
                {devices.filter(d => d.type === 'sensor' && d.status === 'online').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device, index) => (
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
                {getDeviceIcon(device.type, device.status)}
                <h3 className="font-semibold text-gray-800">{device.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                device.status === 'online' ? 'bg-green-100 text-green-800' :
                device.status === 'offline' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {device.status}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">📍 {device.location}</p>
              <p className="text-lg font-bold text-gray-800">
                {device.value} {device.unit || ''}
              </p>
              <p className="text-xs text-gray-500">
                Last seen: {device.lastSeen.toLocaleTimeString()}
              </p>
            </div>

            {device.controlEnabled && device.status === 'online' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDevice(device.id);
                }}
                className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                {device.type === 'actuator' && (
                  <>
                    {device.value === 'ON' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    <span>{device.value === 'ON' ? 'Turn Off' : 'Turn On'}</span>
                  </>
                )}
                {device.type === 'security' && (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{device.value === 'LOCKED' ? 'Unlock' : 'Lock'}</span>
                  </>
                )}
                {device.type === 'camera' && (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>View Stream</span>
                  </>
                )}
                {device.type === 'thermostat' && (
                  <>
                    <Settings className="w-4 h-4" />
                    <span>Adjust</span>
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Turn On All Lights
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Emergency Lock All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Scan Network
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Report
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default IoTControlCenter;
