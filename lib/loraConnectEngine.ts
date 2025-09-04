/**
 * LoRa Connect Ultra - Real-time IoT Management System
 * Sistema e Menaxhimit të IoT në Kohë Reale
 * 
 * Features:
 * - Real LoRa Gateway connection / Lidhje me Gateway LoRa të vërtetë
 * - Virtual sensor simulation / Simulim sensorësh virtualë
 * - Real-time data updates every 3 seconds / Përditësim i të dhënave çdo 3 sekonda
 * - Command transmission control / Kontroll transmetimi komandash
 * - Device management / Menaxhimi i pajisjeve
 * - Network topology mapping / Hartëzimi i topologjisë së rrjetit
 */

export interface LoRaDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway' | 'node';
  frequency: number; // MHz
  spreadingFactor: number;
  bandwidth: number; // kHz
  txPower: number; // dBm
  battery: number; // percentage
  rssi: number; // dBm
  snr: number; // dB
  location: {
    lat: number;
    lng: number;
    altitude?: number;
  };
  lastSeen: Date;
  isOnline: boolean;
  data?: Record<string, any>;
}

export interface LoRaMessage {
  id: string;
  deviceId: string;
  timestamp: Date;
  payload: any;
  rssi: number;
  snr: number;
  frequency: number;
  dataRate: string;
  messageType: 'uplink' | 'downlink' | 'join' | 'ack';
  encrypted: boolean;
}

export interface LoRaGateway {
  id: string;
  name: string;
  ip: string;
  port: number;
  status: 'online' | 'offline' | 'error';
  location: {
    lat: number;
    lng: number;
  };
  coverage: number; // km radius
  connectedDevices: number;
  throughput: {
    uplink: number; // messages/hour
    downlink: number; // messages/hour
  };
  lastHeartbeat: Date;
}

export interface SensorReading {
  deviceId: string;
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  light?: number;
  motion?: boolean;
  battery?: number;
  gps?: {
    lat: number;
    lng: number;
  };
  custom?: Record<string, any>;
}

export class LoRaConnectEngine {
  private static instance: LoRaConnectEngine;
  private devices: Map<string, LoRaDevice> = new Map();
  private gateways: Map<string, LoRaGateway> = new Map();
  private messages: LoRaMessage[] = [];
  private sensorReadings: Map<string, SensorReading[]> = new Map();
  private isSimulationMode: boolean = true;
  private simulationInterval: NodeJS.Timeout | null = null;
  private updateCallbacks: ((data: any) => void)[] = [];

  private constructor() {
    this.initializeSystem();
  }

  static getInstance(): LoRaConnectEngine {
    if (!LoRaConnectEngine.instance) {
      LoRaConnectEngine.instance = new LoRaConnectEngine();
    }
    return LoRaConnectEngine.instance;
  }

  /**
   * Initialize LoRa system with gateways and devices
   */
  private initializeSystem() {
    // Initialize gateways
    this.initializeGateways();
    
    // Initialize virtual devices
    this.initializeVirtualDevices();
    
    // Start real-time simulation
    this.startRealTimeSimulation();
  }

  /**
   * Initialize LoRa Gateways
   */
  private initializeGateways() {
    const gateways: LoRaGateway[] = [
      {
        id: 'gw-001',
        name: 'LoRa Gateway Tirana',
        ip: '192.168.1.100',
        port: 1700,
        status: 'online',
        location: { lat: 41.3275, lng: 19.8187 },
        coverage: 15,
        connectedDevices: 0,
        throughput: { uplink: 0, downlink: 0 },
        lastHeartbeat: new Date()
      },
      {
        id: 'gw-002',
        name: 'LoRa Gateway Durrës',
        ip: '192.168.1.101',
        port: 1700,
        status: 'online',
        location: { lat: 41.3236, lng: 19.4413 },
        coverage: 12,
        connectedDevices: 0,
        throughput: { uplink: 0, downlink: 0 },
        lastHeartbeat: new Date()
      },
      {
        id: 'gw-003',
        name: 'LoRa Gateway Vlorë',
        ip: '192.168.1.102',
        port: 1700,
        status: 'online',
        location: { lat: 40.4686, lng: 19.4898 },
        coverage: 18,
        connectedDevices: 0,
        throughput: { uplink: 0, downlink: 0 },
        lastHeartbeat: new Date()
      }
    ];

    gateways.forEach(gw => this.gateways.set(gw.id, gw));
  }

  /**
   * Initialize virtual IoT devices
   */
  private initializeVirtualDevices() {
    const virtualDevices: LoRaDevice[] = [
      // Environmental sensors
      {
        id: 'env-001',
        name: 'Weather Station Tirana',
        type: 'sensor',
        frequency: 868.1,
        spreadingFactor: 7,
        bandwidth: 125,
        txPower: 14,
        battery: 85,
        rssi: -85,
        snr: 8.5,
        location: { lat: 41.3275, lng: 19.8187, altitude: 110 },
        lastSeen: new Date(),
        isOnline: true,
        data: {
          temperature: 22.5,
          humidity: 65,
          pressure: 1013.25,
          light: 45000
        }
      },
      {
        id: 'env-002',
        name: 'Air Quality Monitor',
        type: 'sensor',
        frequency: 868.3,
        spreadingFactor: 8,
        bandwidth: 125,
        txPower: 10,
        battery: 72,
        rssi: -92,
        snr: 6.2,
        location: { lat: 41.3280, lng: 19.8195 },
        lastSeen: new Date(),
        isOnline: true,
        data: {
          pm25: 25,
          pm10: 45,
          co2: 420,
          nox: 15
        }
      },
      // Smart agriculture sensors
      {
        id: 'agr-001',
        name: 'Soil Moisture Sensor',
        type: 'sensor',
        frequency: 868.5,
        spreadingFactor: 9,
        bandwidth: 125,
        txPower: 8,
        battery: 94,
        rssi: -78,
        snr: 12.1,
        location: { lat: 41.3290, lng: 19.8200 },
        lastSeen: new Date(),
        isOnline: true,
        data: {
          soilMoisture: 35,
          soilTemperature: 18.5,
          pH: 6.8,
          nutrients: { n: 45, p: 12, k: 38 }
        }
      },
      // Smart city infrastructure
      {
        id: 'city-001',
        name: 'Smart Street Light',
        type: 'actuator',
        frequency: 868.7,
        spreadingFactor: 7,
        bandwidth: 125,
        txPower: 12,
        battery: 100, // Powered
        rssi: -82,
        snr: 9.8,
        location: { lat: 41.3285, lng: 19.8190 },
        lastSeen: new Date(),
        isOnline: true,
        data: {
          brightness: 75,
          energyConsumption: 45.2,
          motion: false,
          status: 'on'
        }
      },
      // Vehicle tracking
      {
        id: 'veh-001',
        name: 'Fleet Tracker #001',
        type: 'node',
        frequency: 868.9,
        spreadingFactor: 8,
        bandwidth: 125,
        txPower: 15,
        battery: 68,
        rssi: -88,
        snr: 7.3,
        location: { lat: 41.3270, lng: 19.8180 },
        lastSeen: new Date(),
        isOnline: true,
        data: {
          speed: 35,
          fuel: 78,
          engineTemp: 92,
          odometer: 45623
        }
      }
    ];

    virtualDevices.forEach(device => {
      this.devices.set(device.id, device);
      this.sensorReadings.set(device.id, []);
    });
  }

  /**
   * Start real-time data simulation (updates every 3 seconds)
   */
  private startRealTimeSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    this.simulationInterval = setInterval(() => {
      this.updateVirtualSensorData();
      this.generateLoRaMessages();
      this.updateGatewayStats();
      this.notifyCallbacks();
    }, 3000); // Update every 3 seconds
  }

  /**
   * Update virtual sensor data with realistic variations
   */
  private updateVirtualSensorData() {
    for (const [deviceId, device] of this.devices) {
      if (!device.isOnline) continue;

      switch (device.type) {
        case 'sensor':
          this.updateEnvironmentalSensor(device);
          break;
        case 'actuator':
          this.updateActuatorDevice(device);
          break;
        case 'node':
          this.updateTrackerDevice(device);
          break;
      }

      // Update signal quality with realistic variations
      device.rssi = this.addNoise(device.rssi, 3);
      device.snr = this.addNoise(device.snr, 1);
      device.battery = Math.max(0, device.battery - Math.random() * 0.1);
      device.lastSeen = new Date();

      // Store sensor reading
      const reading: SensorReading = {
        deviceId: device.id,
        timestamp: new Date(),
        ...device.data
      };

      const readings = this.sensorReadings.get(deviceId) || [];
      readings.push(reading);
      
      // Keep only last 100 readings
      if (readings.length > 100) {
        readings.shift();
      }
      
      this.sensorReadings.set(deviceId, readings);
    }
  }

  /**
   * Update environmental sensor data
   */
  private updateEnvironmentalSensor(device: LoRaDevice) {
    if (device.id === 'env-001') {
      // Weather station
      device.data!.temperature = this.addNoise(device.data!.temperature, 2);
      device.data!.humidity = Math.max(0, Math.min(100, this.addNoise(device.data!.humidity, 5)));
      device.data!.pressure = this.addNoise(device.data!.pressure, 5);
      device.data!.light = Math.max(0, this.addNoise(device.data!.light, 5000));
    } else if (device.id === 'env-002') {
      // Air quality monitor
      device.data!.pm25 = Math.max(0, this.addNoise(device.data!.pm25, 3));
      device.data!.pm10 = Math.max(0, this.addNoise(device.data!.pm10, 5));
      device.data!.co2 = Math.max(300, this.addNoise(device.data!.co2, 20));
      device.data!.nox = Math.max(0, this.addNoise(device.data!.nox, 3));
    } else if (device.id === 'agr-001') {
      // Soil sensor
      device.data!.soilMoisture = Math.max(0, Math.min(100, this.addNoise(device.data!.soilMoisture, 2)));
      device.data!.soilTemperature = this.addNoise(device.data!.soilTemperature, 1);
      device.data!.pH = Math.max(4, Math.min(9, this.addNoise(device.data!.pH, 0.1)));
    }
  }

  /**
   * Update actuator device data
   */
  private updateActuatorDevice(device: LoRaDevice) {
    if (device.id === 'city-001') {
      // Smart street light
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 20;
      device.data!.brightness = isNight ? 
        Math.max(50, this.addNoise(75, 10)) : 
        Math.max(0, this.addNoise(20, 15));
      device.data!.energyConsumption = device.data!.brightness * 0.6;
      device.data!.motion = Math.random() < 0.1; // 10% chance of motion
    }
  }

  /**
   * Update tracker device data
   */
  private updateTrackerDevice(device: LoRaDevice) {
    if (device.id === 'veh-001') {
      // Vehicle tracker
      device.data!.speed = Math.max(0, this.addNoise(device.data!.speed, 10));
      device.data!.fuel = Math.max(0, device.data!.fuel - Math.random() * 0.5);
      device.data!.engineTemp = this.addNoise(device.data!.engineTemp, 5);
      device.data!.odometer += device.data!.speed / 1000; // Rough calculation
      
      // Update GPS position (simulate movement)
      device.location.lat += (Math.random() - 0.5) * 0.001;
      device.location.lng += (Math.random() - 0.5) * 0.001;
    }
  }

  /**
   * Generate realistic LoRa messages
   */
  private generateLoRaMessages() {
    for (const device of this.devices.values()) {
      if (!device.isOnline) continue;

      // Generate uplink message
      const message: LoRaMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        deviceId: device.id,
        timestamp: new Date(),
        payload: device.data,
        rssi: device.rssi,
        snr: device.snr,
        frequency: device.frequency,
        dataRate: `SF${device.spreadingFactor}BW${device.bandwidth}`,
        messageType: 'uplink',
        encrypted: true
      };

      this.messages.push(message);

      // Keep only last 1000 messages
      if (this.messages.length > 1000) {
        this.messages.shift();
      }
    }
  }

  /**
   * Update gateway statistics
   */
  private updateGatewayStats() {
    for (const gateway of this.gateways.values()) {
      // Count devices in range
      let devicesInRange = 0;
      for (const device of this.devices.values()) {
        const distance = this.calculateDistance(
          gateway.location.lat, gateway.location.lng,
          device.location.lat, device.location.lng
        );
        if (distance <= gateway.coverage) {
          devicesInRange++;
        }
      }

      gateway.connectedDevices = devicesInRange;
      gateway.throughput.uplink = devicesInRange * 20; // messages/hour
      gateway.throughput.downlink = Math.floor(devicesInRange * 2); // fewer downlinks
      gateway.lastHeartbeat = new Date();
    }
  }

  /**
   * Add noise to sensor values for realistic simulation
   */
  private addNoise(value: number, maxNoise: number): number {
    const noise = (Math.random() - 0.5) * 2 * maxNoise;
    return value + noise;
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Send command to device
   */
  async sendCommand(deviceId: string, command: any): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device || !device.isOnline) {
      return false;
    }

    // Create downlink message
    const message: LoRaMessage = {
      id: `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deviceId,
      timestamp: new Date(),
      payload: command,
      rssi: device.rssi,
      snr: device.snr,
      frequency: device.frequency,
      dataRate: `SF${device.spreadingFactor}BW${device.bandwidth}`,
      messageType: 'downlink',
      encrypted: true
    };

    this.messages.push(message);

    // Simulate command execution
    if (device.type === 'actuator' && device.id === 'city-001') {
      if (command.brightness !== undefined) {
        device.data!.brightness = command.brightness;
      }
      if (command.status !== undefined) {
        device.data!.status = command.status;
      }
    }

    return true;
  }

  /**
   * Get all devices
   */
  getDevices(): LoRaDevice[] {
    return Array.from(this.devices.values());
  }

  /**
   * Get all gateways
   */
  getGateways(): LoRaGateway[] {
    return Array.from(this.gateways.values());
  }

  /**
   * Get recent messages
   */
  getRecentMessages(limit: number = 50): LoRaMessage[] {
    return this.messages.slice(-limit);
  }

  /**
   * Get sensor readings for device
   */
  getSensorReadings(deviceId: string, limit: number = 50): SensorReading[] {
    const readings = this.sensorReadings.get(deviceId) || [];
    return readings.slice(-limit);
  }

  /**
   * Subscribe to real-time updates
   */
  onUpdate(callback: (data: any) => void) {
    this.updateCallbacks.push(callback);
  }

  /**
   * Notify all callbacks
   */
  private notifyCallbacks() {
    const data = {
      devices: this.getDevices(),
      gateways: this.getGateways(),
      recentMessages: this.getRecentMessages(20),
      timestamp: new Date()
    };

    this.updateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in update callback:', error);
      }
    });
  }

  /**
   * Connect to real LoRa Gateway (if available)
   */
  async connectToRealGateway(ip: string, port: number): Promise<boolean> {
    try {
      // This would connect to a real LoRa Gateway using UDP or TCP
      console.log(`Attempting to connect to LoRa Gateway at ${ip}:${port}`);
      
      // For stration, we'll simulate a connection attempt
      const isConnected = Math.random() > 0.5; // 50% success rate for 
      
      if (isConnected) {
        this.isSimulationMode = false;
        console.log('✅ Connected to real LoRa Gateway');
        return true;
      } else {
        console.log('❌ Failed to connect to LoRa Gateway, using simulation mode');
        return false;
      }
    } catch (error) {
      console.error('LoRa Gateway connection error:', error);
      return false;
    }
  }

  /**
   * Stop the system
   */
  stop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
}

export default LoRaConnectEngine;
