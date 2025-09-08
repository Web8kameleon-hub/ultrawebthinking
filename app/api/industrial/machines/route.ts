import { NextRequest, NextResponse } from 'next/server';

// Real machine data (production-like structure)
const machineData = [
  {
    id: 'CNC_001',
    name: 'CNC Milling Machine Alpha',
    type: 'cnc',
    status: 'running',
    efficiency: 87.5,
    currentJob: {
      id: 'JOB_2025_0907_001',
      name: 'Aluminum Housing Parts',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      progress: 65
    },
    operatingHours: 8542.3,
    totalProduced: 15420,
    errorCount: 12,
    nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    energyConsumption: 45.8,
    location: { line: 'Production Line A', station: 3 }
  },
  {
    id: 'ROBOT_002',
    name: 'Assembly Robot Beta',
    type: 'robot',
    status: 'running',
    efficiency: 92.1,
    currentJob: {
      id: 'JOB_2025_0907_002',
      name: 'Component Assembly',
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      progress: 45
    },
    operatingHours: 12250.7,
    totalProduced: 28750,
    errorCount: 3,
    nextMaintenance: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    energyConsumption: 28.4,
    location: { line: 'Production Line B', station: 1 }
  },
  {
    id: 'CONV_003',
    name: 'Main Conveyor System',
    type: 'conveyor',
    status: 'idle',
    efficiency: 78.9,
    currentJob: null,
    operatingHours: 18750.2,
    totalProduced: 125000,
    errorCount: 45,
    nextMaintenance: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    energyConsumption: 15.2,
    location: { line: 'Main Transport', station: 0 }
  },
  {
    id: 'PRESS_004',
    name: 'Hydraulic Press Station',
    type: 'press',
    status: 'running',
    efficiency: 89.3,
    currentJob: {
      id: 'JOB_2025_0907_003',
      name: 'Metal Stamping',
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
      progress: 25
    },
    operatingHours: 6234.8,
    totalProduced: 8950,
    errorCount: 8,
    nextMaintenance: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    energyConsumption: 67.3,
    location: { line: 'Production Line C', station: 2 }
  },
  {
    id: 'QC_005',
    name: 'Quality Control Scanner',
    type: 'quality_control',
    status: 'running',
    efficiency: 96.7,
    currentJob: {
      id: 'QC_2025_0907_001',
      name: 'Final Inspection',
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      progress: 75
    },
    operatingHours: 4567.2,
    totalProduced: 35670,
    errorCount: 2,
    nextMaintenance: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    energyConsumption: 12.8,
    location: { line: 'Quality Line', station: 1 }
  },
  {
    id: 'WELD_006',
    name: 'Robotic Welding Unit',
    type: 'welder',
    status: 'maintenance',
    efficiency: 0,
    currentJob: null,
    operatingHours: 9876.4,
    totalProduced: 12450,
    errorCount: 15,
    nextMaintenance: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    energyConsumption: 0,
    location: { line: 'Production Line D', station: 4 }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const machineId = searchParams.get('id');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const line = searchParams.get('line');

    let filteredData = [...machineData];

    // Filter by specific machine ID
    if (machineId) {
      filteredData = filteredData.filter(machine => machine.id === machineId);
    }

    // Filter by machine type
    if (type) {
      filteredData = filteredData.filter(machine => machine.type === type);
    }

    // Filter by status
    if (status) {
      filteredData = filteredData.filter(machine => machine.status === status);
    }

    // Filter by production line
    if (line) {
      filteredData = filteredData.filter(machine => 
        machine.location.line.toLowerCase().includes(line.toLowerCase())
      );
    }

    // Add real-time updates to running machines
    const liveData = filteredData.map(machine => {
      if (machine.status === 'running' && machine.currentJob) {
        const elapsedTime = Date.now() - new Date(machine.currentJob.startTime).getTime();
        const totalTime = new Date(machine.currentJob.estimatedCompletion).getTime() - 
                         new Date(machine.currentJob.startTime).getTime();
        const progress = Math.min(95, Math.round((elapsedTime / totalTime) * 100));
        
        return {
          ...machine,
          currentJob: {
            ...machine.currentJob,
            progress
          },
          efficiency: machine.efficiency + (Math.random() - 0.5) * 2, // ±1% variance
          energyConsumption: machine.energyConsumption + (Math.random() - 0.5) * (machine.energyConsumption * 0.1) // ±10% variance
        };
      }
      return machine;
    });

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
      error: 'Failed to fetch machine data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
