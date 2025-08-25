/**
 * LoRa Gateway Controller
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { EventEmitter } from 'events';
import * as crypto from 'crypto';

export interface LoRaMessage {
  id: string;
  deviceId: string;
  payload: string;
  rssi: number;
  snr: number;
  timestamp: Date;
  frequency: number;
  dataRate: string;
}

export interface LoRaDevice {
  deviceId: string;
  name: string;
  lastSeen: Date;
  battery: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export class LoRaGateway extends EventEmitter {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private devices: Map<string, LoRaDevice> = new Map();
  private messages: LoRaMessage[] = [];
  private isConnected = false;
  
  constructor(private portPath: string = 'COM3', private baudRate: number = 115200) {
    super();
  }

  async connect(): Promise<void> {
    try {
      this.port = new SerialPort({
        path: this.portPath,
        baudRate: this.baudRate,
        autoOpen: false
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));
      
      this.port.on('open', () => {
        console.log('✅ LoRa Gateway connected');
        this.isConnected = true;
        this.emit('connected');
      });

      this.port.on('error', (err) => {
        console.error('❌ LoRa Gateway error:', err);
        this.emit('error', err);
      });

      this.port.on('close', () => {
        console.log('🔌 LoRa Gateway disconnected');
        this.isConnected = false;
        this.emit('disconnected');
      });

      this.parser.on('data', (data) => {
        this.handleIncomingData(data);
      });

      await this.port.open();
    } catch (error) {
      console.error('Failed to connect to LoRa Gateway:', error);
      throw error;
    }
  }

  private handleIncomingData(rawData: string): void {
    try {
      // Parse LoRa message format
      const data = rawData.trim();
      console.log('📡 Raw LoRa data:', data);

      // Example format: +RCV=10,5,HELLO,12,-30,40
      const rcvMatch = data.match(/\+RCV=(\d+),(\d+),(.+),(\d+),(-?\d+),(\d+)/);
      
      if (rcvMatch) {
        const [, address, length, payload, port, rssi, snr] = rcvMatch;
        
        const message: LoRaMessage = {
          id: crypto.randomUUID(),
          deviceId: `lora_${address}`,
          payload: payload,
          rssi: parseInt(rssi),
          snr: parseInt(snr),
          timestamp: new Date(),
          frequency: 868.1, // Default EU868
          dataRate: 'SF7BW125'
        };

        this.messages.push(message);
        
        // Update device info
        this.updateDevice(message.deviceId, payload);
        
        console.log('📨 LoRa Message received:', message);
        this.emit('message', message);
      }
    } catch (error) {
      console.error('Error parsing LoRa data:', error);
    }
  }

  private updateDevice(deviceId: string, payload: string): void {
    let device = this.devices.get(deviceId);
    
    if (!device) {
      device = {
        deviceId,
        name: `Device ${deviceId}`,
        lastSeen: new Date(),
        battery: 100
      };
    } else {
      device.lastSeen = new Date();
    }

    // Try to extract battery level from payload
    const batteryMatch = payload.match(/bat:(\d+)/i);
    if (batteryMatch) {
      device.battery = parseInt(batteryMatch[1]);
    }

    this.devices.set(deviceId, device);
    this.emit('deviceUpdate', device);
  }

  async sendMessage(deviceId: string, message: string): Promise<void> {
    if (!this.isConnected || !this.port) {
      throw new Error('LoRa Gateway not connected');
    }

    // Format: AT+SEND=address,length,data
    const address = deviceId.replace('lora_', '');
    const command = `AT+SEND=${address},${message.length},${message}\n`;
    
    console.log('📤 Sending LoRa command:', command.trim());
    
    return new Promise((resolve, reject) => {
      this.port!.write(command, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  getDevices(): LoRaDevice[] {
    return Array.from(this.devices.values());
  }

  getMessages(deviceId?: string): LoRaMessage[] {
    if (deviceId) {
      return this.messages.filter(msg => msg.deviceId === deviceId);
    }
    return this.messages;
  }

  getStatus() {
    return {
      connected: this.isConnected,
      portPath: this.portPath,
      baudRate: this.baudRate,
      deviceCount: this.devices.size,
      messageCount: this.messages.length,
      lastMessage: this.messages[this.messages.length - 1]
    };
  }

  async disconnect(): Promise<void> {
    if (this.port && this.isConnected) {
      return new Promise((resolve) => {
        this.port!.close((error) => {
          if (error) {
            console.error('Error closing LoRa port:', error);
          }
          resolve();
        });
      });
    }
  }
}

// Singleton instance
export const loraGateway = new LoRaGateway();
