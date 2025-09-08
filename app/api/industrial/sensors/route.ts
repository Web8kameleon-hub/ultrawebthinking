import { NextRequest, NextResponse } from 'next/server';

// Real sensor data (production-like structure)
const sensorData = [
  {
    id: 'TEMP_001',
    name: 'Main Assembly Temperature',
    type: 'temperature',
    value: 45.3,
    unit: '°C',
    status: 'active',
    location: {
      building: 'Manufacturing A',
      floor: 1,
      room: 'Assembly Line 1',
      coordinates: { x: 120, y: 80 }
    },
    lastUpdate: new Date().toISOString(),
    thresholds: { min: 20, max: 60, critical: 70 },
    calibrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    maintenanceSchedule: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'PRESS_002',
    name: 'Hydraulic Pressure Line 2',
    type: 'pressure',
    value: 850.7,
    unit: 'PSI',
    status: 'active',
    location: {
      building: 'Manufacturing A',
      floor: 1,
      room: 'Press Station',
      coordinates: { x: 200, y: 150 }
    },
    lastUpdate: new Date().toISOString(),
    thresholds: { min: 500, max: 1000, critical: 1200 },
    calibrationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    maintenanceSchedule: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'FLOW_003',
    name: 'Coolant Flow Rate',
    type: 'flow',
    value: 25.8,
    unit: 'L/min',
    status: 'warning',
    location: {
      building: 'Manufacturing A',
      floor: 1,
      room: 'CNC Station',
      coordinates: { x: 180, y: 220 }
    },
    lastUpdate: new Date().toISOString(),
    thresholds: { min: 20, max: 40, critical: 50 },
    calibrationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    maintenanceSchedule: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'VIB_004',
    name: 'Motor Vibration Sensor',
    type: 'vibration',
    value: 2.1,
    unit: 'mm/s',
    status: 'active',
    location: {
      building: 'Manufacturing A',
      floor: 1,
      room: 'Motor Station',
      coordinates: { x: 250, y: 180 }
    },
    lastUpdate: new Date().toISOString(),
    thresholds: { min: 0, max: 5, critical: 8 },
    calibrationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    maintenanceSchedule: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'POW_005',
    name: 'Power Consumption Monitor',
    type: 'power',
    value: 124.7,
    unit: 'kW',
    status: 'active',
    location: {
      building: 'Manufacturing A',
      floor: 1,
      room: 'Main Panel',
      coordinates: { x: 50, y: 50 }
    },
    lastUpdate: new Date().toISOString(),
    thresholds: { min: 50, max: 200, critical: 250 },
    calibrationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    maintenanceSchedule: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sensorId = searchParams.get('id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let filteredData = [...sensorData];

    // Filter by specific sensor ID
    if (sensorId) {
      filteredData = filteredData.filter(sensor => sensor.id === sensorId);
    }

    // Filter by sensor type
    if (type) {
      filteredData = filteredData.filter(sensor => sensor.type === type);
    }

    // Filter by status
    if (status) {
      filteredData = filteredData.filter(sensor => sensor.status === status);
    }

    // Add some real-time variance to values (simulate live data)
    const liveData = filteredData.map(sensor => ({
      ...sensor,
      value: sensor.value + (Math.random() - 0.5) * (sensor.value * 0.05), // ±5% variance
      lastUpdate: new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: liveData,
      totalCount: liveData.length,
      timestamp: new Date().toISOString(),
      apiVersion: '8.0.0'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sensor data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
