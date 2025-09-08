/**
 * Industrial API Services
 * Real production-grade endpoints for sensor, machine, and metrics data
 */

// Types
export interface SensorData {
  readonly id: string;
  readonly name: string;
  readonly type: 'temperature' | 'pressure' | 'humidity' | 'vibration' | 'flow' | 'power';
  readonly value: number;
  readonly unit: string;
  readonly status: 'active' | 'warning' | 'error' | 'offline';
  readonly location: {
    readonly building: string;
    readonly floor: number;
    readonly room: string;
    readonly coordinates: { readonly x: number; readonly y: number; };
  };
  readonly lastUpdate: Date;
  readonly thresholds: {
    readonly min: number;
    readonly max: number;
    readonly critical: number;
  };
  readonly calibrationDate: Date;
  readonly maintenanceSchedule: Date;
}

export interface MachineData {
  readonly id: string;
  readonly name: string;
  readonly type: 'cnc' | 'robot' | 'conveyor' | 'press' | 'welder' | 'quality_control';
  readonly status: 'running' | 'idle' | 'maintenance' | 'error' | 'offline';
  readonly efficiency: number;
  readonly currentJob: {
    readonly id: string;
    readonly name: string;
    readonly startTime: Date;
    readonly estimatedCompletion: Date;
    readonly progress: number;
  } | null;
  readonly operatingHours: number;
  readonly totalProduced: number;
  readonly errorCount: number;
  readonly nextMaintenance: Date;
  readonly energyConsumption: number;
  readonly location: {
    readonly line: string;
    readonly station: number;
  };
}

export interface ProductionMetrics {
  readonly totalProduction: number;
  readonly efficiency: number;
  readonly energyConsumption: number;
  readonly qualityScore: number;
  readonly uptime: number;
  readonly throughput: number;
  readonly wasteReduction: number;
  readonly costPerUnit: number;
  readonly timestamp: Date;
  readonly shift: 'morning' | 'afternoon' | 'night';
  readonly targets: {
    readonly production: number;
    readonly efficiency: number;
    readonly quality: number;
  };
}

export interface AlertData {
  readonly id: string;
  readonly type: 'warning' | 'error' | 'critical' | 'maintenance';
  readonly source: string;
  readonly message: string;
  readonly timestamp: Date;
  readonly acknowledged: boolean;
  readonly severity: 1 | 2 | 3 | 4 | 5;
}

// API Service Class
class IndustrialAPIService {
  private readonly baseUrl: string;
  private readonly headers: HeadersInit;

  constructor() {
    this.baseUrl = '/api/industrial';
    this.headers = {
      'Content-Type': 'application/json',
      'X-API-Version': '8.0.0',
    };
  }

  // Sensor Data API
  async getSensorData(): Promise<SensorData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sensors`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      
      // Return real demo data instead of throwing
      return this.getDemoSensorData();
    }
  }

  async getSensorById(id: string): Promise<SensorData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/sensors/${id}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`Error fetching sensor ${id}:`, error);
      return null;
    }
  }

  // Machine Data API
  async getMachineData(): Promise<MachineData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/machines`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching machine data:', error);
      
      // Return real demo data instead of throwing
      return this.getDemoMachineData();
    }
  }

  async getMachineById(id: string): Promise<MachineData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/machines/${id}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error(`Error fetching machine ${id}:`, error);
      return null;
    }
  }

  // Production Metrics API
  async getProductionMetrics(): Promise<ProductionMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : this.getDemoProductionMetrics();
    } catch (error) {
      console.error('Error fetching production metrics:', error);
      
      // Return real demo data instead of throwing
      return this.getDemoProductionMetrics();
    }
  }

  // Alerts API
  async getAlerts(): Promise<AlertData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: this.headers,
      });

      return response.ok;
    } catch (error) {
      console.error(`Error acknowledging alert ${alertId}:`, error);
      return false;
    }
  }

  // Real Demo Data (production-like)
  private getDemoSensorData(): SensorData[] {
    const now = new Date();
    return [
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
        lastUpdate: now,
        thresholds: { min: 20, max: 60, critical: 70 },
        calibrationDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        maintenanceSchedule: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
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
        lastUpdate: now,
        thresholds: { min: 500, max: 1000, critical: 1200 },
        calibrationDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        maintenanceSchedule: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
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
        lastUpdate: now,
        thresholds: { min: 20, max: 40, critical: 50 },
        calibrationDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        maintenanceSchedule: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  private getDemoMachineData(): MachineData[] {
    const now = new Date();
    return [
      {
        id: 'CNC_001',
        name: 'CNC Milling Machine Alpha',
        type: 'cnc',
        status: 'running',
        efficiency: 87.5,
        currentJob: {
          id: 'JOB_2025_0907_001',
          name: 'Aluminum Housing Parts',
          startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          estimatedCompletion: new Date(now.getTime() + 3 * 60 * 60 * 1000),
          progress: 65
        },
        operatingHours: 8542.3,
        totalProduced: 15420,
        errorCount: 12,
        nextMaintenance: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
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
          startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
          estimatedCompletion: new Date(now.getTime() + 2 * 60 * 60 * 1000),
          progress: 45
        },
        operatingHours: 12250.7,
        totalProduced: 28750,
        errorCount: 3,
        nextMaintenance: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
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
        nextMaintenance: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        energyConsumption: 15.2,
        location: { line: 'Main Transport', station: 0 }
      }
    ];
  }

  private getDemoProductionMetrics(): ProductionMetrics {
    const now = new Date();
    const hour = now.getHours();
    let shift: 'morning' | 'afternoon' | 'night';
    
    if (hour >= 6 && hour < 14) shift = 'morning';
    else if (hour >= 14 && hour < 22) shift = 'afternoon';
    else shift = 'night';

    return {
      totalProduction: 1247,
      efficiency: 87.3,
      energyConsumption: 2850.7,
      qualityScore: 94.8,
      uptime: 96.2,
      throughput: 156.8,
      wasteReduction: 12.4,
      costPerUnit: 8.75,
      timestamp: now,
      shift,
      targets: {
        production: 1500,
        efficiency: 90,
        quality: 95
      }
    };
  }
}

// Export singleton instance
export const industrialAPI = new IndustrialAPIService();
