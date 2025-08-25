/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Thermometer, Droplets, Wind, Sun, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface SensorData {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'light' | 'motion' | 'air_quality' | 'sound' | 'vibration';
  value: number;
  unit: string;
  location: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: Date;
  history: { timestamp: Date; value: number; }[];
  thresholds: { min: number; max: number; };
}

const SensorDashboard: React.FC = () => {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: 'temp-001',
      name: 'Main Hall Temperature',
      type: 'temperature',
      value: 22.5,
      unit: '°C',
      location: 'Main Hall',
      status: 'normal',
      trend: 'stable',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 18, max: 26 }
    },
    {
      id: 'hum-001',
      name: 'Office Humidity',
      type: 'humidity',
      value: 45,
      unit: '%',
      location: 'Office',
      status: 'normal',
      trend: 'up',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 30, max: 70 }
    },
    {
      id: 'light-001',
      name: 'Workspace Light Level',
      type: 'light',
      value: 750,
      unit: 'lux',
      location: 'Workspace',
      status: 'normal',
      trend: 'down',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 300, max: 1000 }
    },
    {
      id: 'air-001',
      name: 'Air Quality Monitor',
      type: 'air_quality',
      value: 85,
      unit: 'AQI',
      location: 'Living Room',
      status: 'warning',
      trend: 'up',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 0, max: 50 }
    },
    {
      id: 'sound-001',
      name: 'Noise Level',
      type: 'sound',
      value: 42,
      unit: 'dB',
      location: 'Bedroom',
      status: 'normal',
      trend: 'stable',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 0, max: 60 }
    },
    {
      id: 'motion-001',
      name: 'Motion Sensor',
      type: 'motion',
      value: 1,
      unit: 'detected',
      location: 'Entrance',
      status: 'normal',
      trend: 'stable',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 0, max: 1 }
    }
  ]);

  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('1h');

  useEffect(() => {
    // Simulate real-time sensor updates
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => {
        let newValue = sensor.value;
        let newStatus = sensor.status;
        let newTrend = sensor.trend;

        // Simulate value changes based on sensor type
        switch (sensor.type) {
          case 'temperature':
            newValue = Math.max(15, Math.min(30, sensor.value + (Math.random() - 0.5) * 2));
            break;
          case 'humidity':
            newValue = Math.max(20, Math.min(80, sensor.value + (Math.random() - 0.5) * 5));
            break;
          case 'light':
            newValue = Math.max(0, Math.min(1200, sensor.value + (Math.random() - 0.5) * 100));
            break;
          case 'air_quality':
            newValue = Math.max(0, Math.min(150, sensor.value + (Math.random() - 0.5) * 10));
            break;
          case 'sound':
            newValue = Math.max(20, Math.min(80, sensor.value + (Math.random() - 0.5) * 8));
            break;
          case 'motion':
            newValue = Math.random() > 0.9 ? 1 : 0;
            break;
        }

        // Determine status based on thresholds
        if (newValue < sensor.thresholds.min || newValue > sensor.thresholds.max) {
          newStatus = 'critical';
        } else if (Math.abs(newValue - sensor.thresholds.min) < (sensor.thresholds.max - sensor.thresholds.min) * 0.1 ||
                   Math.abs(newValue - sensor.thresholds.max) < (sensor.thresholds.max - sensor.thresholds.min) * 0.1) {
          newStatus = 'warning';
        } else {
          newStatus = 'normal';
        }

        // Determine trend
        if (newValue > sensor.value + 0.1) {
          newTrend = 'up';
        } else if (newValue < sensor.value - 0.1) {
          newTrend = 'down';
        } else {
          newTrend = 'stable';
        }

        // Update history
        const newHistory = [
          ...sensor.history.slice(-19), // Keep last 20 entries
          { timestamp: new Date(), value: newValue }
        ];

        return {
          ...sensor,
          value: Math.round(newValue * 10) / 10,
          status: newStatus,
          trend: newTrend,
          lastUpdate: new Date(),
          history: newHistory
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="w-6 h-6" />;
      case 'humidity':
        return <Droplets className="w-6 h-6" />;
      case 'pressure':
        return <Activity className="w-6 h-6" />;
      case 'light':
        return <Sun className="w-6 h-6" />;
      case 'motion':
        return <Eye className="w-6 h-6" />;
      case 'air_quality':
        return <Wind className="w-6 h-6" />;
      case 'sound':
        return <Activity className="w-6 h-6" />;
      case 'vibration':
        return <Activity className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-500 bg-green-100 border-green-200';
      case 'warning':
        return 'text-yellow-500 bg-yellow-100 border-yellow-200';
      case 'critical':
        return 'text-red-500 bg-red-100 border-red-200';
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <div className="w-4 h-4 border-t-2 border-gray-400"></div>;
      default:
        return null;
    }
  };

  const normalSensors = sensors.filter(s => s.status === 'normal').length;
  const warningSensors = sensors.filter(s => s.status === 'warning').length;
  const criticalSensors = sensors.filter(s => s.status === 'critical').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sensor Dashboard
        </h2>
        <p className="text-gray-600 mt-2">Real-time environmental monitoring and analytics</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Sensors</p>
              <p className="text-2xl font-bold text-blue-800">{sensors.length}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Normal</p>
              <p className="text-2xl font-bold text-green-800">{normalSensors}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Warning</p>
              <p className="text-2xl font-bold text-yellow-800">{warningSensors}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Critical</p>
              <p className="text-2xl font-bold text-red-800">{criticalSensors}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor, index) => (
          <motion.div
            key={sensor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${getStatusColor(sensor.status)} ${
              selectedSensor === sensor.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedSensor(selectedSensor === sensor.id ? null : sensor.id)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getSensorIcon(sensor.type)}
                <h3 className="font-semibold text-gray-800">{sensor.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(sensor.trend)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sensor.status === 'normal' ? 'bg-green-100 text-green-800' :
                  sensor.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {sensor.status}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">📍 {sensor.location}</p>
              <p className="text-3xl font-bold text-gray-800">
                {sensor.value} <span className="text-lg text-gray-600">{sensor.unit}</span>
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Min: {sensor.thresholds.min}{sensor.unit}</span>
                <span>Max: {sensor.thresholds.max}{sensor.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    sensor.status === 'normal' ? 'bg-green-500' :
                    sensor.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, 
                      ((sensor.value - sensor.thresholds.min) / (sensor.thresholds.max - sensor.thresholds.min)) * 100
                    ))}%`
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                Last update: {sensor.lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Historical Chart for Selected Sensor */}
      {selectedSensor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border shadow-lg"
        >
          {(() => {
            const sensor = sensors.find(s => s.id === selectedSensor);
            if (!sensor) return null;

            return (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {sensor.name} - Historical Data
                  </h3>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                  </select>
                </div>
                
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <svg width="100%" height="100%" className="overflow-visible">
                    {sensor.history.length > 1 && (
                      <motion.polyline
                        points={sensor.history.map((point, i) => 
                          `${(i / (sensor.history.length - 1)) * 100}%,${100 - ((point.value - sensor.thresholds.min) / (sensor.thresholds.max - sensor.thresholds.min)) * 80}%`
                        ).join(' ')}
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                      />
                    )}
                  </svg>
                  {sensor.history.length === 0 && (
                    <p className="text-gray-500">Collecting data...</p>
                  )}
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-3">Sensor Management</h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Calibrate All
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Export Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Set Alerts
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Generate Report
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SensorDashboard;
