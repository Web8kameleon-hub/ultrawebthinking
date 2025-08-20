/**
 * Advanced LoRa Connect Scenarios
 * Skenare të Avancuara LoRa Connect
 * 
 * This creates realistic IoT scenarios with dynamic events
 */

import LoRaConnectEngine, { LoRaDevice } from './loraConnectEngine';

class LoRaScenarioEngine {
  private loraEngine: LoRaConnectEngine;
  private scenarios: Map<string, () => void> = new Map();
  private isRunning: boolean = false;

  constructor() {
    this.loraEngine = LoRaConnectEngine.getInstance();
    this.initializeScenarios();
  }

  private initializeScenarios() {
    // Scenario 1: Morning rush hour traffic
    this.scenarios.set('morning_rush', () => {
      console.log('🌅 Scenario: Morning Rush Hour - Increased vehicle tracking');
      
      // Simulate more vehicles on the road
      for (let i = 2; i <= 5; i++) {
        const vehicleId = `veh-00${i}`;
        this.addVirtualVehicle(vehicleId, `Fleet Tracker #00${i}`, {
          lat: 41.3270 + (Math.random() - 0.5) * 0.01,
          lng: 19.8180 + (Math.random() - 0.5) * 0.01
        });
      }
    });

    // Scenario 2: Weather alert system
    this.scenarios.set('weather_alert', () => {
      console.log('⛈️ Scenario: Severe Weather - Environmental sensors on high alert');
      
      // Simulate storm conditions
      const weatherStation = this.loraEngine.getDevices().find((d: LoRaDevice) => d.id === 'env-001');
      if (weatherStation?.data) {
        weatherStation.data.temperature = 15 + Math.random() * 5; // Cooler
        weatherStation.data.humidity = 85 + Math.random() * 10; // Higher humidity
        weatherStation.data.pressure = 990 + Math.random() * 10; // Lower pressure
        weatherStation.data.light = 5000 + Math.random() * 10000; // Darker
      }

      // Air quality changes due to weather
      const airQuality = this.loraEngine.getDevices().find((d: LoRaDevice) => d.id === 'env-002');
      if (airQuality?.data) {
        airQuality.data.pm25 = 35 + Math.random() * 15; // Increased particles
        airQuality.data.pm10 = 55 + Math.random() * 20;
      }
    });

    // Scenario 3: Smart city optimization
    this.scenarios.set('smart_city', async () => {
      console.log('🏙️ Scenario: Smart City Optimization - Automatic street light management');
      
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour > 18;
      
      // Automatically adjust street lights based on conditions
      const streetLight = this.loraEngine.getDevices().find((d: LoRaDevice) => d.id === 'city-001');
      if (streetLight) {
        const brightness = isNight ? 
          Math.max(60, 100 - Math.random() * 40) : // 60-100% at night
          Math.max(0, 30 - Math.random() * 30); // 0-30% during day
        
        await this.loraEngine.sendCommand('city-001', {
          brightness: Math.round(brightness),
          status: brightness > 10 ? 'on' : 'off',
          mode: 'auto'
        });
        
        console.log(`💡 Street light adjusted to ${Math.round(brightness)}% brightness`);
      }
    });

    // Scenario 4: Agricultural monitoring
    this.scenarios.set('agriculture', () => {
      console.log('🌱 Scenario: Smart Agriculture - Soil monitoring and irrigation');
      
      const soilSensor = this.loraEngine.getDevices().find((d: LoRaDevice) => d.id === 'agr-001');
      if (soilSensor?.data) {
        // Simulate seasonal changes
        const season = this.getCurrentSeason();
        
        switch (season) {
          case 'spring':
            soilSensor.data.soilMoisture = 40 + Math.random() * 20;
            soilSensor.data.soilTemperature = 15 + Math.random() * 8;
            break;
          case 'summer':
            soilSensor.data.soilMoisture = 20 + Math.random() * 25;
            soilSensor.data.soilTemperature = 22 + Math.random() * 10;
            break;
          case 'autumn':
            soilSensor.data.soilMoisture = 35 + Math.random() * 25;
            soilSensor.data.soilTemperature = 18 + Math.random() * 8;
            break;
          case 'winter':
            soilSensor.data.soilMoisture = 45 + Math.random() * 20;
            soilSensor.data.soilTemperature = 8 + Math.random() * 6;
            break;
        }
        
        console.log(`🌱 Soil conditions updated for ${season}`);
      }
    });

    // Scenario 5: Emergency response
    this.scenarios.set('emergency', async () => {
      console.log('🚨 Scenario: Emergency Response - High priority alerts');
      
      // Simulate emergency - all street lights to maximum
      await this.loraEngine.sendCommand('city-001', {
        brightness: 100,
        status: 'on',
        mode: 'emergency',
        priority: 'high'
      });

      // Enhanced vehicle tracking
      const vehicles = this.loraEngine.getDevices().filter((d: LoRaDevice) => d.type === 'node');
      vehicles.forEach((vehicle: LoRaDevice) => {
        if (vehicle.data) {
          vehicle.data.speed = Math.max(vehicle.data.speed || 0, 20 + Math.random() * 40);
          vehicle.data.priority = 'emergency';
        }
      });

      console.log('🚨 Emergency mode activated - All systems on high alert');
    });

    // Scenario 6: Network maintenance
    this.scenarios.set('maintenance', () => {
      console.log('🔧 Scenario: Network Maintenance - Simulating device outages');
      
      const devices = this.loraEngine.getDevices();
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      
      if (randomDevice) {
        randomDevice.isOnline = false;
        randomDevice.rssi = -120; // Very poor signal
        
        console.log(`🔧 Device ${randomDevice.name} temporarily offline for maintenance`);
        
        // Bring it back online after 10 seconds
        setTimeout(() => {
          randomDevice.isOnline = true;
          randomDevice.rssi = -80 + Math.random() * 20;
          console.log(`✅ Device ${randomDevice.name} back online`);
        }, 10000);
      }
    });
  }

  private addVirtualVehicle(id: string, name: string, location: {lat: number, lng: number}) {
    // This would add a new vehicle to the system dynamically
    console.log(`🚗 Adding virtual vehicle: ${name}`);
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  public async runScenario(scenarioName: string): Promise<void> {
    const scenario = this.scenarios.get(scenarioName);
    if (scenario) {
      console.log(`\n🎬 Running scenario: ${scenarioName}`);
      scenario();
    } else {
      console.log(`❌ Scenario not found: ${scenarioName}`);
    }
  }

  public async runRandomScenarios(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🎲 Starting random scenario generator...\n');

    const scenarioNames = Array.from(this.scenarios.keys());
    
    const runRandomScenario = () => {
      if (!this.isRunning) return;
      
      const randomScenario = scenarioNames[Math.floor(Math.random() * scenarioNames.length)];
      this.runScenario(randomScenario);
      
      // Schedule next scenario in 15-45 seconds
      const nextDelay = 15000 + Math.random() * 30000;
      setTimeout(runRandomScenario, nextDelay);
    };

    // Start first scenario after 5 seconds
    setTimeout(runRandomScenario, 5000);
  }

  public stopScenarios(): void {
    this.isRunning = false;
    console.log('⏹️ Scenario generator stopped');
  }

  public listScenarios(): string[] {
    return Array.from(this.scenarios.keys());
  }
}

// Demo execution
async function runLoRaScenarios() {
  console.log('🎭 LoRa Connect Advanced Scenarios Demo\n');
  
  const scenarioEngine = new LoRaScenarioEngine();
  
  console.log('Available scenarios:', scenarioEngine.listScenarios().join(', '));
  console.log('\n🚀 Starting demo sequence...\n');
  
  // Run specific scenarios in sequence
  await scenarioEngine.runScenario('smart_city');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await scenarioEngine.runScenario('weather_alert');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await scenarioEngine.runScenario('agriculture');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await scenarioEngine.runScenario('emergency');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Start random scenario generator
  scenarioEngine.runRandomScenarios();
  
  console.log('\n✨ Demo sequence complete!');
  console.log('🎲 Random scenarios will continue running...');
  console.log('🌐 Open http://localhost:3000 and go to LoRa Connect tab to see live updates');
  console.log('💡 The dashboard updates every 3 seconds with real-time data');
  
  // Stop after 2 minutes for demo
  setTimeout(() => {
    scenarioEngine.stopScenarios();
    console.log('\n🏁 Demo completed - scenarios stopped');
  }, 120000);
}

// Run demo automatically
runLoRaScenarios().catch(console.error);

export { LoRaScenarioEngine };
