/**
 * Real LoRa Gateway Integration
 * Integrimi i Gateway LoRa të Vërtetë
 * 
 * This module handles connection to real LoRa gateways using UDP protocol
 * Kodi për lidhjen me gateway LoRa fizike me protokoll UDP
 */

import dgram from 'dgram';
import { EventEmitter } from 'events';

export interface GatewayPacket {
  rxpk?: Array<{
    time: string;
    tmms?: number;
    tmst: number;
    freq: number;
    chan: number;
    rfch: number;
    stat: number;
    modu: string;
    datr: string;
    codr: string;
    lsnr: number;
    rssi: number;
    size: number;
    data: string;
  }>;
  stat?: {
    time: string;
    lati: number;
    long: number;
    alti: number;
    rxnb: number;
    rxok: number;
    rxfw: number;
    ackr: number;
    dwnb: number;
    txnb: number;
  };
}

export interface LoRaPacket {
  gatewayId: string;
  frequency: number;
  dataRate: string;
  codingRate: string;
  rssi: number;
  snr: number;
  payload: string;
  timestamp: Date;
  rawData: any;
}

export class RealLoRaGateway extends EventEmitter {
  private udpServer: dgram.Socket;
  private connectedGateways: Map<string, { ip: string; port: number; lastSeen: Date }> = new Map();
  private isListening: boolean = false;
  private port: number;

  constructor(port: number = 1700) {
    super();
    this.port = port;
    this.udpServer = dgram.createSocket('udp4');
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.udpServer.on('message', (msg, rinfo) => {
      this.handleGatewayMessage(msg, rinfo);
    });

    this.udpServer.on('error', (error) => {
      console.error('❌ LoRa Gateway UDP Server Error:', error);
      this.emit('error', error);
    });

    this.udpServer.on('listening', () => {
      const address = this.udpServer.address();
      console.log(`📡 LoRa Gateway Server listening on ${address?.address}:${address?.port}`);
      this.isListening = true;
      this.emit('listening', address);
    });
  }

  private handleGatewayMessage(message: Buffer, remoteInfo: dgram.RemoteInfo) {
    try {
      // LoRaWAN packet format: Version(1) + Token(2) + Type(1) + JSON
      const version = message[0];
      const token = message.readUInt16BE(1);
      const type = message[3];
      
      // Log raw packet for debugging
      console.log(`📨 Packet from ${remoteInfo.address}:${remoteInfo.port} - Type: ${this.getPacketTypeName(type)}`);

      const gatewayId = `${remoteInfo.address}:${remoteInfo.port}`;
      
      // Update gateway registry
      this.connectedGateways.set(gatewayId, {
        ip: remoteInfo.address,
        port: remoteInfo.port,
        lastSeen: new Date()
      });

      if (type === 0x00) {
        // PUSH_DATA packet
        this.handlePushDataPacket(message, gatewayId, remoteInfo);
      } else if (type === 0x02) {
        // PULL_DATA packet (gateway requesting downlink)
        this.handlePullDataPacket(message, gatewayId, remoteInfo);
      } else if (type === 0x05) {
        // TX_ACK packet (downlink acknowledgment)
        this.handleTxAckPacket(message, gatewayId, remoteInfo);
      }

      this.emit('gateway_message', {
        gatewayId,
        type,
        message,
        remoteInfo
      });

    } catch (error) {
      console.error('❌ Error processing gateway message:', error);
    }
  }

  private handlePushDataPacket(message: Buffer, gatewayId: string, remoteInfo: dgram.RemoteInfo) {
    try {
      // Extract JSON payload (after first 4 bytes: version + token + type)
      if (message.length > 12) { // Must have at least gateway ID (8 bytes) + header (4 bytes)
        const jsonStart = 12; // Version(1) + Token(2) + Type(1) + GatewayID(8)
        const jsonPayload = message.slice(jsonStart).toString('utf8');
        
        if (jsonPayload.length > 0) {
          const packet: GatewayPacket = JSON.parse(jsonPayload);
          
          // Process received packets (uplink)
          if (packet.rxpk && packet.rxpk.length > 0) {
            packet.rxpk.forEach(rxPacket => {
              const loraPacket: LoRaPacket = {
                gatewayId,
                frequency: rxPacket.freq,
                dataRate: rxPacket.datr,
                codingRate: rxPacket.codr,
                rssi: rxPacket.rssi,
                snr: rxPacket.lsnr,
                payload: rxPacket.data,
                timestamp: new Date(),
                rawData: rxPacket
              };

              console.log(`📡 LoRa Uplink: ${gatewayId} - RSSI: ${rxPacket.rssi} dBm, SNR: ${rxPacket.lsnr} dB`);
              this.emit('uplink', loraPacket);
            });
          }

          // Process gateway statistics
          if (packet.stat) {
            console.log(`📊 Gateway Stats: ${gatewayId} - Packets RX: ${packet.stat.rxnb}, TX: ${packet.stat.txnb}`);
            this.emit('gateway_stats', {
              gatewayId,
              stats: packet.stat,
              timestamp: new Date()
            });
          }
        }
      }

      // Send PUSH_ACK response
      this.sendPushAck(message, remoteInfo);

    } catch (error) {
      console.error('❌ Error handling PUSH_DATA packet:', error);
    }
  }

  private handlePullDataPacket(message: Buffer, gatewayId: string, remoteInfo: dgram.RemoteInfo) {
    // Gateway is requesting downlink data
    console.log(`📥 Gateway ${gatewayId} requesting downlink data`);
    
    // Send PULL_ACK response
    this.sendPullAck(message, remoteInfo);
    
    this.emit('downlink_request', { gatewayId, remoteInfo });
  }

  private handleTxAckPacket(message: Buffer, gatewayId: string, remoteInfo: dgram.RemoteInfo) {
    console.log(`✅ Downlink acknowledgment from ${gatewayId}`);
    this.emit('downlink_ack', { gatewayId, remoteInfo });
  }

  private sendPushAck(originalMessage: Buffer, remoteInfo: dgram.RemoteInfo) {
    // Create PUSH_ACK packet: Version(1) + Token(2) + PUSH_ACK(1)
    const ackPacket = Buffer.alloc(4);
    ackPacket[0] = originalMessage[0]; // Version
    ackPacket[1] = originalMessage[1]; // Token high byte
    ackPacket[2] = originalMessage[2]; // Token low byte
    ackPacket[3] = 0x01; // PUSH_ACK type

    this.udpServer.send(ackPacket, remoteInfo.port, remoteInfo.address, (error) => {
      if (error) {
        console.error('❌ Error sending PUSH_ACK:', error);
      }
    });
  }

  private sendPullAck(originalMessage: Buffer, remoteInfo: dgram.RemoteInfo) {
    // Create PULL_ACK packet: Version(1) + Token(2) + PULL_ACK(1)
    const ackPacket = Buffer.alloc(4);
    ackPacket[0] = originalMessage[0]; // Version
    ackPacket[1] = originalMessage[1]; // Token high byte
    ackPacket[2] = originalMessage[2]; // Token low byte
    ackPacket[3] = 0x04; // PULL_ACK type

    this.udpServer.send(ackPacket, remoteInfo.port, remoteInfo.address, (error) => {
      if (error) {
        console.error('❌ Error sending PULL_ACK:', error);
      }
    });
  }

  private getPacketTypeName(type: number): string {
    const types: Record<number, string> = {
      0x00: 'PUSH_DATA',
      0x01: 'PUSH_ACK',
      0x02: 'PULL_DATA',
      0x03: 'PULL_RESP',
      0x04: 'PULL_ACK',
      0x05: 'TX_ACK'
    };
    return types[type] || `UNKNOWN(${type})`;
  }

  /**
   * Send downlink packet to gateway
   */
  public sendDownlink(gatewayId: string, packet: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const gateway = this.connectedGateways.get(gatewayId);
      if (!gateway) {
        reject(new Error(`Gateway ${gatewayId} not connected`));
        return;
      }

      try {
        // Create PULL_RESP packet with JSON payload
        const jsonPayload = JSON.stringify(packet);
        const jsonBuffer = Buffer.from(jsonPayload, 'utf8');
        
        // Header: Version(1) + Token(2) + PULL_RESP(1)
        const header = Buffer.alloc(4);
        header[0] = 0x02; // Protocol version
        header[1] = Math.floor(Math.random() * 256); // Random token
        header[2] = Math.floor(Math.random() * 256);
        header[3] = 0x03; // PULL_RESP type

        const fullPacket = Buffer.concat([header, jsonBuffer]);

        this.udpServer.send(fullPacket, gateway.port, gateway.ip, (error) => {
          if (error) {
            console.error('❌ Error sending downlink:', error);
            reject(error);
          } else {
            console.log(`📤 Downlink sent to ${gatewayId}`);
            resolve(true);
          }
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Start listening for LoRa gateway connections
   */
  public async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.udpServer.on('listening', () => {
        resolve();
      });
      
      this.udpServer.on('error', (error: any) => {
        reject(error);
      });
      
      this.udpServer.bind(this.port, '0.0.0.0');
    });
  }

  /**
   * Stop the gateway server
   */
  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.udpServer.close(() => {
        this.isListening = false;
        console.log('📡 LoRa Gateway Server stopped');
        resolve();
      });
    });
  }

  /**
   * Get connected gateways
   */
  public getConnectedGateways(): Array<{ id: string; ip: string; port: number; lastSeen: Date }> {
    return Array.from(this.connectedGateways.entries()).map(([id, info]) => ({
      id,
      ...info
    }));
  }

  /**
   * Check if server is listening
   */
  public isRunning(): boolean {
    return this.isListening;
  }
}

// Demo/Test server
async function startLoRaGatewayServer() {
  console.log('🚀 Starting Real LoRa Gateway Integration Server...\n');

  const gateway = new RealLoRaGateway(1700);

  // Event handlers
  gateway.on('listening', (address) => {
    console.log(`✅ LoRa Gateway Server ready at ${address.address}:${address.port}`);
    console.log('📡 Waiting for LoRa gateways to connect...');
    console.log('💡 Configure your LoRa gateway to send data to this server');
  });

  gateway.on('uplink', (packet: LoRaPacket) => {
    console.log(`📨 LoRa Uplink from ${packet.gatewayId}:`);
    console.log(`   Frequency: ${packet.frequency} MHz`);
    console.log(`   Data Rate: ${packet.dataRate}`);
    console.log(`   RSSI: ${packet.rssi} dBm`);
    console.log(`   SNR: ${packet.snr} dB`);
    console.log(`   Payload: ${packet.payload.substring(0, 50)}...`);
  });

  gateway.on('gateway_stats', (data) => {
    console.log(`📊 Gateway ${data.gatewayId} statistics updated`);
  });

  gateway.on('downlink_request', (data) => {
    console.log(`📥 Downlink request from ${data.gatewayId}`);
  });

  gateway.on('error', (error) => {
    console.error('❌ Gateway error:', error);
  });

  try {
    await gateway.start();
    
    // Keep server running
    console.log('\n🔄 Server running... Press Ctrl+C to stop');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down LoRa Gateway Server...');
      await gateway.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start LoRa Gateway Server:', error);
  }
}

// Export for use in other modules
export default RealLoRaGateway;

// Run server if executed directly
startLoRaGatewayServer().catch(console.error);
